# Nosis recurring cast

Each resident has one medium-neutral identity manifest and exactly two target master sheets: 2D and 3D. Formats do not own character graphics. A comic page, carousel, or video can use either visual mode when the selected character masters are approved.

## Folder contract

```text
characters/<resident-id>/
  character.json
  character.md
  2d/
    master-sheet.png
  3d/
    master-sheet.png
```

Missing master folders remain absent until an asset exists. `character.json` records the status of both targets.

Every master follows [the shared master-sheet template](MASTER-SHEET-TEMPLATE.md). The 2D and 3D versions must depict the same canonical face, body, wardrobe, expressions, and role prop. Only the rendering medium changes.

## Roster and coverage

`roster` describes priority:

- `core`: one of the nine characters currently being completed in both visual modes.
- `backlog`: a known character outside the current production priority.

Coverage is derived from the two master statuses:

- `ready`: both masters are approved.
- `incomplete`: exactly one master is approved.
- `pending`: neither master is approved.

An incomplete character remains usable in the visual mode with an approved master. Production blocks only when the selected mode is missing or pending.

## Core cast status

| Character | 2D | 3D | Coverage |
|---|---|---|---|
| Worker | Approved | Approved | Ready |
| Treasurer | Approved | Approved | Ready |
| Sentinel | Approved | Approved | Ready |
| Barkeep | Approved | Missing | Incomplete |
| Clerk | Approved | Missing | Incomplete |
| Critic | Approved | Missing | Incomplete |
| Teller | Approved | Missing | Incomplete |
| Gaspard | Approved | Missing | Incomplete |
| Jobber | Approved | Approved | Ready |

See the [live character map](../../docs/live-character-map.md) for all verified resident identities, first-party portrait coverage, and clearly labeled visual proposals.

Run `bun run studio characters` for the current machine-readable report.

## Production rules

1. Choose the storytelling Format.
2. Adapt the Episode without choosing graphics.
3. At production time, choose `2d` or `3d`.
4. Attach the matching approved character master first.
5. Attach an approved environment or prop reference only when needed.

Preserve the supplied identity exactly. Do not move wardrobe between residents, improvise a missing visual mode, or convert one master into another inside a story scene.
