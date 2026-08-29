#!/usr/bin/env bun

import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { packageAdaptation } from "./adaptations/index.ts";
import { ArchiveReader, syncArchive, type ArchiveSourceType } from "./archive/index.ts";
import { loadCommonAssetCatalog } from "./assets/index.ts";
import {
  characterCoverage,
  loadCharacterCatalog,
  type VisualMode
} from "./characters/index.ts";
import { projectRoot, studioDefaults } from "./config.ts";
import { loadFormatCatalog } from "./formats/index.ts";
import { excerpt } from "./lib/markdown.ts";
import { packageEpisode } from "./production/index.ts";
import { developStory, mineStories } from "./story/index.ts";

const sourceTypes = new Set<ArchiveSourceType>(["mail", "event", "resident", "journal"]);

function optionValue(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  if (index === -1) {
    return undefined;
  }
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

function hasFlag(args: string[], name: string): boolean {
  return args.includes(name);
}

function positionalArgs(args: string[]): string[] {
  const values: string[] = [];
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (!value) {
      continue;
    }
    if (value.startsWith("--")) {
      index += 1;
      continue;
    }
    values.push(value);
  }
  return values;
}

function positiveInteger(value: string | undefined, fallback: number, name: string): number {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer`);
  }
  return parsed;
}

function databasePath(args: string[]): string {
  return resolve(optionValue(args, "--db") ?? studioDefaults.databasePath);
}

async function requireDatabase(path: string): Promise<void> {
  try {
    await access(path);
  } catch {
    throw new Error(`Archive index not found at ${path}. Run 'bun run studio sync' first.`);
  }
}

async function withArchive<T>(
  args: string[],
  operation: (archive: ArchiveReader) => T | Promise<T>
): Promise<T> {
  const path = databasePath(args);
  await requireDatabase(path);
  const archive = new ArchiveReader(path);
  try {
    return await operation(archive);
  } finally {
    archive.close();
  }
}

async function syncCommand(args: string[]): Promise<void> {
  const snapshot = optionValue(args, "--snapshot");
  const result = await syncArchive({
    sourceUrl: optionValue(args, "--source") ?? studioDefaults.archiveUrl,
    rawDataDirectory: resolve(optionValue(args, "--raw") ?? studioDefaults.rawDataDir),
    databasePath: databasePath(args),
    ...(snapshot ? { snapshotDirectory: resolve(snapshot) } : {}),
    forceDownload: hasFlag(args, "--force-download"),
    forceIndex: hasFlag(args, "--force-index")
  });
  console.log(`Archive build: ${result.snapshot.builtAt}`);
  console.log(`Indexed records: ${result.indexedRecords}`);
  console.log(`Database: ${result.databasePath}`);
  console.log(`Reused index: ${result.reusedIndex ? "yes" : "no"}`);
}

async function searchCommand(args: string[]): Promise<void> {
  const query = positionalArgs(args).join(" ").trim();
  if (!query) {
    throw new Error("search requires a query");
  }
  const source = optionValue(args, "--type");
  if (source && !sourceTypes.has(source as ArchiveSourceType)) {
    throw new Error("--type must be mail, event, resident, or journal");
  }
  const limit = positiveInteger(optionValue(args, "--limit"), 20, "--limit");
  const records = await withArchive(args, (archive) => archive.search(query, {
    ...(source ? { sourceTypes: [source as ArchiveSourceType] } : {}),
    limit
  }));
  if (records.length === 0) {
    console.log("No records found.");
    return;
  }
  for (const record of records) {
    console.log(`[${record.locator}] ${record.iso ?? "no timestamp"}`);
    console.log(`${record.actor}${record.target ? ` -> ${record.target}` : ""}: ${record.subject}`);
    console.log(excerpt(record.body, 280));
    console.log(`evidence: ${record.id}\n`);
  }
}

async function mineCommand(args: string[]): Promise<void> {
  const limit = positiveInteger(optionValue(args, "--limit"), 25, "--limit");
  const output = resolve(optionValue(args, "--output") ?? studioDefaults.generatedDataDir);
  const result = await withArchive(args, (archive) => mineStories(archive, output, limit));
  console.log(`Candidates: ${result.candidates.length}`);
  console.log(`JSON: ${result.jsonPath}`);
  console.log(`Markdown: ${result.markdownPath}`);
  for (const candidate of result.candidates.slice(0, 5)) {
    console.log(`${candidate.score.toFixed(1)}  ${candidate.id}  ${candidate.title}`);
  }
}

async function charactersCommand(args: string[]): Promise<void> {
  const catalogPath = resolve(optionValue(args, "--catalog") ?? studioDefaults.characterCatalogPath);
  const result = await loadCharacterCatalog(catalogPath);
  if (hasFlag(args, "--json")) {
    console.log(JSON.stringify({
      sourceArchive: result.catalog.sourceArchive,
      characters: result.characters.map((character) => ({
        ...character,
        coverage: characterCoverage(character)
      }))
    }, null, 2));
    return;
  }
  console.log(`Characters: ${result.characters.length}`);
  for (const character of result.characters) {
    console.log(
      `${character.name} (${character.id})  ${character.roster}  ${characterCoverage(character)}  2d: ${character.masters["2d"].status}  3d: ${character.masters["3d"].status}`
    );
  }
}

async function assetsCommand(args: string[]): Promise<void> {
  const catalogPath = resolve(optionValue(args, "--catalog") ?? studioDefaults.assetCatalogPath);
  const result = await loadCommonAssetCatalog(catalogPath);
  if (hasFlag(args, "--json")) {
    console.log(JSON.stringify({ assets: result.assets }, null, 2));
    return;
  }
  console.log(`Common assets: ${result.assets.length}`);
  for (const asset of result.assets) {
    const approved = asset.visualReferences.filter((reference) => reference.status === "approved").length;
    const pending = asset.visualReferences.filter((reference) => reference.status === "pending").length;
    console.log(`${asset.name} (${asset.category})  approved refs: ${approved}  pending refs: ${pending}`);
  }
}

async function formatsCommand(args: string[]): Promise<void> {
  const catalogPath = resolve(optionValue(args, "--catalog") ?? studioDefaults.formatCatalogPath);
  const result = await loadFormatCatalog(catalogPath);
  if (hasFlag(args, "--json")) {
    console.log(JSON.stringify({ formats: result.formats }, null, 2));
    return;
  }
  console.log(`Formats: ${result.formats.length}`);
  for (const format of result.formats) {
    console.log(
      `${format.name} (${format.id})  ${format.delivery}  ${format.canvas.aspectRatio}`
    );
  }
}

async function developCommand(args: string[]): Promise<void> {
  const episodeId = positionalArgs(args)[0];
  if (!episodeId) {
    throw new Error("develop requires an episode ID");
  }
  const episodeDirectory = resolve(studioDefaults.episodesDir, episodeId);
  const specPath = resolve(optionValue(args, "--spec") ?? resolve(episodeDirectory, "episode.json"));
  const result = await withArchive(args, (archive) => developStory(
    archive,
    specPath,
    episodeDirectory
  ));
  console.log(`Episode: ${result.packet.title}`);
  console.log(`Archive build: ${result.packet.archiveBuild}`);
  console.log(`Claims: ${result.packet.claims.length}`);
  console.log(`JSON: ${result.jsonPath}`);
  console.log(`Markdown: ${result.markdownPath}`);
}

async function packageCommand(args: string[]): Promise<void> {
  const episodeId = positionalArgs(args)[0];
  if (!episodeId) {
    throw new Error("package requires an episode ID");
  }
  const episodeDirectory = resolve(studioDefaults.episodesDir, episodeId);
  const sceneDirectory = resolve(studioDefaults.scenesDir, episodeId);
  const result = await packageEpisode({
    episodeSpecPath: resolve(episodeDirectory, "episode.json"),
    evidencePath: resolve(episodeDirectory, "evidence.json"),
    storyboardPath: resolve(sceneDirectory, "storyboard.md"),
    shotManifestPath: resolve(sceneDirectory, "shot-manifest.json"),
    outputRoot: resolve(optionValue(args, "--output") ?? studioDefaults.buildDir)
  });
  console.log(`Package: ${result.packageDirectory}`);
  console.log(`Generated or hybrid takes: ${result.generatedTakeCount}`);
  console.log(`Editor takes: ${result.editorTakeCount}`);
}

async function adaptCommand(args: string[]): Promise<void> {
  const episodeId = positionalArgs(args)[0];
  if (!episodeId) {
    throw new Error("adapt requires an episode ID");
  }
  const formatId = optionValue(args, "--format");
  if (!formatId) {
    throw new Error("adapt requires --format <format-id>");
  }
  const visualModeValue = optionValue(args, "--visual");
  if (visualModeValue !== "2d" && visualModeValue !== "3d") {
    throw new Error("adapt requires --visual <2d|3d>");
  }
  const visualMode: VisualMode = visualModeValue;
  const result = await packageAdaptation({
    projectRoot,
    episodeSpecPath: resolve(studioDefaults.episodesDir, episodeId, "episode.json"),
    formatPath: resolve(studioDefaults.formatsDir, formatId, "format.json"),
    scriptPath: resolve(studioDefaults.adaptationsDir, episodeId, formatId, "script.json"),
    characterCatalogPath: studioDefaults.characterCatalogPath,
    visualMode,
    outputRoot: resolve(optionValue(args, "--output") ?? studioDefaults.adaptationBuildDir)
  });
  console.log(`Adaptation package: ${result.packageDirectory}`);
  console.log(`Content units: ${result.unitCount}`);
  console.log(`Evidence status: ${result.evidenceStatus}`);
}

function help(): void {
  console.log(`Nosis Studio

Usage:
  bun run studio sync [--snapshot <directory>] [--force-index]
  bun run studio search <query> [--type <source>] [--limit <count>]
  bun run studio mine [--limit <count>]
  bun run studio characters [--json]
  bun run studio assets [--json]
  bun run studio formats [--json]
  bun run studio develop <episode-id>
  bun run studio adapt <episode-id> --format <format-id> --visual <2d|3d>
  bun run studio package <episode-id>

Common options:
  --db <path>       Override the SQLite index
  --catalog <path>  Override the character catalog
  --output <path>   Override generated output directory
`);
}

async function main(): Promise<void> {
  const [command = "help", ...args] = Bun.argv.slice(2);
  switch (command) {
    case "sync":
      await syncCommand(args);
      return;
    case "search":
      await searchCommand(args);
      return;
    case "mine":
      await mineCommand(args);
      return;
    case "characters":
      await charactersCommand(args);
      return;
    case "assets":
      await assetsCommand(args);
      return;
    case "formats":
      await formatsCommand(args);
      return;
    case "develop":
      await developCommand(args);
      return;
    case "adapt":
      await adaptCommand(args);
      return;
    case "package":
      await packageCommand(args);
      return;
    case "help":
    case "--help":
    case "-h":
      help();
      return;
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

try {
  await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exitCode = 1;
}
