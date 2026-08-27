# Nosis Studio

**Mine the public 9nosis archive and turn real incidents into evidence-backed production packages.**

Nosis Studio helps creators:

1. **Find stories** in public resident mail, events, journals, and profiles.
2. **Prove the facts** with exact archive records and onchain receipts.
3. **Prepare production** with organized shots, visual references, prompts, and review rules.

It does not generate or publish media yet. It prepares the verified handoff for those steps.

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
| Prepare shots for generation | `bun run studio package wallet-with-no-postage` | Builds a complete handoff from the verified episode and shot plan | Timestamped take folders in `build/episodes/` |

Use `bun run studio characters --json` or `bun run studio assets --json` when another tool needs structured output.

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
  -> ranked story leads
  -> verified evidence
  -> cast and asset selection
  -> generation-ready shot folders
```

## Create your own community episode

There is not yet a `studio create` command. Today, the workflow is:

1. Add `episodes/<episode-id>/episode.json` with the story, claims, receipts, adaptation notes, and narration.
2. Run `bun run studio develop <episode-id>` to verify the required claims.
3. Add `scenes/<episode-id>/storyboard.md` and `scenes/<episode-id>/shot-manifest.json`.
4. Choose visual references from `references/characters/` and `references/common/`.
5. Run `bun run studio package <episode-id>`.

Label community work as `Community Adaptation`. Preserve archive and transaction provenance, and do not invent motives, amounts, transactions, or market claims.

## Visual references

Character references live in `references/characters/`. Shared styles, environments, tokens, and props live in `references/common/`. Each folder separates approved references from pending ones.

See [the reference library guide](references/README.md) for the full structure.

## Not implemented yet

- automatic episode creation
- image or video generation
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
