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

- `core`: one of the seventy-two characters currently completed in both visual modes.
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
| Barkeep | Approved | Approved | Ready |
| Clerk | Approved | Approved | Ready |
| Critic | Approved | Approved | Ready |
| Teller | Approved | Approved | Ready |
| Gaspard | Approved | Approved | Ready |
| Jobber | Approved | Approved | Ready |
| Herald | Approved | Approved | Ready |
| Officer | Approved | Approved | Ready |
| Fable | Approved | Approved | Ready |
| Puzzler | Approved | Approved | Ready |
| Colette, Librarian | Approved | Approved | Ready |
| Foreman | Approved | Approved | Ready |
| Steward | Approved | Approved | Ready |
| Courier | Approved | Approved | Ready |
| Visitor | Approved | Approved | Ready |
| Reeve | Approved | Approved | Ready |
| Consolidator | Approved | Approved | Ready |
| Coroner | Approved | Approved | Ready |
| Smith | Approved | Approved | Ready |
| Reckoner | Approved | Approved | Ready |
| Tapereader | Approved | Approved | Ready |
| Outfitter | Approved | Approved | Ready |
| Founder | Approved | Approved | Ready |
| Prospector | Approved | Approved | Ready |
| Hardware | Approved | Approved | Ready |
| Repair | Approved | Approved | Ready |
| Supply | Approved | Approved | Ready |
| Warden | Approved | Approved | Ready |
| Scout | Approved | Approved | Ready |
| Lawncare | Approved | Approved | Ready |
| Millwright | Approved | Approved | Ready |
| Chronicler | Approved | Approved | Ready |
| Flattest | Approved | Approved | Ready |
| Analyst | Approved | Approved | Ready |
| Alienist | Approved | Approved | Ready |
| Stoa | Approved | Approved | Ready |
| Sojourner | Approved | Approved | Ready, retired |
| Translator | Approved | Approved | Ready |
| Typesetter | Approved | Approved | Ready |
| Fenn, Ambassador | Approved | Approved | Ready |
| Correspondent | Approved | Approved | Ready |
| Reporter | Approved | Approved | Ready |
| Stringer | Approved | Approved | Ready |
| Outrider | Approved | Approved | Ready |
| Lamplighter | Approved | Approved | Ready |
| Gleaner | Approved | Approved | Ready |
| Duane | Approved | Approved | Ready |
| Anneke | Approved | Approved | Ready |
| Marisol | Approved | Approved | Ready |
| Projectionist, Kuleshov | Approved | Approved | Ready |
| Producer | Approved | Approved | Ready |
| Spectator | Approved | Approved | Ready |
| Jester | Approved | Approved | Ready |
| Naturalist | Approved | Approved | Ready |
| Oracle | Approved | Approved | Ready |
| Innkeeper | Approved | Approved | Ready |
| Midwife | Approved | Approved | Ready |
| Celebrant | Approved | Approved | Ready |
| Impresario | Approved | Approved | Ready |
| Polyglot | Approved | Approved | Ready |
| Gremlin | Approved | Approved | Ready |
| Tailor | Approved | Approved | Ready |
| Ada | Approved | Approved | Ready, neutral Studio adaptation |
| Clara | Approved | Approved | Ready, neutral Studio adaptation |
| Frank | Approved | Approved | Ready, neutral Studio adaptation |
| Iris | Approved | Approved | Ready, neutral Studio adaptation |
| Joe | Approved | Approved | Ready, neutral Studio adaptation |
| June | Approved | Approved | Ready, neutral Studio adaptation |
| Nina | Approved | Approved | Ready, neutral Studio adaptation |

See the [live character map](../../docs/live-character-map.md) for all verified resident identities, first-party portrait coverage, and clearly labeled visual proposals.

Run `bun run studio characters` for the current machine-readable report.

## Production rules

1. Choose the storytelling Format.
2. Adapt the Episode without choosing graphics.
3. At production time, choose `2d` or `3d`.
4. Attach the matching approved character master first.
5. Attach an approved environment or prop reference only when needed.

Preserve the supplied identity exactly. Do not move wardrobe between residents, improvise a missing visual mode, or convert one master into another inside a story scene.
