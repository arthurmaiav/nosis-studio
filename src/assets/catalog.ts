import { dirname, resolve } from "node:path";
import { readJsonFile } from "../lib/files.ts";
import {
  CommonAssetCatalogSchema,
  CommonAssetManifestSchema,
  type CommonAssetCatalog,
  type CommonAssetManifest
} from "./schemas.ts";

export type LoadedCommonAssetCatalog = {
  catalog: CommonAssetCatalog;
  assets: CommonAssetManifest[];
};

export async function loadCommonAssetCatalog(path: string): Promise<LoadedCommonAssetCatalog> {
  const catalog = CommonAssetCatalogSchema.parse(await readJsonFile(path));
  const root = dirname(path);
  const assets = await Promise.all(catalog.assets.map(async (entry) => {
    const asset = CommonAssetManifestSchema.parse(await readJsonFile(resolve(root, entry.manifest)));
    if (asset.id !== entry.id) {
      throw new Error(`Common asset catalog ID ${entry.id} does not match manifest ID ${asset.id}`);
    }
    if (asset.category !== entry.category) {
      throw new Error(`Common asset ${entry.id} category does not match its catalog entry`);
    }
    return asset;
  }));
  return { catalog, assets };
}
