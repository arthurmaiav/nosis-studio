import { describe, expect, test } from "bun:test";
import { access, cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { packageAdaptation } from "../src/adaptations/index.ts";
import { CharacterManifestSchema } from "../src/characters/index.ts";
import { projectRoot, studioDefaults } from "../src/config.ts";
import { loadFormatCatalog } from "../src/formats/index.ts";

describe("formats", () => {
  test("loads reusable comic and carousel definitions", async () => {
    const result = await loadFormatCatalog(studioDefaults.formatCatalogPath);
    expect(result.formats.map((format) => format.id)).toEqual([
      "comic-page",
      "social-carousel"
    ]);
    expect(result.formats.every((format) => !("visualProfile" in format))).toBe(true);
  });

  test("packages a format adaptation with evidence, prompts, lettering, and compatible masters", async () => {
    const outputRoot = await mkdtemp(join(tmpdir(), "nosis-adaptation-"));
    try {
      const result = await packageAdaptation({
        projectRoot,
        episodeSpecPath: resolve(
          studioDefaults.episodesDir,
          "the-village-voted-for-nobody/episode.json"
        ),
        formatPath: resolve(studioDefaults.formatsDir, "social-carousel/format.json"),
        scriptPath: resolve(
          studioDefaults.adaptationsDir,
          "the-village-voted-for-nobody/social-carousel/script.json"
        ),
        characterCatalogPath: studioDefaults.characterCatalogPath,
        visualMode: "2d",
        outputRoot
      });
      expect(result.unitCount).toBe(6);
      expect(result.evidenceStatus).toBe("provisional-live");
      await access(join(result.packageDirectory, "source/live-evidence.json"));
      await access(join(result.packageDirectory, "references/barkeep-2d-master-sheet.png"));
      await access(join(result.packageDirectory, "slides/s06-payoff/prompt.txt"));
      const prompt = await readFile(
        join(result.packageDirectory, "slides/s06-payoff/prompt.txt"),
        "utf8"
      );
      expect(prompt).toContain("leave all lettering areas blank");
      expect(prompt).toContain("flat 2D character masters");
    } finally {
      await rm(outputRoot, { recursive: true, force: true });
    }
  });

  test("blocks production only when the selected visual mode is missing", async () => {
    const outputRoot = await mkdtemp(join(tmpdir(), "nosis-adaptation-"));
    try {
      const characterCatalogRoot = join(outputRoot, "characters");
      await cp(dirname(studioDefaults.characterCatalogPath), characterCatalogRoot, {
        recursive: true
      });
      const barkeepManifestPath = join(characterCatalogRoot, "barkeep/character.json");
      const barkeepManifest = CharacterManifestSchema.parse(
        JSON.parse(await readFile(barkeepManifestPath, "utf8"))
      );
      const threeDMaster = barkeepManifest.masters["3d"];
      if (threeDMaster.status === "missing") {
        throw new Error("Expected Barkeep's 3D fixture to exist");
      }
      barkeepManifest.masters["3d"] = {
        ...threeDMaster,
        status: "pending",
        distribution: "local-only"
      };
      await writeFile(
        barkeepManifestPath,
        `${JSON.stringify(barkeepManifest, null, 2)}\n`,
        "utf8"
      );
      await expect(packageAdaptation({
        projectRoot,
        episodeSpecPath: resolve(
          studioDefaults.episodesDir,
          "the-village-voted-for-nobody/episode.json"
        ),
        formatPath: resolve(studioDefaults.formatsDir, "social-carousel/format.json"),
        scriptPath: resolve(
          studioDefaults.adaptationsDir,
          "the-village-voted-for-nobody/social-carousel/script.json"
        ),
        characterCatalogPath: join(characterCatalogRoot, "catalog.json"),
        visualMode: "3d",
        outputRoot
      })).rejects.toThrow("Character barkeep has no approved 3d master sheet");
    } finally {
      await rm(outputRoot, { recursive: true, force: true });
    }
  });
});
