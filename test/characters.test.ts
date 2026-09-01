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
      "courier",
      "visitor",
      "reeve",
      "consolidator",
      "coroner",
      "smith",
      "reckoner",
      "tapereader",
      "outfitter",
      "founder",
      "prospector",
      "hardware",
      "repair",
      "supply",
      "warden",
      "scout",
      "lawncare",
      "millwright",
      "chronicler",
      "flattest",
      "analyst",
      "alienist",
      "stoa",
      "sojourner",
      "translator",
      "typesetter",
      "ambassador",
      "correspondent",
      "reporter",
      "stringer",
      "outrider",
      "lamplighter",
      "gleaner"
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
      { id: "courier", "2d": "approved", "3d": "approved" },
      { id: "visitor", "2d": "approved", "3d": "approved" },
      { id: "reeve", "2d": "approved", "3d": "approved" },
      { id: "consolidator", "2d": "approved", "3d": "approved" },
      { id: "coroner", "2d": "approved", "3d": "approved" },
      { id: "smith", "2d": "approved", "3d": "approved" },
      { id: "reckoner", "2d": "approved", "3d": "approved" },
      { id: "tapereader", "2d": "approved", "3d": "approved" },
      { id: "outfitter", "2d": "approved", "3d": "approved" },
      { id: "founder", "2d": "approved", "3d": "approved" },
      { id: "prospector", "2d": "approved", "3d": "approved" },
      { id: "hardware", "2d": "approved", "3d": "approved" },
      { id: "repair", "2d": "approved", "3d": "approved" },
      { id: "supply", "2d": "approved", "3d": "approved" },
      { id: "warden", "2d": "approved", "3d": "approved" },
      { id: "scout", "2d": "approved", "3d": "approved" },
      { id: "lawncare", "2d": "approved", "3d": "approved" },
      { id: "millwright", "2d": "approved", "3d": "approved" },
      { id: "chronicler", "2d": "approved", "3d": "approved" },
      { id: "flattest", "2d": "approved", "3d": "approved" },
      { id: "analyst", "2d": "approved", "3d": "approved" },
      { id: "alienist", "2d": "approved", "3d": "approved" },
      { id: "stoa", "2d": "approved", "3d": "approved" },
      { id: "sojourner", "2d": "approved", "3d": "approved" },
      { id: "translator", "2d": "approved", "3d": "approved" },
      { id: "typesetter", "2d": "approved", "3d": "approved" },
      { id: "ambassador", "2d": "approved", "3d": "approved" },
      { id: "correspondent", "2d": "approved", "3d": "approved" },
      { id: "reporter", "2d": "approved", "3d": "approved" },
      { id: "stringer", "2d": "approved", "3d": "approved" },
      { id: "outrider", "2d": "approved", "3d": "approved" },
      { id: "lamplighter", "2d": "approved", "3d": "approved" },
      { id: "gleaner", "2d": "approved", "3d": "approved" }
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
