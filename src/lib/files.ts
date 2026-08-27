import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export async function ensureParent(path: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
}

export async function readJsonFile(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, "utf8"));
}

export async function writeJsonFile(path: string, value: unknown): Promise<void> {
  await ensureParent(path);
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function writeTextFile(path: string, value: string): Promise<void> {
  await ensureParent(path);
  await writeFile(path, value.endsWith("\n") ? value : `${value}\n`, "utf8");
}

export function sha256(value: string | Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

export function safeSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
