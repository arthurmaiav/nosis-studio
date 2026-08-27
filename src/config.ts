import { resolve } from "node:path";

export const projectRoot = resolve(import.meta.dir, "..");

export const studioDefaults = {
  archiveUrl: "https://9nosis.net/history/",
  rawDataDir: resolve(projectRoot, "data/raw"),
  databasePath: resolve(projectRoot, "data/studio.sqlite"),
  generatedDataDir: resolve(projectRoot, "data/generated"),
  episodesDir: resolve(projectRoot, "episodes"),
  characterCatalogPath: resolve(projectRoot, "references/characters/catalog.json"),
  assetCatalogPath: resolve(projectRoot, "references/common/catalog.json"),
  scenesDir: resolve(projectRoot, "scenes"),
  buildDir: resolve(projectRoot, "build/episodes")
} as const;
