# Visual reference library

Nosis Studio separates resident identity from shared world assets.

```text
references/
  characters/
    catalog.json
    <resident-id>/
      character.json
      character.md
      2d/master-sheet.png
      3d/master-sheet.png
  common/
    catalog.json
    style/<asset-id>/
    environments/<asset-id>/
    tokens/<asset-id>/
    props/<asset-id>/
```

Character folders answer who is performing and provide the same identity in 2D and 3D. Common folders answer what world, token, or reusable object appears in the shot.

Public JSON and Markdown files describe the production contract. Approved visual references marked `public` are committed beside their manifests. Draft and uncleared files remain local.

Run `bun run studio characters` and `bun run studio assets` to inspect readiness without opening every folder manually. Storytelling Format and visual mode are selected independently.
