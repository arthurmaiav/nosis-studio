import { dirname, resolve } from "node:path";
import { readJsonFile } from "../lib/files.ts";
import {
  CharacterCatalogSchema,
  CharacterManifestSchema,
  type CharacterCatalog,
  type CharacterManifest
} from "./schemas.ts";

export type LoadedCharacterCatalog = {
  catalog: CharacterCatalog;
  characters: CharacterManifest[];
};

export async function loadCharacterCatalog(path: string): Promise<LoadedCharacterCatalog> {
  const catalog = CharacterCatalogSchema.parse(await readJsonFile(path));
  const root = dirname(path);
  const characters = await Promise.all(catalog.characters.map(async (entry) => {
    const character = CharacterManifestSchema.parse(await readJsonFile(resolve(root, entry.manifest)));
    if (character.id !== entry.id) {
      throw new Error(`Character catalog ID ${entry.id} does not match manifest ID ${character.id}`);
    }
    return character;
  }));
  return { catalog, characters };
}
