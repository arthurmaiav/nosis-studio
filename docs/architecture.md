# Architecture

Nosis Studio is split into three modules with one-way data flow.

```text
archive -> story -> production
```

The archive module knows nothing about episodes. The story module consumes archive records but does not know about video providers. The production module consumes approved story and shot specifications but never changes their factual claims.

The first implementation is intentionally Nosis-specific. It reads the public 9nosis history format and treats that archive as the source of truth for community story development.

## Archive

`src/archive` downloads or reads a named 9nosis archive snapshot, normalizes its mail, event, resident, and journal records, and writes a searchable SQLite index.

Every indexed record receives:

- a stable evidence ID derived from source content
- a source type
- an archive locator
- actor and target fields when present
- normalized timestamp and searchable text

The raw snapshot and database are local build inputs. Neither belongs in Git.

## Story

`src/story` has two jobs.

The mining pass searches for high-signal incidents, including payments, failures, reversals, disputes, and onchain outcomes. It ranks leads without asserting that they are ready to publish.

The development pass takes a human-authored episode specification and resolves every required claim against the archive. A required claim with no evidence fails the build. Successful output contains the story structure, exact archive records, adaptation notes, narrator draft, and verified receipt links.

## Production

`src/production` turns an approved episode, evidence packet, storyboard, and shot manifest into versioned take folders.

Each take declares:

- one primary action
- exact opening and ending state
- cast positions and behavior
- prop count, owner, location, and movement permission
- camera axis, framing, and motion
- editor-owned overlays
- test and final provider settings
- literal pass criteria

Reference files are copied into each take and hashed with SHA-256. The package records prompt hashes, provider job IDs, approval state, and selected output paths without depending on one provider implementation.

## Production contract

Every episode separates four layers:

1. Archive fact, what the public record contains.
2. Onchain receipt, what a viewer can verify independently.
3. Adaptation, what is compressed or staged for clarity.
4. Narration, how the episode explains the incident to an outsider.

Deterministic tools own story order, text, token counts, state changes, receipt cards, and the replay seam. Generative tools own small character performances inside accepted compositions.

## Quality gates

1. The premise works without private lore.
2. Every required claim resolves to archive evidence.
3. The beat board changes audience knowledge or world state.
4. Every shot has an exact state specification.
5. A silent first-frame animatic explains the complete story.
6. Motion is tested at low resolution against literal pass criteria.
7. Final resolution is generated only from accepted references and prompts.

This structure makes failures local. A bad motion result does not rewrite the story, alter the evidence, or force the model to reconstruct continuity.

## Community provenance

A community episode should be reproducible from four public artifacts:

1. The archive snapshot identifier.
2. Stable evidence IDs for every required claim.
3. Finalized transaction links when the payoff is onchain.
4. The episode and shot manifests describing adaptation and production decisions.

Provider job IDs, local media, and credentials remain private. The factual and editorial path to the published story remains inspectable.
