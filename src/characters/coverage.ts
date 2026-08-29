import type {
  AvailableCharacterMaster,
  CharacterManifest,
  VisualMode
} from "./schemas.ts";

export type CharacterCoverage = "ready" | "incomplete" | "pending";

export function characterCoverage(character: CharacterManifest): CharacterCoverage {
  const approvedCount = Object.values(character.masters).filter(
    (master) => master.status === "approved"
  ).length;
  if (approvedCount === 2) {
    return "ready";
  }
  if (approvedCount === 1) {
    return "incomplete";
  }
  return "pending";
}

export function approvedMaster(
  character: CharacterManifest,
  visualMode: VisualMode
): AvailableCharacterMaster | undefined {
  const master = character.masters[visualMode];
  return master.status === "approved" ? master : undefined;
}
