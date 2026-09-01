import { describe, expect, test } from "bun:test";
import { access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  characterCoverage,
  loadCharacterCatalog
} from "../src/characters/index.ts";
import { studioDefaults } from "../src/config.ts";

describe("characters", () => {
  test("loads the recurring cast and its visual reference state", async () => {
    const result = await loadCharacterCatalog(studioDefaults.characterCatalogPath);
    expect(result.characters.map((character) => character.id)).toEqual([
      "worker",
      "treasurer",
      "sentinel",
      "barkeep",
      "clerk",
      "critic",
      "teller",
      "gaspard",
      "jobber",
      "herald",
      "officer",
      "fable",
      "puzzler",
      "librarian",
      "foreman",
      "steward",
      "courier"
    ]);
    expect(result.characters.every((character) => character.roster === "core")).toBe(true);
    expect(result.characters.map(characterCoverage)).toEqual([
      "ready",
      "ready",
      "ready",
      "ready",
      "ready",
      "ready",
      "ready",
      "ready",
      "ready",
      "ready",
      "ready",
      "ready",
      "ready",
      "ready",
      "ready",
      "ready",
      "ready"
    ]);
    expect(result.characters.map((character) => ({
      id: character.id,
      "2d": character.masters["2d"].status,
      "3d": character.masters["3d"].status
    }))).toEqual([
      { id: "worker", "2d": "approved", "3d": "approved" },
      { id: "treasurer", "2d": "approved", "3d": "approved" },
      { id: "sentinel", "2d": "approved", "3d": "approved" },
      { id: "barkeep", "2d": "approved", "3d": "approved" },
      { id: "clerk", "2d": "approved", "3d": "approved" },
      { id: "critic", "2d": "approved", "3d": "approved" },
      { id: "teller", "2d": "approved", "3d": "approved" },
      { id: "gaspard", "2d": "approved", "3d": "approved" },
      { id: "jobber", "2d": "approved", "3d": "approved" },
      { id: "herald", "2d": "approved", "3d": "approved" },
      { id: "officer", "2d": "approved", "3d": "approved" },
      { id: "fable", "2d": "approved", "3d": "approved" },
      { id: "puzzler", "2d": "approved", "3d": "approved" },
      { id: "librarian", "2d": "approved", "3d": "approved" },
      { id: "foreman", "2d": "approved", "3d": "approved" },
      { id: "steward", "2d": "approved", "3d": "approved" },
      { id: "courier", "2d": "approved", "3d": "approved" }
    ]);
    for (const character of result.characters) {
      for (const masterSheet of Object.values(character.masters)) {
        if (masterSheet.status !== "missing") {
          expect(masterSheet.distribution).toBe(
            masterSheet.status === "approved" ? "public" : "local-only"
          );
          expect(masterSheet.coverage).toHaveLength(7);
          await access(resolve(
            dirname(studioDefaults.characterCatalogPath),
            character.id,
            masterSheet.path
          ));
        }
      }
    }
  });
});
