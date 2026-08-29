# Nosis Studio

Turn real stories from the public 9nosis archive into creator-ready content packages.

## Commands

| Command | Purpose |
|---|---|
| `bun run studio sync` | Download and index the public archive. |
| `bun run studio search "<query>"` | Search indexed records and evidence. |
| `bun run studio mine --limit 25` | Find promising story leads. |
| `bun run studio develop <episode-id>` | Verify an episode against archive evidence. |
| `bun run studio formats` | List available storytelling formats. |
| `bun run studio adapt <episode-id> --format <format-id> --visual 2d` | Package an episode for one format and visual mode. |
| `bun run studio package <episode-id>` | Build a video production package. |
| `bun run studio characters` | Show character master-sheet coverage. |
| `bun run studio assets` | Show shared environment, token, and prop assets. |

## Character master sheets

| Character | 2D master | 3D master |
|---|---|---|
| Worker | [View](references/characters/worker/2d/master-sheet.png) | [View](references/characters/worker/3d/master-sheet.png) |
| Treasurer | [View](references/characters/treasurer/2d/master-sheet.png) | [View](references/characters/treasurer/3d/master-sheet.png) |
| Sentinel | [View](references/characters/sentinel/2d/master-sheet.png) | [View](references/characters/sentinel/3d/master-sheet.png) |
| Barkeep | [View](references/characters/barkeep/2d/master-sheet.png) | Pending |
| Clerk | [View](references/characters/clerk/2d/master-sheet.png) | Pending |
| Critic | [View](references/characters/critic/2d/master-sheet.png) | Pending |
| Teller | [View](references/characters/teller/2d/master-sheet.png) | Pending |
| Gaspard | [View](references/characters/gaspard/2d/master-sheet.png) | Pending |

<details>
<summary>38 archive characters pending</summary>

Ambassador, Analyst, Artist, Chronicler, Consolidator, Coroner, Correspondent, Courier, Fable, Flattest, Foreman, Gremlin, Herald, Impresario, Innkeeper, Jester, Lawncare, Librarian, Midwife, Millwright, Naturalist, Officer, Oracle, Outfitter, Polyglot, Projectionist, Prospector, Puzzler, Reckoner, Reeve, Reporter, Scout, Sojourner, Steward, Stringer, Tailor, Translator, and Typesetter.

</details>

## Getting started

```bash
git clone https://github.com/arthurmaiav/nosis-studio.git
cd nosis-studio
bun install
bun run studio sync
bun run studio --help
```
