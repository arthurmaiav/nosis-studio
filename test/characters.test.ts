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
      "jobber"
    ]);
    expect(result.characters.every((character) => character.roster === "core")).toBe(true);
    expect(result.characters.map(characterCoverage)).toEqual([
      "ready",
      "ready",
      "ready",
      "incomplete",
      "incomplete",
      "incomplete",
      "incomplete",
      "incomplete",
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
      { id: "barkeep", "2d": "approved", "3d": "missing" },
      { id: "clerk", "2d": "approved", "3d": "missing" },
      { id: "critic", "2d": "approved", "3d": "missing" },
      { id: "teller", "2d": "approved", "3d": "missing" },
      { id: "gaspard", "2d": "approved", "3d": "missing" },
      { id: "jobber", "2d": "approved", "3d": "approved" }
    ]);
    for (const character of result.characters) {
      for (const masterSheet of Object.values(character.masters)) {
        if (masterSheet.status !== "missing") {
          expect(masterSheet.status).toBe("approved");
          expect(masterSheet.distribution).toBe("public");
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
