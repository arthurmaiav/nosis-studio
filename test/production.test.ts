import { afterEach, describe, expect, test } from "bun:test";
import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { packageEpisode } from "../src/production/index.ts";

const temporaryDirectories: string[] = [];

async function writeJson(path: string, value: unknown): Promise<void> {
  await writeFile(path, `${JSON.stringify(value)}\n`);
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((path) => rm(path, {
    recursive: true,
    force: true
  })));
});

describe("production", () => {
  test("creates deterministic generated and editor take folders", async () => {
    const root = await mkdtemp(join(tmpdir(), "nosis-production-"));
    temporaryDirectories.push(root);
    const episodePath = join(root, "episode.json");
    const evidencePath = join(root, "evidence.json");
    const storyboardPath = join(root, "storyboard.md");
    const shotManifestPath = join(root, "shot-manifest.json");
    const setPath = join(root, "set.png");
    const characterPath = join(root, "worker.png");

    const episode = {
      id: "fixture",
      title: "Fixture",
      premise: "A resident proves one action.",
      protagonist: "Worker",
      want: "Complete the task.",
      obstacle: "The gate is closed.",
      reversal: "Proof opens it.",
      payoff: "The record is visible.",
      cast: ["worker"],
      claims: [{ id: "claim", statement: "A fact.", searchTerms: ["fact"], required: true }],
      receipts: [],
      adaptationNotes: [],
      narratorDraft: "A short narrator line."
    };
    const evidence = {
      episodeId: "fixture",
      title: "Fixture",
      archiveBuild: "2026-08-27T12:00:00Z",
      archiveSnapshotId: "20260827T120000Z",
      generatedAt: "2026-08-27T12:05:00Z",
      story: {
        premise: episode.premise,
        protagonist: episode.protagonist,
        want: episode.want,
        obstacle: episode.obstacle,
        reversal: episode.reversal,
        payoff: episode.payoff
      },
      claims: [{ id: "claim", statement: "A fact.", required: true, evidence: [] }],
      receipts: [],
      adaptationNotes: [],
      narratorDraft: episode.narratorDraft
    };
    const settings = {
      provider: "higgsfield",
      model: "seedance-2.5",
      mode: "references",
      resolution: "480p",
      quality: "high",
      audio: "off",
      batch: 1
    };
    const shot = {
      id: "01-action",
      kind: "generated",
      seconds: 3,
      singleAction: "Worker nods once",
      cast: [{ id: "worker", behavior: "acting", screenPosition: "center" }],
      props: [],
      camera: { axis: "front", framing: "medium", motion: "locked" },
      startState: "Worker faces the camera.",
      endState: "Worker has completed one nod.",
      editorOverlays: [],
      referenceKeys: ["worker"],
      passCriteria: ["One nod only"]
    };
    await writeJson(episodePath, episode);
    await writeJson(evidencePath, evidence);
    await writeFile(evidencePath.replace(".json", ".md"), "# Evidence\n");
    await writeFile(storyboardPath, "# Storyboard\n");
    await writeFile(setPath, new Uint8Array([1, 2, 3]));
    await writeFile(characterPath, new Uint8Array([4, 5, 6]));
    await writeJson(shotManifestPath, {
      episodeId: "fixture",
      format: {
        aspectRatio: "9:16",
        targetDurationSeconds: 6,
        silentFirst: true,
        generatedMusic: false,
        intelligibleGeneratedDialogue: false
      },
      location: {
        id: "fixture-set",
        masterStatus: "locked",
        master: "set.png",
        layoutLocked: true
      },
      references: { worker: "worker.png" },
      testSettings: settings,
      finalSettings: { ...settings, resolution: "1080p" },
      shots: [
        shot,
        {
          ...shot,
          id: "02-proof",
          kind: "editor",
          cast: [],
          referenceKeys: [],
          singleAction: "Editor shows the proof"
        }
      ],
      loop: { method: "duplicate-opening-frames", frames: 8 }
    });

    const result = await packageEpisode({
      episodeSpecPath: episodePath,
      evidencePath,
      storyboardPath,
      shotManifestPath,
      outputRoot: join(root, "build")
    });
    expect(result.generatedTakeCount).toBe(1);
    expect(result.editorTakeCount).toBe(1);
    await access(join(result.packageDirectory, "takes", "01-action", "prompt.txt"));
    expect(await readFile(
      join(result.packageDirectory, "takes", "01-action", "prompt.txt"),
      "utf8"
    )).toContain("Worker nods once");
    await expect(access(
      join(result.packageDirectory, "takes", "02-proof", "prompt.txt")
    )).rejects.toThrow();
  });
});
