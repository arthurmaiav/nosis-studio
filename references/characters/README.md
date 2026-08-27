# Nosis recurring cast

These folders are the canonical identity packages for the first production cast.

## Folder contract

Every recurring resident gets one folder:

```text
characters/<resident-id>/
  character.json
  character.md
  master-sheet.png
  environment-poses.png
  role-prop.png
```

`character.json` is machine-readable production state. `character.md` explains the role and visual decisions for humans. Approved master sheets are public. Pending pose and prop sheets remain local until approved.

The public `catalog.json` indexes every available character manifest. Run `bun run studio characters` to inspect the catalog.

## Reference order

For every generated keyframe or motion take:

1. Attach the relevant `master-sheet.png` first.
2. Attach the approved environment keyframe second.
3. Add a prop sheet only when that prop appears in the shot.

Do not attach unrelated cast members, props, or scenery.

## Locked character rules

- Preserve the same head, eyes, muzzle, bow tie, gloves, cuffs, shoes, body proportions, and material style.
- Preserve exactly one tail, two arms, two legs, and two gloved hands.
- Wardrobe is part of identity and cannot migrate between residents.
- Each shot gets one moving prop at most.
- Do not ask a video model to invent a new angle when an approved angle can be supplied.
- Amounts, transaction hashes, and labels are added in post.

## Production status

- Worker: master sheet approved for package development.
- Treasurer: master sheet approved for package development.
- Sentinel: master sheet approved for package development.
- Environment poses and Character or Soul ID tests remain pending.
