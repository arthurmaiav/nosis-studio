import { copyFile, mkdir, readFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { readJsonFile, safeSegment, sha256, writeJsonFile, writeTextFile } from "../lib/files.ts";
import { bullet, code, heading } from "../lib/markdown.ts";
import { EpisodeSpecSchema, EvidencePacketSchema } from "../story/index.ts";
import { ShotManifestSchema, type ProviderSettings, type ShotSpec } from "./schemas.ts";

type PackageEpisodeOptions = {
  episodeSpecPath: string;
  evidencePath: string;
  storyboardPath: string;
  shotManifestPath: string;
  outputRoot: string;
};

export type PackageEpisodeResult = {
  packageDirectory: string;
  takeDirectories: string[];
  generatedTakeCount: number;
  editorTakeCount: number;
};

function packageTimestamp(): string {
  return new Date().toISOString().replaceAll(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

async function copyWithHash(source: string, destination: string): Promise<{ path: string; sha256: string }> {
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination);
  return {
    path: destination,
    sha256: sha256(await readFile(destination))
  };
}

function firstFrameBrief(shot: ShotSpec, environmentName: string): string {
  const lines = [
    heading(1, `${shot.id} first-frame brief`),
    "",
    bullet(`Primary action: ${shot.singleAction}`),
    bullet(`Camera axis: ${shot.camera.axis}`),
    bullet(`Framing: ${shot.camera.framing}`),
    bullet(`Camera motion: ${shot.camera.motion}`),
    bullet(`Locked set: ${environmentName}`),
    "",
    heading(2, "Cast state"),
    ""
  ];
  if (shot.cast.length === 0) {
    lines.push("No resident is visible.", "");
  } else {
    lines.push(...shot.cast.map((member) => bullet(
      `${member.id}, ${member.behavior}: ${member.screenPosition}`
    )), "");
  }
  lines.push(heading(2, "Prop state"), "");
  if (shot.props.length === 0) {
    lines.push("No physical prop is generated.", "");
  } else {
    for (const prop of shot.props) {
      lines.push(
        bullet(`${prop.id}, count ${prop.count}`),
        `  - Position: ${prop.position}`,
        `  - Start: ${prop.startState}`,
        `  - End: ${prop.endState}`,
        `  - May move: ${prop.mayMove ? "yes" : "no"}`
      );
    }
    lines.push("");
  }
  lines.push(
    heading(2, "Exact opening state"),
    "",
    shot.startState,
    "",
    heading(2, "Required ending state"),
    "",
    shot.endState,
    "",
    heading(2, "Editor-owned elements"),
    ""
  );
  lines.push(
    ...(shot.editorOverlays.length > 0
      ? shot.editorOverlays.map((overlay) => bullet(overlay))
      : ["None."]),
    "",
    "Create and approve this exact composition before motion generation."
  );
  return lines.join("\n");
}

function motionPrompt(shot: ShotSpec): string {
  const movingProps = shot.props.filter((prop) => prop.mayMove);
  return [
    "Use the first attached image only as the exact identity and proportion reference for the acting subject or moving prop. Use the second attached image as the exact accepted opening composition, set, wardrobe, props, camera, lighting, and placement.",
    "",
    `Vertical 9:16. ${shot.seconds} seconds. One continuous shot. Begin immediately from the supplied first frame.`,
    "",
    `Primary action, exactly one verb: ${shot.singleAction}.`,
    `Opening state: ${shot.startState}`,
    `Required ending state: ${shot.endState}`,
    `Camera: ${shot.camera.framing}, axis ${shot.camera.axis}, ${shot.camera.motion} motion.`,
    movingProps.length > 0
      ? `The only permitted moving props are: ${movingProps.map((prop) => `${prop.id}, count ${prop.count}`).join("; ")}.`
      : "No prop may move.",
    "",
    "Preserve the supplied character identity, proportions, wardrobe, set geometry, skyline, furniture, prop count, prop ownership, lighting, and screen direction. The non-acting subject, if any, performs only a small reaction.",
    "",
    "Silent generation. No spoken words, gibberish, music, captions, generated text, added or altered logos, watermark, camera cuts, new objects, disappearing objects, duplicate props, set changes, extra characters, extra limbs, extra fingers, duplicate tails, malformed hands, facial redesign, realistic animal anatomy, melting, morphing, or camera shake."
  ].join("\n");
}

function takeReadme(
  shot: ShotSpec,
  testSettings: ProviderSettings,
  finalSettings: ProviderSettings
): string {
  const lines = [
    heading(1, shot.id),
    "",
    bullet(`Kind: ${shot.kind}`),
    bullet(`Purpose: ${shot.singleAction}`),
    bullet(`Target duration: ${shot.seconds} seconds`),
    ""
  ];
  if (shot.kind === "editor") {
    lines.push(
      "This take is built deterministically in the editor. Do not submit it to a video model.",
      ""
    );
  } else {
    lines.push(
      heading(2, "Gate"),
      "",
      "Create `03-first-frame.png`, approve it in the silent animatic, then upload exactly:",
      "",
      "1. The acting identity reference from `references/`.",
      "2. `03-first-frame.png`.",
      "",
      "Design and prop references help create the first frame. They do not join the motion upload unless the package explicitly says so.",
      "",
      heading(2, "480p test"),
      "",
      bullet(`Provider: ${testSettings.provider}`),
      bullet(`Model: ${testSettings.model}`),
      bullet(`Mode: ${testSettings.mode}`),
      bullet(`Resolution: ${testSettings.resolution}`),
      bullet(`Quality: ${testSettings.quality}`),
      bullet(`Audio: ${testSettings.audio}`),
      bullet(`Batch: ${testSettings.batch}`),
      "",
      heading(2, "Final"),
      "",
      `After approval, change only the resolution to ${code(finalSettings.resolution)}.`,
      ""
    );
  }
  lines.push(heading(2, "Pass criteria"), "");
  lines.push(...shot.passCriteria.map((criterion) => bullet(criterion)), "");
  return lines.join("\n");
}

function reviewChecklist(shot: ShotSpec): string {
  const checks = [
    "The single intended action is obvious while muted.",
    "Every resident remains in the specified screen zone.",
    "Only the acting resident performs the primary action.",
    "Every important prop is present exactly once.",
    "Every prop begins and ends in its permitted state.",
    "The background matches the locked plate.",
    "The ending state supports the next edit.",
    "There is no generated text, speech, music, or camera cut.",
    ...shot.passCriteria
  ];
  return [
    heading(1, `${shot.id} review`),
    "",
    ...checks.map((check) => `- [ ] ${check}`),
    "",
    "Decision: [ ] approve  [ ] reject",
    "",
    "Review notes:",
    ""
  ].join("\n");
}

function packageReadme(
  title: string,
  premise: string,
  archiveBuild: string,
  takeCount: number
): string {
  return [
    heading(1, title),
    "",
    premise,
    "",
    bullet(`Archive build: ${code(archiveBuild)}`),
    bullet(`Take folders: ${takeCount}`),
    "",
    heading(2, "Workflow"),
    "",
    "1. Review `source/evidence.md` and `source/storyboard.md`.",
    "2. Create every `03-first-frame.png` from its brief and locked references.",
    "3. Assemble a silent slideshow animatic.",
    "4. Confirm an outsider understands the problem, reversal, and proof.",
    "5. Run one silent 480p test per generated take.",
    "6. Approve literal compliance before any 1080p run.",
    "7. Add narration, gibberish, Foley, captions, receipt card, music, and loop in post.",
    ""
  ].join("\n");
}

export async function packageEpisode(options: PackageEpisodeOptions): Promise<PackageEpisodeResult> {
  const episode = EpisodeSpecSchema.parse(await readJsonFile(options.episodeSpecPath));
  const evidence = EvidencePacketSchema.parse(await readJsonFile(options.evidencePath));
  const manifest = ShotManifestSchema.parse(await readJsonFile(options.shotManifestPath));
  if (episode.id !== evidence.episodeId || episode.id !== manifest.episodeId) {
    throw new Error("Episode, evidence, and shot manifest IDs do not match");
  }

  const packageDirectory = join(
    options.outputRoot,
    episode.id,
    evidence.archiveSnapshotId,
    packageTimestamp()
  );
  const sourceDirectory = join(packageDirectory, "source");
  const takeRoot = join(packageDirectory, "takes");
  await mkdir(sourceDirectory, { recursive: true });
  await copyFile(options.episodeSpecPath, join(sourceDirectory, "episode.json"));
  await copyFile(options.evidencePath, join(sourceDirectory, "evidence.json"));
  await copyFile(
    options.evidencePath.replace(/\.json$/, ".md"),
    join(sourceDirectory, "evidence.md")
  );
  await copyFile(options.storyboardPath, join(sourceDirectory, "storyboard.md"));
  await copyFile(options.shotManifestPath, join(sourceDirectory, "shot-manifest.json"));

  const manifestDirectory = dirname(options.shotManifestPath);
  const environmentSource = resolve(manifestDirectory, manifest.location.master);
  const takeDirectories: string[] = [];
  const takeIndex: Array<Record<string, unknown>> = [];

  for (const shot of manifest.shots) {
    const takeDirectory = join(takeRoot, shot.id);
    const referenceDirectory = join(takeDirectory, "references");
    await mkdir(referenceDirectory, { recursive: true });
    takeDirectories.push(takeDirectory);

    const assets: Array<{ key: string; path: string; sha256: string }> = [];
    if (shot.kind !== "editor") {
      const environment = await copyWithHash(
        environmentSource,
        join(referenceDirectory, `set-${basename(environmentSource)}`)
      );
      assets.push({ key: "environment", ...environment });
      for (const key of shot.referenceKeys) {
        const relativeSource = manifest.references[key];
        if (!relativeSource) {
          throw new Error(`Shot ${shot.id} references unknown asset key: ${key}`);
        }
        const source = resolve(manifestDirectory, relativeSource);
        const copied = await copyWithHash(
          source,
          join(referenceDirectory, `${safeSegment(key)}-${basename(source)}`)
        );
        assets.push({ key, ...copied });
      }
    }

    const prompt = shot.kind === "editor" ? "" : motionPrompt(shot);
    await writeTextFile(join(takeDirectory, "FIRST-FRAME-BRIEF.md"), firstFrameBrief(
      shot,
      manifest.location.id
    ));
    await writeTextFile(join(takeDirectory, "README.md"), takeReadme(
      shot,
      manifest.testSettings,
      manifest.finalSettings
    ));
    await writeTextFile(join(takeDirectory, "REVIEW.md"), reviewChecklist(shot));
    if (prompt) {
      await writeTextFile(join(takeDirectory, "prompt.txt"), prompt);
    }

    const takeManifest = {
      episodeId: episode.id,
      takeId: shot.id,
      kind: shot.kind,
      purpose: shot.singleAction,
      targetDurationSeconds: shot.seconds,
      state: {
        start: shot.startState,
        end: shot.endState
      },
      cast: shot.cast,
      props: shot.props,
      camera: shot.camera,
      editorOverlays: shot.editorOverlays,
      settings: {
        test: manifest.testSettings,
        final: manifest.finalSettings
      },
      assets: assets.map((asset) => ({
        key: asset.key,
        path: asset.path.replace(`${takeDirectory}/`, ""),
        sha256: asset.sha256
      })),
      lockedFirstFrame: null,
      promptSha256: prompt ? sha256(prompt) : null,
      estimatedCreditCost: null,
      providerJobId: null,
      approvedOutput: null,
      status: shot.kind === "editor" ? "editor-build-required" : "awaiting-first-frame",
      passCriteria: shot.passCriteria
    };
    await writeJsonFile(join(takeDirectory, "manifest.json"), takeManifest);
    takeIndex.push({
      takeId: shot.id,
      kind: shot.kind,
      directory: takeDirectory.replace(`${packageDirectory}/`, ""),
      status: takeManifest.status
    });
  }

  await writeJsonFile(join(packageDirectory, "package.json"), {
    episodeId: episode.id,
    title: episode.title,
    archiveBuild: evidence.archiveBuild,
    archiveSnapshotId: evidence.archiveSnapshotId,
    generatedAt: new Date().toISOString(),
    takes: takeIndex
  });
  await writeTextFile(join(packageDirectory, "README.md"), packageReadme(
    episode.title,
    episode.premise,
    evidence.archiveBuild,
    manifest.shots.length
  ));

  return {
    packageDirectory,
    takeDirectories,
    generatedTakeCount: manifest.shots.filter((shot) => shot.kind !== "editor").length,
    editorTakeCount: manifest.shots.filter((shot) => shot.kind === "editor").length
  };
}
