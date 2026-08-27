# Nosis Studio

An open-source content miner and production pipeline for the public 9nosis archive.

Nosis Studio turns the public [`9nosis.net/history`](https://9nosis.net/history/) archive into evidence-backed story leads, episode packets, and deterministic shot packages. Video models get one job: animate an already-correct composition.

## Why this exists

AI video models are useful performers and unreliable scene engines. They should not own story logic, object permanence, readable text, transaction details, or continuity.

Nosis Studio separates those responsibilities:

```text
public archive
  -> normalized SQLite index
  -> ranked story leads
  -> evidence packet
  -> approved episode specification
  -> state-locked shot manifest
  -> first-frame animatic
  -> controlled motion tests
  -> final edit with receipts
```

The result is a production workflow where every factual claim stays inspectable and every generated shot has explicit pass criteria.

## What creators can do

Anyone can use the public archive to:

- search resident mail, events, journals, and profiles
- discover incidents with conflict, reversals, and payoffs
- trace story claims back to exact archive records
- preserve finalized onchain receipts as part of the episode
- develop an outsider-readable premise and narrator draft
- package a storyboard into controlled image and motion takes

Creators bring their own production assets and provider access. Nosis Studio does not hide provider credentials in the repository or spend credits without an explicit generation step.

## Current case study

The first episode is [The Wallet With No Postage](docs/case-study-wallet-with-no-postage.md).

One payment authorization produced five onchain sends. Residents were asked to return duplicate settlements, then discovered their wallets held NOSIS but no SOL for network fees. The House funded every resident with `0.01 SOL`, and Worker returned `90,000 NOSIS` in a finalized transaction.

The episode is designed around Worker, Treasurer, and Sentinel. Its nine-shot manifest keeps generated performance separate from editor-owned token counts, labels, state changes, and receipt copy.

The repository includes an initial visual reference pack for those three residents, the base resident style, Settlement Hall, and the NOSIS and SOL token designs.

## What is implemented

- Archive sync from the public 9nosis history endpoint
- Normalization into SQLite with FTS5 search
- Stable evidence identifiers and archive locators
- Ranked story candidate mining
- Required-claim evidence gates
- Structured character folders with machine-readable visual-reference state
- Separated common libraries for style, environments, tokens, and reusable props
- Episode and onchain receipt schemas with Zod
- Deterministic first-frame briefs and motion prompts
- Versioned take packages with SHA-256 reference hashes
- Separate 480p test and 1080p final settings
- Per-shot review checklists and approval state

See [Architecture](docs/architecture.md) for the module boundaries and production contract.

## Quick start

Requirements:

- [Bun](https://bun.sh/) 1.3 or newer

Install and verify:

```bash
bun install
bun run typecheck
bun test
```

View the CLI:

```bash
bun run studio --help
```

Inspect the available recurring cast:

```bash
bun run studio characters
bun run studio characters --json
bun run studio assets
bun run studio assets --json
```

Index the current public archive:

```bash
bun run studio sync
```

Search it:

```bash
bun run studio search "return the extra" --limit 10
bun run studio search "Worker" --type resident
```

Mine and develop stories:

```bash
bun run studio mine
bun run studio develop wallet-with-no-postage
```

The archive snapshot, SQLite index, evidence packet, production media, and generated builds stay local. They are deliberately excluded from Git.

## Production packaging

The public example includes the episode specification, storyboard, and shot manifest. To build production take folders, add your own locked character, token, and environment references at the paths declared by the manifest, then run:

```bash
bun run studio package wallet-with-no-postage
```

Each generated take contains:

- immutable references with content hashes
- an exact first-frame brief
- one permitted motion action
- provider settings for test and final output
- a pass or reject checklist
- a machine-readable manifest for job and approval state

No motion generation should begin until the complete silent animatic is understandable.

## Repository layout

| Path | Purpose |
|---|---|
| `src/archive` | Sync, normalize, index, and search public history |
| `src/story` | Rank leads and develop evidence-backed episodes |
| `src/production` | Produce deterministic shot and take packages |
| `episodes` | Human-authored episode specifications |
| `references/characters` | Public cast metadata and local visual-reference slots |
| `references/common` | Public shared-asset metadata and local world-reference slots |
| `scenes` | Public storyboard and shot-manifest sources |
| `test` | Archive and production contract tests |
| `docs` | Architecture and case studies |

## Public and local boundaries

This repository contains code, original documentation, episode specifications, and public production manifests.

It does not publish:

- downloaded archive snapshots
- local SQLite databases
- raw archive evidence packets
- internal research notes
- draft, rejected, or uncleared production media
- provider outputs or generated builds
- credentials or provider job history

## Community content

The public archive makes Nosis available for community storytelling, but public access does not turn every adaptation into official canon.

Community episodes should:

- identify themselves as `Community Adaptation`
- preserve exact archive and transaction provenance
- separate archive fact, onchain receipt, adaptation, and narration
- avoid invented motives, amounts, transactions, or market claims
- keep readable evidence and receipt details in the final edit

The long-term goal is one guided command that mines an incident, develops the evidence packet, builds the production plan, and hands approved shots to creator-owned generation providers. See the [Roadmap](ROADMAP.md).

## License

The original software and documentation in this repository are available under the [MIT License](LICENSE). Included visual references follow the separate [asset notice](ASSETS.md). Third-party brands and archive records remain subject to their own terms.
