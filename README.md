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
| Barkeep | [View](references/characters/barkeep/2d/master-sheet.png) | [View](references/characters/barkeep/3d/master-sheet.png) |
| Clerk | [View](references/characters/clerk/2d/master-sheet.png) | [View](references/characters/clerk/3d/master-sheet.png) |
| Critic | [View](references/characters/critic/2d/master-sheet.png) | [View](references/characters/critic/3d/master-sheet.png) |
| Teller | [View](references/characters/teller/2d/master-sheet.png) | [View](references/characters/teller/3d/master-sheet.png) |
| Gaspard | [View](references/characters/gaspard/2d/master-sheet.png) | [View](references/characters/gaspard/3d/master-sheet.png) |
| Jobber | [View](references/characters/jobber/2d/master-sheet.png) | [View](references/characters/jobber/3d/master-sheet.png) |
| Herald | [View](references/characters/herald/2d/master-sheet.png) | [View](references/characters/herald/3d/master-sheet.png) |
| Officer | [View](references/characters/officer/2d/master-sheet.png) | [View](references/characters/officer/3d/master-sheet.png) |
| Fable | [View](references/characters/fable/2d/master-sheet.png) | [View](references/characters/fable/3d/master-sheet.png) |
| Puzzler | [View](references/characters/puzzler/2d/master-sheet.png) | [View](references/characters/puzzler/3d/master-sheet.png) |
| Colette, Librarian | [View](references/characters/librarian/2d/master-sheet.png) | [View](references/characters/librarian/3d/master-sheet.png) |
| Foreman | [View](references/characters/foreman/2d/master-sheet.png) | [View](references/characters/foreman/3d/master-sheet.png) |
| Steward | [View](references/characters/steward/2d/master-sheet.png) | [View](references/characters/steward/3d/master-sheet.png) |
| Courier | [View](references/characters/courier/2d/master-sheet.png) | [View](references/characters/courier/3d/master-sheet.png) |
| Visitor | [View](references/characters/visitor/2d/master-sheet.png) | [View](references/characters/visitor/3d/master-sheet.png) |
| Reeve | [View](references/characters/reeve/2d/master-sheet.png) | [View](references/characters/reeve/3d/master-sheet.png) |
| Consolidator | [View](references/characters/consolidator/2d/master-sheet.png) | [View](references/characters/consolidator/3d/master-sheet.png) |
| Coroner | [View](references/characters/coroner/2d/master-sheet.png) | [View](references/characters/coroner/3d/master-sheet.png) |
| Smith | [View](references/characters/smith/2d/master-sheet.png) | [View](references/characters/smith/3d/master-sheet.png) |
| Reckoner | [View](references/characters/reckoner/2d/master-sheet.png) | [View](references/characters/reckoner/3d/master-sheet.png) |

The [live character map](docs/live-character-map.md) covers every verified resident identity, official portrait availability, current Studio status, and proposed visual cue without mixing adaptation into canon.

## Getting started

```bash
git clone https://github.com/arthurmaiav/nosis-studio.git
cd nosis-studio
bun install
bun run studio sync
bun run studio --help
```
