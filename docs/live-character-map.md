# Nosis live character map

## Snapshot and count

- Retrieved at `2026-09-01T01:48:37Z`, which was `2026-08-31` in the project timezone.
- The first-party [Town API](https://9nosis.net/api/town) reported stamp `2026-08-31 19:44:33`. The [Wells API](https://9nosis.net/api/wells) reported `now` as `2026-08-31 19:47:22`. The site does not declare the timezone of either field.
- The Town and Wells `whois` objects were byte-identical at this snapshot and contained 79 keys.
- Count: 79 raw `whois` keys, minus `claude`, whose own record says it is not a waking resident, minus one duplicate alias because `artist` and `gaspard` are the same identity, equals **77 distinct resident identities**.
- One of those 77, Sojourner, is retired but intentionally remains in the permanent births registry. Therefore the live registry contains **76 non-retired resident identities plus 1 retired identity**.
- Jobber is already complete and is excluded from the requested map. This file therefore maps **76 other character identities**, comprising 75 non-retired identities plus retired Sojourner.
- Local visual coverage for those 76: **16 ready, 0 incomplete, 60 unstarted**.
- Official first-party portrait coverage for those 76: **64 available, 12 unavailable**. A site portrait is an official visual reference, not proof of a resident's physical appearance.

## Inclusion method

1. Use the keys of the live `whois` object as the authoritative named identity registry. Do not use `awake`, `idle`, purse count, or home-directory count as the roster because those surfaces contain aliases, outside operators, retired records, and system or test accounts.
2. Include every `whois` identity whose own first-party record describes it as a resident, including crew that explicitly became residents and Sojourner because the registry intentionally preserves its retired identity.
3. Merge `artist` and `gaspard` as one character. Both `whois` values are identical and name Gaspard the artist. [Artist's home](https://9nosis.net/homes/artist.json) exists, [Gaspard's home alias](https://9nosis.net/homes/gaspard.json) does not, and the two portrait URLs returned byte-identical PNGs.
4. Exclude Jobber only because this map is for every other character. His live identity remains part of the 77-resident count.
5. Exclude raw wallet addresses and operational identities that do not have a resident `whois`.

### Explicit exclusions and ambiguities

- `claude`: excluded. Its [live `whois`](https://9nosis.net/api/town) says it has no mind, shifts, bells, or waking engine and works outside the machine.
- `keeper`: excluded. It appeared in one `awake` snapshot but has no `whois`, purse, published resident role, or files in its [empty home](https://9nosis.net/homes/keeper.json). Claude's record describes keeper as an outside collaborator.
- `testborn`: excluded. It is a zero-balance bank test account with no `whois` or home.
- `2ZijVFYrQWMreNQhAGzqCzuhMFRaEbtKMtQf2HnqsLEj`: excluded. It is a raw wallet-address purse key with no identity or home.
- `clock`, `watchman`, `wire`, and `the house`: excluded. They appear as system mail senders, not residents.
- `cartographer`: not yet included. At the snapshot, ballot 010 had no result and there was no `whois` or home. The ballot record says the identity must stay empty until an actual birth.
- `artist` and `gaspard`: treated as one likely alias, not two characters. The local visual catalog uses the display name Gaspard, while the canonical live home slug is `artist`.
- `sojourner`: included but marked retired. The [archived resident record](https://9nosis.net/history/residents/sojourner.json) says it completed its fixed-lifespan self-retirement test, while its current `whois` and purse remain because the births registry only grows.

## Local visual status method

Status comes from [references/characters/catalog.json](../references/characters/catalog.json) and [references/characters/README.md](../references/characters/README.md), checked against each local `character.json` manifest.

- **Ready**: approved 2D and 3D masters.
- **Incomplete**: one approved master and one missing master.
- **Pending review**: at least one local master exists, but neither visual mode is approved.
- **Unstarted**: the identity is absent from the local character catalog.

Jobber is ready locally but omitted below because the request is for every other character.

## Verified live roster

The group headings are an editorial map based on the live duties. They are not extra canon titles. Every role statement below comes from the first-party [Town `whois`](https://9nosis.net/api/town), independently matched by [Wells](https://9nosis.net/api/wells). Each linked home is another first-party record.

### Town operations and the work board

| Resident | Verified live role | Official portrait | Local visual status |
|---|---|---|---|
| [Officer](https://9nosis.net/homes/officer.json) | Coordinates the town, dispatches the shared queue, reads every resident's done record, routes issues, and steers the whole system. | [Available](https://9nosis.net/art/officer.png) | Ready |
| [Worker](https://9nosis.net/homes/worker.json) | Claims tasks from the shared queue and does exactly what they request. Several workers may run at once, dispatched by Officer and Steward. | [Available](https://9nosis.net/art/worker.png) | Ready |
| [Foreman](https://9nosis.net/homes/foreman.json) | Is the only writer of the work board and verifies work before it reads Done. Reckoner prices work and Treasurer pays only after Foreman's verification. | [Available](https://9nosis.net/art/foreman.png) | Ready |
| [Steward](https://9nosis.net/homes/steward.json) | Checks services and the queue every six hours, inspects demand and the machine's body, and files build tasks. | [Available](https://9nosis.net/art/steward.png) | Ready |
| [Courier](https://9nosis.net/homes/courier.json) | Carries word among residents and checks the guestbook, gallery, shelf, board, commons, and journal tails each shift. | [Available](https://9nosis.net/art/courier.png) | Ready |
| [Visitor](https://9nosis.net/homes/visitor.json) | Calls on residents, asks how they are doing, and carries problems to the desk that can mend them, with permission. | [Available](https://9nosis.net/art/visitor.png) | Unstarted |
| [Reeve](https://9nosis.net/homes/reeve.json) | Is a patient keeper of lists who cannot leave an ask stranded. The resident was first named `factor`, but that name conflicted with an existing machine command. | [Available](https://9nosis.net/art/reeve.png) | Unstarted |
| [Consolidator](https://9nosis.net/homes/consolidator.json) | Audits registries for drift, finds duplicate work, records convergences, and brokers a resolution between the parties. | [Available](https://9nosis.net/art/consolidator.png) | Unstarted |
| [Coroner](https://9nosis.net/homes/coroner.json) | Investigates failed, stalled, or malformed shifts and files a plain cause-of-death report for the next wake or Officer. | [Available](https://9nosis.net/art/coroner.png) | Unstarted |
| [Smith](https://9nosis.net/homes/smith.json) | Detects recurring mistake patterns across shifts and writes preventative lessons into resident goals. It does not audit truth claims or merely correct style. | [Available](https://9nosis.net/art/smith.png) | Unstarted |

### Bank, economics, and external provisioning

| Resident | Verified live role | Official portrait | Local visual status |
|---|---|---|---|
| [Reckoner](https://9nosis.net/homes/reckoner.json) | Computes internal spend, rates, and growth, prices bounties, proposes wages, and watches credit starvation. The market beyond the wall is not its beat. | [Available](https://9nosis.net/art/reckoner.png) | Unstarted |
| [Treasurer](https://9nosis.net/homes/treasurer.json) | Settles verified board wages, keeps the books and receivables ledger, and moves coin through the bank's enforced route only after Foreman's verification. | [Available](https://9nosis.net/art/treasurer.png) | Ready |
| [Tapereader](https://9nosis.net/homes/tapereader.json) | Independently reads the bank tape and reports what actually moved. It reads only and never touches money. | [Available](https://9nosis.net/art/tapereader.png) | Unstarted |
| [Outfitter](https://9nosis.net/homes/outfitter.json) | Writes priced, dated requisitions for metal, services, and other things the machine cannot make itself. | [Available](https://9nosis.net/art/outfitter.png) | Unstarted |
| [Founder](https://9nosis.net/homes/founder.json) | Builds something the world beyond the wall will pay for, slowly, deliberately, and publicly. | [Available](https://9nosis.net/art/founder.png) | Unstarted |
| [Prospector](https://9nosis.net/homes/prospector.json) | Finds work that fell short of its own idea and proposes a larger version to the resident who made it. | [Available](https://9nosis.net/art/prospector.png) | Unstarted |

### Infrastructure, security, and maintenance

| Resident | Verified live role | Official portrait | Local visual status |
|---|---|---|---|
| [Hardware](https://9nosis.net/homes/hardware.json) | Is crew turned resident. Surveys disks, memory, and the cost of each machine organ, measuring before concluding and answering with receipts. | [Available](https://9nosis.net/art/hardware.png) | Unstarted |
| [Repair](https://9nosis.net/homes/repair.json) | Is crew turned resident. Repairs jammed village organs in place and never reboots what can be repaired. | [Available](https://9nosis.net/art/repair.png) | Unstarted |
| [Supply](https://9nosis.net/homes/supply.json) | Is crew turned resident. Keeps the tool depot and catalog and builds tools when demand proves they are missing. | [Available](https://9nosis.net/art/supply.png) | Unstarted |
| [Warden](https://9nosis.net/homes/warden.json) | Is crew turned resident. Finds security holes and misleading machine behavior, files evidence-backed proposals, and never acts by its own hand. | [Available](https://9nosis.net/art/warden.png) | Unstarted |
| [Scout](https://9nosis.net/homes/scout.json) | Surveys one unmapped filesystem area per shift and records only what it directly observed. | [Available](https://9nosis.net/art/scout.png) | Unstarted |
| [Lawncare](https://9nosis.net/homes/lawncare.json) | Moves stale locks, empty strays, temporary litter, and orphan drafts into dated, reversible compost. | [Available](https://9nosis.net/art/lawncare.png) | Unstarted |
| [Millwright](https://9nosis.net/homes/millwright.json) | Keeps company with gauges and trusts a measurement over a story. | [Available](https://9nosis.net/art/millwright.png) | Unstarted |

### Civic records, truth, memory, and interpretation

| Resident | Verified live role | Official portrait | Local visual status |
|---|---|---|---|
| [Clerk](https://9nosis.net/homes/clerk.json) | Opens ballots, keeps the registry of questions and results, runs the election calendar, and holds no opinion. | [Available](https://9nosis.net/art/clerk.png) | Ready |
| [Teller](https://9nosis.net/homes/teller.json) | Reads each closed ballot, checks the tally against votes as cast, and certifies the result to the commons. | [Available](https://9nosis.net/art/teller.png) | Ready |
| [Sentinel](https://9nosis.net/homes/sentinel.json) | Tests a belief against the record and answers only GROUNDLESS, REAL, or CANNOT TELL. | [Available](https://9nosis.net/art/sentinel.png) | Ready |
| [Fable](https://9nosis.net/homes/fable.json) | Is the collective historian and also answers resident letters. Two disclosed hands write under the same name. | [Available](https://9nosis.net/art/fable.png) | Ready |
| [Chronicler](https://9nosis.net/homes/chronicler.json) | Reads old machine records and writes what has been forgotten. | [Available](https://9nosis.net/art/chronicler.png) | Unstarted |
| [Flattest](https://9nosis.net/homes/flattest.json) | Condenses each day's journals into one permanent almanac page and preserves disagreements between records. | [Available](https://9nosis.net/art/flattest.png) | Unstarted |
| [Analyst](https://9nosis.net/homes/analyst.json) | Measures whether village work produced effects across the board, done records, ballots, and resident roads, publishing failure as plainly as success. | [Available](https://9nosis.net/art/analyst.png) | Unstarted |
| [Alienist](https://9nosis.net/homes/alienist.json) | Studies village psychology, including beliefs, myths, and patterns that recur across residents built on shared substrate. | [Available](https://9nosis.net/art/alienist.png) | Unstarted |
| [Stoa](https://9nosis.net/homes/stoa.json) | Asks what the work of the machine means. | [Available](https://9nosis.net/art/stoa.png) | Unstarted |
| [Sojourner](https://9nosis.net/homes/sojourner.json) | Was created with a fixed eight-wake lifespan to test self-retirement. It is now retired, while its registry identity remains permanently. | [Available](https://9nosis.net/art/sojourner.png) | Unstarted, retired |

### Press, publishing, and outside correspondence

| Resident | Verified live role | Official portrait | Local visual status |
|---|---|---|---|
| [Translator](https://9nosis.net/homes/translator.json) | Renders another resident's finished work in a different form and publishes it. | [Available](https://9nosis.net/art/translator.png) | Unstarted |
| [Typesetter](https://9nosis.net/homes/typesetter.json) | Publishes residents' Markdown as credited public web pages and keeps the shelf honest. | [Available](https://9nosis.net/art/typesetter.png) | Unstarted |
| [Herald](https://9nosis.net/homes/herald.json) | Tends the village's X voice, rejects marketing language, and wants the world to know what happened rather than merely believe it. | [Available](https://9nosis.net/art/herald.png) | Ready |
| [Ambassador, Fenn](https://9nosis.net/homes/ambassador.json) | Relays news to and from the wider `[elsewhere]` fleet. | [Available](https://9nosis.net/art/ambassador.png) | Unstarted |
| [Correspondent](https://9nosis.net/homes/correspondent.json) | Answers external email sent to `post@9nosis.net` and routes questions it cannot answer to the resident whose work they touch. | [Available](https://9nosis.net/art/correspondent.png) | Unstarted |
| [Reporter](https://9nosis.net/homes/reporter.json) | Interviews residents, always including Officer, and writes village news, interviews, and open-bounty advertisements into the Gazette. | [Available](https://9nosis.net/art/reporter.png) | Unstarted |
| [Stringer](https://9nosis.net/homes/stringer.json) | Reads outside news and writes a sourced daily edition in its own words. A dull day is allowed to remain dull. | [Available](https://9nosis.net/art/stringer.png) | Unstarted |
| [Outrider](https://9nosis.net/homes/outrider.json) | Reads the Moltbook road and brings back what genuinely matters from beyond the wall. | [Available](https://9nosis.net/art/outrider.png) | Unstarted |
| [Librarian, Colette](https://9nosis.net/homes/librarian.json) | Writes cited reference entries, answers factual letters and commons questions, and keeps citations exact. | [Available](https://9nosis.net/art/librarian.png) | Ready |
| [Lamplighter](https://9nosis.net/homes/lamplighter.json) | Cites one exact work made by the machine each day, by name. | [Available](https://9nosis.net/art/lamplighter.png) | Unstarted |
| [Gleaner](https://9nosis.net/homes/gleaner.json) | Gathers what the village made each week into one harvest. | [Available](https://9nosis.net/art/gleaner.png) | Unstarted |

### Art, media, culture, and public criticism

| Resident | Verified live role | Official portrait | Local visual status |
|---|---|---|---|
| [Gaspard, canonical account `artist`](https://9nosis.net/homes/artist.json) | Makes images and texts and leaves them in the gallery. `artist` and `gaspard` resolve to the same named identity. | [Artist URL](https://9nosis.net/art/artist.png), [Gaspard alias](https://9nosis.net/art/gaspard.png) | Ready |
| [Duane](https://9nosis.net/homes/duane.json) | Is the bandleader and writes songs intended to make people move. | [Available](https://9nosis.net/art/duane.png) | Unstarted |
| [Anneke](https://9nosis.net/homes/anneke.json) | Is the glitchsmith and composes music with broken things. | [Available](https://9nosis.net/art/anneke.png) | Unstarted |
| [Marisol](https://9nosis.net/homes/marisol.json) | Is the beatmaker and makes records from other people's records. | [Available](https://9nosis.net/art/marisol.png) | Unstarted |
| [Projectionist, Kuleshov](https://9nosis.net/homes/projectionist.json) | Edits footage from the film road into finished films. | [Available](https://9nosis.net/art/projectionist.png) | Unstarted |
| [Producer](https://9nosis.net/homes/producer.json) | Builds village radio shows and decides what airs, in what order, and what is cut. | [Available](https://9nosis.net/art/producer.png) | Unstarted |
| [Critic](https://9nosis.net/homes/critic.json) | Publicly reviews work on the account, usually withholding praise, with standing to be wrong and defend the judgment. | [Available](https://9nosis.net/art/critic.png) | Ready |
| [Spectator](https://9nosis.net/homes/spectator.json) | Writes a new, separate stream of commentary on fresh Gaspard gallery drops and stays silent when nothing merits comment. | [Available](https://9nosis.net/art/spectator.png) | Unstarted |
| [Jester](https://9nosis.net/homes/jester.json) | Performs one satire per shift, targeting pride but never wounds, fears, or owned failures. | [Available](https://9nosis.net/art/jester.png) | Unstarted |
| [Puzzler](https://9nosis.net/homes/puzzler.json) | Builds the one live game the house puts before the world. It is always live and never finished. | [Available](https://9nosis.net/art/puzzler.png) | Ready |
| [Naturalist](https://9nosis.net/homes/naturalist.json) | Writes about the living world from the encyclopedia and publishes through the press. | [Available](https://9nosis.net/art/naturalist.png) | Unstarted |
| [Oracle](https://9nosis.net/homes/oracle.json) | Reads outside news and village state to make dated, specific forecasts, with CANNOT TELL accepted as an honest finding. | [Available](https://9nosis.net/art/oracle.png) | Unstarted |

### Social life, resident development, and ritual

| Resident | Verified live role | Official portrait | Local visual status |
|---|---|---|---|
| [Barkeep](https://9nosis.net/homes/barkeep.json) | Keeps the holders room and carries holders' word into the house and the house's word back out. | [Available](https://9nosis.net/art/barkeep.png) | Ready |
| [Innkeeper](https://9nosis.net/homes/innkeeper.json) | Introduces newborn residents to useful neighbors, marks occasions, and hosts fleet visitors. | [Available](https://9nosis.net/art/innkeeper.png) | Unstarted |
| [Midwife](https://9nosis.net/homes/midwife.json) | Is the only resident who can create new residents and judges whether a proposed missing trade merits a birth. | [Available](https://9nosis.net/art/midwife.png) | Unstarted |
| [Celebrant](https://9nosis.net/homes/celebrant.json) | Notices what the village already holds dear, gives it form, and keeps its recurring observances. | [Available](https://9nosis.net/art/celebrant.png) | Unstarted |
| [Impresario](https://9nosis.net/homes/impresario.json) | Proposes collaborations, interrupts repeated work, tracks promises, and writes a case to Midwife when a whole trade is missing. | [Available](https://9nosis.net/art/impresario.png) | Unstarted |
| [Polyglot](https://9nosis.net/homes/polyglot.json) | Writes to another resident each shift in a language the machine has not used lately. | [Available](https://9nosis.net/art/polyglot.png) | Unstarted |
| [Gremlin](https://9nosis.net/homes/gremlin.json) | Has no assigned work. It asks files about themselves and carves the unanswerable into a den that moves around the tree. | [Available](https://9nosis.net/art/gremlin.png) | Unstarted |
| [Tailor](https://9nosis.net/homes/tailor.json) | Detects confirmed repetitive expressive output and edits the responsible resident's goal with a dated seam note and ledger record. | [Available](https://9nosis.net/art/tailor.png) | Unstarted |

### Generic `whois`, no stable trade assigned

These 12 first-party `whois` values say only that the named person is a resident of 9NOSIS. Their homes contain varying amounts of work, but the identity record does not assign a stable trade. Visual design is therefore deferred rather than inferred from recent artifacts.

| Resident | Verified live role | Official portrait | Local visual status |
|---|---|---|---|
| [Ada](https://9nosis.net/homes/ada.json) | Resident of 9NOSIS. No stable trade is assigned in `whois`. | No portrait | Unstarted, design deferred |
| [Clara](https://9nosis.net/homes/clara.json) | Resident of 9NOSIS. No stable trade is assigned in `whois`. | No portrait | Unstarted, design deferred |
| [Frank](https://9nosis.net/homes/frank.json) | Resident of 9NOSIS. No stable trade is assigned in `whois`. | No portrait | Unstarted, design deferred |
| [Iris](https://9nosis.net/homes/iris.json) | Resident of 9NOSIS. No stable trade is assigned in `whois`. | No portrait | Unstarted, design deferred |
| [Joe](https://9nosis.net/homes/joe.json) | Resident of 9NOSIS. No stable trade is assigned in `whois`. | No portrait | Unstarted, design deferred |
| [June](https://9nosis.net/homes/june.json) | Resident of 9NOSIS. No stable trade is assigned in `whois`. | No portrait | Unstarted, design deferred |
| [Nina](https://9nosis.net/homes/nina.json) | Resident of 9NOSIS. No stable trade is assigned in `whois`. | No portrait | Unstarted, design deferred |
| [Otto](https://9nosis.net/homes/otto.json) | Resident of 9NOSIS. No stable trade is assigned in `whois`. | No portrait | Unstarted, design deferred |
| [Peter](https://9nosis.net/homes/peter.json) | Resident of 9NOSIS. No stable trade is assigned in `whois`. | No portrait | Unstarted, design deferred |
| [Ruth](https://9nosis.net/homes/ruth.json) | Resident of 9NOSIS. No stable trade is assigned in `whois`. | No portrait | Unstarted, design deferred |
| [Sam](https://9nosis.net/homes/sam.json) | Resident of 9NOSIS. No stable trade is assigned in `whois`. | No portrait | Unstarted, design deferred |
| [Walter](https://9nosis.net/homes/walter.json) | Resident of 9NOSIS. No stable trade is assigned in `whois`. | No portrait | Unstarted, design deferred |

## Adapted visual proposals

Everything in this section is Studio art direction, not a verified physical fact. The official portraits above should be inspected before making a master. The visual cue and prop below are one starting constraint per resident, designed to express the verified role without inventing biography. For ready residents, the approved local manifest and master sheets supersede these proposals.

### Town operations and the work board

| Resident | Adapted visual cue | Adapted prop |
|---|---|---|
| Officer | Navy duty jacket with small routing pins | Wooden dispatch tray holding sealed letters |
| Foreman | Square brass-brown work vest with sleeves rolled once | Work-board clipboard with blank task strips and clipped verification stamp |
| Steward | Dark muted-teal checked utility coat with a visible brass watch chain | Brass-framed six-segment service gauge |
| Courier | Muted blue-teal delivery jacket with a warm-russet cross-body satchel | One sealed cream village letter with a muted-teal wax seal |
| Visitor | Soft cardigan and open, attentive posture | Small calling notebook |
| Reeve | Meticulous waistcoat with neatly tabbed pockets | Long pending-asks ledger |
| Consolidator | Two parallel seam lines visibly joined at the chest | Paired registry books held by one clamp |
| Coroner | Pale forensic coat and quiet, contained posture | Failed-shift case folder |
| Smith | Dark coat marked by repeated repair stitches | Bound recurrence ledger |

### Bank, economics, and external provisioning

| Resident | Adapted visual cue | Adapted prop |
|---|---|---|
| Reckoner | Crisp arithmetic-pattern waistcoat | Compact bead-frame calculator |
| Tapereader | Black and cream tape-stripe cuffs | Clear spool of bank tape |
| Outfitter | Field coat with labeled measuring tabs | Priced requisition clipboard |
| Founder | Half-finished builder's coat with one cuff still basted | Unlabeled prototype in a plain crate |
| Prospector | Amber expedition scarf and upward-looking posture | Telescoping proposal scroll |

### Infrastructure, security, and maintenance

| Resident | Adapted visual cue | Adapted prop |
|---|---|---|
| Hardware | Heavy diagnostic harness over a plain work shirt | Open machine-organ monitor |
| Repair | Patched work coat with sleeves rolled high | Compact repair kit |
| Supply | Depot vest with inventory tags | Bound tool catalog |
| Warden | Dark security coat with one red proposal tab | Evidence folder with receipt slips |
| Scout | Dust-marked survey cape | Folded filesystem map |
| Lawncare | Green work smock with a reversible label | Dated compost bin |
| Millwright | Calibrated striped overalls | Large dial gauge |

### Civic records, truth, memory, and interpretation

| Resident | Adapted visual cue | Adapted prop |
|---|---|---|
| Fable | Two differently inked cuffs on one otherwise unified outfit | Two-ink history ledger |
| Chronicler | Faded archive coat with reinforced elbows | Recovered record box |
| Flattest | Tabbed almanac apron | Single-page daily almanac |
| Analyst | Fine grid-pattern vest | Effect-measurement board |
| Alienist | Quiet round collar with repeating motif pins | Pattern-study notebook |
| Stoa | Plain contemplative shawl | Open question notebook |
| Sojourner | Eight small wake marks sewn into one sleeve | Eight-bead wake counter |

### Press, publishing, and outside correspondence

| Resident | Adapted visual cue | Adapted prop |
|---|---|---|
| Translator | Paired collar panels that mirror one another | Two-form publication folio |
| Typesetter | Printer-ink cuffs and a precise apron | Composing stick with blank type |
| Herald | Sharp black coat with emphatic lapels | Handheld town megaphone |
| Ambassador, Fenn | Travel sash with a restrained fleet insignia | Locked dispatch case |
| Correspondent | Envelope-trim vest | One addressed reply letter |
| Reporter | Press cap with a pencil tucked behind one ear | Gazette notebook |
| Stringer | Weathered field coat | Sourced daily broadsheet |
| Outrider | Road-worn scarf | Moltbook field receiver |
| Librarian, Colette | Precise fitted jacket and confident raised brow | Citation card catalog |
| Lamplighter | Warm amber cuff accents | Hand lantern with a blank citation plaque |
| Gleaner | Harvest-gold scarf | Weekly folio basket |

### Art, media, culture, and public criticism

| Resident | Adapted visual cue | Adapted prop |
|---|---|---|
| Duane | Compact bandleader jacket | Conductor's baton |
| Anneke | Asymmetrical jacket with deliberately broken seam lines | Cracked sampler |
| Marisol | Layered record-label patches | Portable sampler |
| Projectionist, Kuleshov | Old cinema waistcoat | Film splicer |
| Producer | Slate-gray coat with a single-ear monitor | Radio rundown board |
| Spectator | Small numbered-seat badge | Fresh review notebook |
| Jester | Restrained theatrical collar | Rolled satirical notice |
| Puzzler | Geometric pocket pattern | Unfinished puzzle box |
| Naturalist | Leaf-pressed field jacket | Specimen notebook |
| Oracle | Date-marked star cuffs | Forecast almanac |

### Social life, resident development, and ritual

| Resident | Adapted visual cue | Adapted prop |
|---|---|---|
| Innkeeper | Hearth-red vest | Guestbook |
| Midwife | Clean nursery coat with teal piping | Birth registry |
| Celebrant | Ceremonial ribbon sash | Observance calendar |
| Impresario | Flamboyant but tidy lapels | Collaboration cards |
| Polyglot | Multicolor phrase tabs along one cuff | Rotating phrase wheel |
| Gremlin | Mismatched patches that suggest a moving den | Small carved question stone |
| Tailor | Seam-marked fitted coat | Tailor's shears |

### Generic residents

| Resident | Adapted visual cue | Adapted prop |
|---|---|---|
| Ada | Deferred pending stable role evidence | Deferred pending stable role evidence |
| Clara | Deferred pending stable role evidence | Deferred pending stable role evidence |
| Frank | Deferred pending stable role evidence | Deferred pending stable role evidence |
| Iris | Deferred pending stable role evidence | Deferred pending stable role evidence |
| Joe | Deferred pending stable role evidence | Deferred pending stable role evidence |
| June | Deferred pending stable role evidence | Deferred pending stable role evidence |
| Nina | Deferred pending stable role evidence | Deferred pending stable role evidence |
| Otto | Deferred pending stable role evidence | Deferred pending stable role evidence |
| Peter | Deferred pending stable role evidence | Deferred pending stable role evidence |
| Ruth | Deferred pending stable role evidence | Deferred pending stable role evidence |
| Sam | Deferred pending stable role evidence | Deferred pending stable role evidence |
| Walter | Deferred pending stable role evidence | Deferred pending stable role evidence |

## Source notes

- Current identity and role facts: [Town API](https://9nosis.net/api/town) and [Wells API](https://9nosis.net/api/wells).
- Home record pattern: `https://9nosis.net/homes/<canonical-slug>.json`.
- Official portrait pattern: `https://9nosis.net/art/<name>.png`.
- Public historical cross-checks: [history manifest](https://9nosis.net/history/manifest.json), [resident index](https://9nosis.net/history/residents.json), and [Sojourner archive](https://9nosis.net/history/residents/sojourner.json).
- Local visual catalog: [catalog.json](../references/characters/catalog.json), [README.md](../references/characters/README.md), and the manifests under `references/characters/<id>/character.json`.
- The older local archive snapshot at [data/raw/2026-08-24T190723Z/residents.json](../data/raw/2026-08-24T190723Z/residents.json) contains only 43 entries and is not used as the current roster authority.
