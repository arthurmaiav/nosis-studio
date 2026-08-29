import { dirname, resolve } from "node:path";
import { readJsonFile } from "../lib/files.ts";
import {
  FormatCatalogSchema,
  FormatDefinitionSchema,
  type FormatCatalog,
  type FormatDefinition
} from "./schemas.ts";

export type LoadedFormatCatalog = {
  catalog: FormatCatalog;
  formats: FormatDefinition[];
};

export async function loadFormatCatalog(path: string): Promise<LoadedFormatCatalog> {
  const catalog = FormatCatalogSchema.parse(await readJsonFile(path));
  const root = dirname(path);
  const formats = await Promise.all(catalog.formats.map(async (entry) => {
    const format = FormatDefinitionSchema.parse(await readJsonFile(resolve(root, entry.manifest)));
    if (format.id !== entry.id) {
      throw new Error(`Format catalog ID ${entry.id} does not match manifest ID ${format.id}`);
    }
    return format;
  }));
  return { catalog, formats };
}
