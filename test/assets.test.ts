import { describe, expect, test } from "bun:test";
import { access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { loadCommonAssetCatalog } from "../src/assets/index.ts";
import { studioDefaults } from "../src/config.ts";

describe("common assets", () => {
  test("loads separated environment, style, token, and prop references", async () => {
    const result = await loadCommonAssetCatalog(studioDefaults.assetCatalogPath);
    expect(result.assets.map((asset) => asset.id)).toEqual([
      "base-resident",
      "settlement-hall",
      "nosis-coin",
      "solana-coin",
      "return-pouch"
    ]);
    expect(new Set(result.assets.map((asset) => asset.category))).toEqual(new Set([
      "environment",
      "prop",
      "style",
      "token"
    ]));
    const categoryDirectories = {
      environment: "environments",
      prop: "props",
      style: "style",
      token: "tokens"
    } as const;
    for (const asset of result.assets) {
      for (const reference of asset.visualReferences) {
        if (reference.status === "approved" && reference.distribution === "public") {
          await access(resolve(
            dirname(studioDefaults.assetCatalogPath),
            categoryDirectories[asset.category],
            asset.id,
            reference.path
          ));
        }
      }
    }
  });
});
