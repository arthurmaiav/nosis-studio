# Story formats

A Format defines how an evidence-backed Episode is told. It owns delivery type, canvas, Content Unit count, lettering policy, and format-wide rules. It does not own story facts, character identity, or graphics.

Available formats:

- `comic-page`: one 4:5 image containing four to six panels.
- `social-carousel`: five to eight standalone 9:16 slides.

Run `bun run studio formats` to inspect the catalog.

The creator selects `2d` or `3d` later when building the production package. The same Format can use either visual mode.
