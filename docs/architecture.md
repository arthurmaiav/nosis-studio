# Architecture

Nosis Studio uses one-way data flow from public evidence to a format-specific production package.

```text
archive -> episode -> format -> adaptation -> production
```

To creators, archive discovery and evidence verification are one step called Story Development. Internally, the archive and story modules remain separate so evidence can be inspected and failures stay local. A Format defines the storytelling grammar. An Adaptation Script reshapes one Episode for that Format. Production packages the approved script and compatible visual references without changing factual claims.

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

An Episode remains format-neutral. It is not a video, comic, carousel, storyboard, or provider prompt.

## Format

`src/formats` loads reusable storytelling definitions. A Format owns:

- delivery type
- canvas and aspect ratio
- Content Unit name and permitted count
- lettering policy
- format-wide narrative rules

The first public definitions are a one-page comic and a fullscreen social carousel.

## Adaptation

`src/adaptations` validates one format-specific script against its Episode and Format.

Every Content Unit declares:

- the Episode claims it depends on
- cast members
- one narrative purpose and action
- scene and composition
- exact post lettering
- continuity locks

Adaptation validation fails if a unit cites an unknown claim, introduces cast outside the Episode, or exceeds the Format's unit count. It remains independent of graphics.

## Production

`src/production` turns an approved Episode, evidence packet, storyboard, and video shot manifest into versioned take folders. `src/adaptations` performs the equivalent packaging step for comics and carousels. At this stage the creator selects `2d` or `3d`, and packaging requires an approved matching master for every cast member.

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

Every project separates five layers:

1. Archive fact, what the public record contains.
2. Onchain receipt, what a viewer can verify independently.
3. Episode, the format-neutral story selected from those facts.
4. Adaptation, what one Format compresses, expands, or stages for clarity.
5. Production, the visual references, prompts, exact lettering, and provider state used to create the deliverable.

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
