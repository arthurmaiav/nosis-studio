# Nosis Studio

**Mine the public 9nosis archive and turn real incidents into evidence-backed production packages.**

Nosis Studio gives creators four simple steps:

1. **Develop a story** from public archive records and evidence.
2. **Choose a format** such as a one-page comic, fullscreen carousel, or short video.
3. **Adapt the story** into format-specific panels, slides, or shots.
4. **Produce it** with compatible visual references, prompts, exact lettering, and review rules.

It does not submit provider jobs or publish media. It prepares the verified, format-aware handoff for those steps.

## Use cases and commands

| I want to... | Run this | What happens | Output |
|---|---|---|---|
| Download the latest public history | `bun run studio sync` | Downloads and indexes the 9nosis archive | Local archive files and `data/studio.sqlite` |
| Find a specific incident | `bun run studio search "return the extra" --limit 10` | Searches all indexed history | Matching records with timestamps, archive locations, and evidence IDs |
| Search only one source type | `bun run studio search "Worker" --type resident` | Searches only `mail`, `event`, `resident`, or `journal` records | Focused terminal results |
| Discover content ideas | `bun run studio mine --limit 25` | Ranks incidents with conflict, payment, and receipt signals | Candidate reports in `data/generated/` |
| Fact-check an episode | `bun run studio develop wallet-with-no-postage` | Verifies every required claim against the archive | `evidence.md` and `evidence.json` in the episode folder |
| See available characters | `bun run studio characters` | Checks the cast and its approved or pending references | Character readiness in the terminal |
| See reusable assets | `bun run studio assets` | Checks environments, tokens, props, and style references | Asset readiness in the terminal |
| See storytelling formats | `bun run studio formats` | Lists delivery, canvas, unit count, lettering, and story-structure rules | Format readiness in the terminal |
| Adapt one story to one format | `bun run studio adapt the-village-voted-for-nobody --format comic-page --visual 2d` | Validates the format script, claims, cast, and selected 2D or 3D master sheets | A generation-ready adaptation package in `build/adaptations/` |
| Prepare shots for generation | `bun run studio package wallet-with-no-postage` | Builds a complete handoff from the verified episode and shot plan | Timestamped take folders in `build/episodes/` |

Use `bun run studio characters --json` or `bun run studio assets --json` when another tool needs structured output.
Use `bun run studio formats --json` to expose the reusable format definitions.

## Quick start

Requires [Bun](https://bun.sh/) 1.3 or newer.

```bash
git clone https://github.com/arthurmaiav/nosis-studio.git
cd nosis-studio
bun install
bun run studio sync
```

## Common workflows

### Find proof for something that happened

```bash
bun run studio search "wallet held NOSIS but no SOL" --limit 10
```

Each result shows the source location, timestamp, residents involved, record excerpt, and stable evidence ID.

### Find new story ideas

```bash
bun run studio mine --limit 25
```

This creates a readable report and machine-readable data:

```text
data/generated/candidates-<archive-id>.md
data/generated/candidates-<archive-id>.json
```

These are research leads. A human still chooses which story to develop.

### Verify a selected story

```bash
bun run studio develop wallet-with-no-postage
```

The command reads `episodes/wallet-with-no-postage/episode.json` and creates:

```text
episodes/wallet-with-no-postage/evidence.md
episodes/wallet-with-no-postage/evidence.json
```

It fails if a required claim has no archive evidence. Archive facts, onchain receipts, adaptation notes, and narration stay separate.

### Build the production handoff

```bash
bun run studio characters
bun run studio assets
bun run studio package wallet-with-no-postage
```

The result is one folder per shot with:

- locked visual references and file hashes
- an exact first-frame brief
- a motion prompt
- test and final provider settings
- a pass or reject checklist
- a machine-readable manifest

The package is ready for image and video generation, but no provider job is submitted automatically.

## Run the included example

The repository includes [The Wallet With No Postage](docs/case-study-wallet-with-no-postage.md) as a complete, runnable example.

```bash
bun run studio sync
bun run studio search "return the extra" --limit 10
bun run studio mine --limit 25
bun run studio develop wallet-with-no-postage
bun run studio characters
bun run studio assets
bun run studio package wallet-with-no-postage
```

```text
public history
  -> searchable records
  -> evidence-backed episode
  -> chosen format
  -> format-specific adaptation script
  -> chosen 2D or 3D visual mode
  -> compatible visual references
  -> generation-ready production package
```

Mining and evidence verification remain separate CLI operations for inspection, but together they are one creator-facing step: Story Development.

## Create your own community episode

There is not yet a `studio create` command. Today, the workflow is:

1. Add `episodes/<episode-id>/episode.json` with the format-neutral story, claims, receipts, adaptation notes, and narration.
2. Run `bun run studio develop <episode-id>` to verify the required claims.
3. Choose a reusable definition from `formats/`.
4. Add `adaptations/<episode-id>/<format-id>/script.json` with format-specific Content Units and source claim IDs.
5. Run `bun run studio adapt <episode-id> --format <format-id> --visual <2d|3d>`.
6. For video, add `scenes/<episode-id>/storyboard.md` and `scenes/<episode-id>/shot-manifest.json`, then run `bun run studio package <episode-id>`.

Label community work as `Community Adaptation`. Preserve archive and transaction provenance, and do not invent motives, amounts, transactions, or market claims.

## Visual references

Character references live in `references/characters/`. Shared styles, environments, tokens, and props live in `references/common/`. Each folder separates approved references from pending ones.

Format and graphics are independent choices. A Format controls story structure, canvas, and Content Units. Production separately selects `2d` or `3d` and packages the matching approved character masters. Packaging fails only when a cast member lacks the selected master.

See [the reference library guide](references/README.md) for the full structure.

## Not implemented yet

- automatic episode creation
- image or video provider submission
- automatic final-media rendering and assembly
- Higgsfield or other provider submission
- final video assembly
- publishing
- a web interface

See the [roadmap](ROADMAP.md) for planned work.

## Development and license

```bash
bun run typecheck
bun test
bun run studio --help
```

Technical details are in [Architecture](docs/architecture.md). Contribution rules are in [CONTRIBUTING.md](CONTRIBUTING.md).

Software and documentation use the [MIT License](LICENSE). Visual references follow the separate [asset notice](ASSETS.md).
