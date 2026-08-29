# Format adaptations

An Adaptation Script reshapes one format-neutral Episode into ordered Content Units for one Format.

```text
adaptations/<episode-id>/<format-id>/script.json
```

Every unit links back to Episode claim IDs, names its cast, states one action, reserves exact post lettering, and locks continuity. The script does not choose graphics.

Build a production package with:

```bash
bun run studio adapt <episode-id> --format <format-id> --visual <2d|3d>
```

Production selects the visual mode and packages the compatible character masters. Illustration providers receive only those generated prompts and references. Exact words remain in `lettering.json` for deterministic post lettering.
