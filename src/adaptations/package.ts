import { copyFile, mkdir, readFile } from "node:fs/promises";
import { basename, dirname, join, relative, resolve } from "node:path";
import {
  approvedMaster,
  loadCharacterCatalog,
  type VisualMode
} from "../characters/index.ts";
import { FormatDefinitionSchema } from "../formats/index.ts";
import { readJsonFile, sha256, writeJsonFile, writeTextFile } from "../lib/files.ts";
import { EpisodeSpecSchema } from "../story/index.ts";
import { AdaptationScriptSchema, type AdaptationUnit } from "./schemas.ts";

type PackageAdaptationOptions = {
  projectRoot: string;
  episodeSpecPath: string;
  formatPath: string;
  scriptPath: string;
  characterCatalogPath: string;
  visualMode: VisualMode;
  outputRoot: string;
};

export type PackageAdaptationResult = {
  packageDirectory: string;
  unitCount: number;
  evidenceStatus: "verified" | "provisional-live";
};

function packageTimestamp(): string {
  return new Date().toISOString().replaceAll(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function promptForUnit(
  unit: AdaptationUnit,
  formatName: string,
  unitName: string,
  aspectRatio: string,
  visualMode: VisualMode,
  formatRules: string[]
): string {
  const letteringSlots = [
    unit.postText.headline ? "one headline area" : "",
    unit.postText.dialogue.length > 0 ? `${unit.postText.dialogue.length} empty speech balloon area(s)` : "",
    unit.postText.captions.length > 0 ? `${unit.postText.captions.length} empty caption area(s)` : "",
    unit.postText.labels.length > 0 ? `${unit.postText.labels.length} empty label area(s)` : ""
  ].filter(Boolean).join(", ");
  const rendering = visualMode === "2d" ? {
    style: "flat 2D character masters",
    preserve: "preserve the supplied linework, solid-fill palette, and hand-inked print texture",
    avoid: "3D rendering, gradients, modeled volume, realistic fur"
  } : {
    style: "dimensional 3D character masters",
    preserve: "preserve the supplied modeled proportions, materials, palette, and soft dimensional finish",
    avoid: "flat line-art conversion, illustrated outlines, realistic animal anatomy, realistic fur"
  };
  return [
    "Use case: illustration-story",
    `Asset type: ${unitName} for ${formatName}`,
    `Primary request: ${unit.action}`,
    `Scene/backdrop: ${unit.scene}`,
    `Subject: ${unit.cast.join(", ")}`,
    `Visual mode: use the attached ${rendering.style} as exact identity and rendering references`,
    `Composition/framing: ${unit.composition}; ${aspectRatio}`,
    `Lettering space: ${letteringSlots || "none"}`,
    `Format rules: ${formatRules.join(" ")}`,
    `Continuity: ${unit.continuity.join(" ")}`,
    `Constraints: preserve each supplied character's exact face, proportions, wardrobe, and role prop; ${rendering.preserve}; exactly one tail, two arms, two legs, and two gloved hands per character; leave all lettering areas blank`,
    `Avoid: generated letters or numbers, ${rendering.avoid}, robot anatomy, added characters, extra limbs, duplicate props, watermarks`
  ].join("\n");
}

export async function packageAdaptation(
  options: PackageAdaptationOptions
): Promise<PackageAdaptationResult> {
  const episode = EpisodeSpecSchema.parse(await readJsonFile(options.episodeSpecPath));
  const format = FormatDefinitionSchema.parse(await readJsonFile(options.formatPath));
  const script = AdaptationScriptSchema.parse(await readJsonFile(options.scriptPath));
  if (episode.id !== script.episodeId) {
    throw new Error("Episode and adaptation script IDs do not match");
  }
  if (format.id !== script.formatId) {
    throw new Error("Format and adaptation script IDs do not match");
  }
  if (script.units.length < format.unitCount.min || script.units.length > format.unitCount.max) {
    throw new Error(
      `${format.name} requires ${format.unitCount.min}-${format.unitCount.max} ${format.unitName}s`
    );
  }

  const episodeClaimIds = new Set(episode.claims.map((claim) => claim.id));
  const episodeCast = new Set(episode.cast);
  for (const unit of script.units) {
    for (const claimId of unit.sourceClaimIds) {
      if (!episodeClaimIds.has(claimId)) {
        throw new Error(`Adaptation unit ${unit.id} references unknown claim: ${claimId}`);
      }
    }
    for (const castId of unit.cast) {
      if (!episodeCast.has(castId)) {
        throw new Error(`Adaptation unit ${unit.id} uses cast member outside the episode: ${castId}`);
      }
    }
  }

  const characters = await loadCharacterCatalog(options.characterCatalogPath);
  const characterById = new Map(characters.characters.map((character) => [character.id, character]));
  const requiredCast = [...new Set(script.units.flatMap((unit) => unit.cast))];
  const packageDirectory = join(
    options.outputRoot,
    episode.id,
    format.id,
    options.visualMode,
    packageTimestamp()
  );
  const sourceDirectory = join(packageDirectory, "source");
  const referenceDirectory = join(packageDirectory, "references");
  const unitDirectory = join(packageDirectory, `${format.unitName}s`);
  await mkdir(sourceDirectory, { recursive: true });
  await mkdir(referenceDirectory, { recursive: true });
  await mkdir(unitDirectory, { recursive: true });

  const evidencePath = resolve(options.projectRoot, script.evidenceSource.path);
  await copyFile(options.episodeSpecPath, join(sourceDirectory, "episode.json"));
  await copyFile(options.formatPath, join(sourceDirectory, "format.json"));
  await copyFile(options.scriptPath, join(sourceDirectory, "script.json"));
  await copyFile(evidencePath, join(sourceDirectory, basename(evidencePath)));

  const packagedReferences: Array<{
    characterId: string;
    visualMode: VisualMode;
    path: string;
    sha256: string;
  }> = [];
  const characterCatalogRoot = dirname(options.characterCatalogPath);
  for (const castId of requiredCast) {
    const character = characterById.get(castId);
    if (!character) {
      throw new Error(`Character catalog is missing cast member: ${castId}`);
    }
    const master = approvedMaster(character, options.visualMode);
    if (!master) {
      throw new Error(
        `Character ${castId} has no approved ${options.visualMode} master sheet`
      );
    }
    const source = resolve(characterCatalogRoot, castId, master.path);
    const destination = join(
      referenceDirectory,
      `${castId}-${options.visualMode}-${basename(master.path)}`
    );
    await copyFile(source, destination);
    packagedReferences.push({
      characterId: castId,
      visualMode: options.visualMode,
      path: relative(packageDirectory, destination),
      sha256: sha256(await readFile(destination))
    });
  }

  const sortedUnits = [...script.units].sort((left, right) => left.sequence - right.sequence);
  for (const unit of sortedUnits) {
    const destination = join(unitDirectory, unit.id);
    await mkdir(destination, { recursive: true });
    const prompt = promptForUnit(
      unit,
      format.name,
      format.unitName,
      format.canvas.aspectRatio,
      options.visualMode,
      format.rules
    );
    await writeTextFile(join(destination, "prompt.txt"), prompt);
    await writeJsonFile(join(destination, "lettering.json"), unit.postText);
    await writeJsonFile(join(destination, "manifest.json"), {
      episodeId: episode.id,
      formatId: format.id,
      visualMode: options.visualMode,
      unitId: unit.id,
      sequence: unit.sequence,
      purpose: unit.purpose,
      sourceClaimIds: unit.sourceClaimIds,
      cast: unit.cast,
      references: packagedReferences.filter((reference) => unit.cast.includes(reference.characterId)),
      promptSha256: sha256(prompt),
      illustration: null,
      letteredOutput: null,
      status: "awaiting-illustration"
    });
  }

  await writeJsonFile(join(packageDirectory, "package.json"), {
    episodeId: episode.id,
    title: episode.title,
    formatId: format.id,
    formatName: format.name,
    visualMode: options.visualMode,
    evidence: script.evidenceSource,
    canvas: format.canvas,
    unitCount: sortedUnits.length,
    references: packagedReferences,
    units: sortedUnits.map((unit) => ({
      id: unit.id,
      sequence: unit.sequence,
      directory: relative(packageDirectory, join(unitDirectory, unit.id)),
      status: "awaiting-illustration"
    }))
  });

  return {
    packageDirectory,
    unitCount: sortedUnits.length,
    evidenceStatus: script.evidenceSource.status
  };
}
