import { describe, expect, test } from "bun:test";
import { access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { loadCharacterCatalog } from "../src/characters/index.ts";
import { studioDefaults } from "../src/config.ts";

describe("characters", () => {
  test("loads the recurring cast and its visual reference state", async () => {
    const result = await loadCharacterCatalog(studioDefaults.characterCatalogPath);
    expect(result.characters.map((character) => character.id)).toEqual([
      "worker",
      "treasurer",
      "sentinel"
    ]);
    for (const character of result.characters) {
      const masterSheet = character.visualReferences.find((reference) => reference.id === "master-sheet");
      expect(masterSheet?.status).toBe("approved");
      expect(masterSheet?.distribution).toBe("public");
      if (masterSheet) {
        await access(resolve(
          dirname(studioDefaults.characterCatalogPath),
          character.id,
          masterSheet.path
        ));
      }
    }
  });
});
