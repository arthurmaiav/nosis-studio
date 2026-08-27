# Contributing

Nosis Studio is an early evidence-first production tool. Contributions should preserve the boundary between factual research, editorial adaptation, and generated media.

## Development

Install dependencies:

```bash
bun install
```

Run the complete local check:

```bash
bun run typecheck
bun test
```

## Code conventions

- Use TypeScript and named exports.
- Use explicit types and avoid `any`.
- Validate file and command boundaries with Zod.
- Keep archive, story, and production responsibilities separate.
- Add tests for new evidence or packaging behavior.
- Keep comments short and only explain non-obvious decisions.

## Data and media

Do not commit archive downloads, databases, credentials, reference media, generated footage, or provider output. Small synthetic fixtures belong inside tests.

Public episode specifications must distinguish archive facts, onchain receipts, adaptation, and narration. Never invent a transaction, amount, motive, or market claim.
