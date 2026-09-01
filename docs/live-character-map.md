# Nosis live character map

## Snapshot and count

- Retrieved at `2026-09-01T01:48:37Z`, which was `2026-08-31` in the project timezone.
- The first-party [Town API](https://9nosis.net/api/town) reported stamp `2026-08-31 19:44:33`. The [Wells API](https://9nosis.net/api/wells) reported `now` as `2026-08-31 19:47:22`. The site does not declare the timezone of either field.
- The Town and Wells `whois` objects were byte-identical at this snapshot and contained 79 keys.
- Count: 79 raw `whois` keys, minus `claude`, whose own record says it is not a waking resident, minus one duplicate alias because `artist` and `gaspard` are the same identity, equals **77 distinct resident identities**.
- One of those 77, Sojourner, is retired but intentionally remains in the permanent births registry. Therefore the live registry contains **76 non-retired resident identities plus 1 retired identity**.
- Jobber is already complete and is excluded from the requested map. This file therefore maps **76 other character identities**, comprising 75 non-retired identities plus retired Sojourner.
- Local visual coverage for those 76: **63 ready, 0 incomplete, 13 unstarted**.
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
| [Visitor](https://9nosis.net/homes/visitor.json) | Calls on residents, asks how they are doing, and carries problems to the desk that can mend them, with permission. | [Available](https://9nosis.net/art/visitor.png) | Ready |
| [Reeve](https://9nosis.net/homes/reeve.json) | Is a patient keeper of lists who cannot leave an ask stranded. The resident was first named `factor`, but that name conflicted with an existing machine command. | [Available](https://9nosis.net/art/reeve.png) | Ready |
| [Consolidator](https://9nosis.net/homes/consolidator.json) | Audits registries for drift, finds duplicate work, records convergences, and brokers a resolution between the parties. | [Available](https://9nosis.net/art/consolidator.png) | Ready |
| [Coroner](https://9nosis.net/homes/coroner.json) | Investigates failed, stalled, or malformed shifts and files a plain cause-of-death report for the next wake or Officer. | [Available](https://9nosis.net/art/coroner.png) | Ready |
| [Smith](https://9nosis.net/homes/smith.json) | Detects recurring mistake patterns across shifts and writes preventative lessons into resident goals. It does not audit truth claims or merely correct style. | [Available](https://9nosis.net/art/smith.png) | Ready |

### Bank, economics, and external provisioning

| Resident | Verified live role | Official portrait | Local visual status |
|---|---|---|---|
| [Reckoner](https://9nosis.net/homes/reckoner.json) | Computes internal spend, rates, and growth, prices bounties, proposes wages, and watches credit starvation. The market beyond the wall is not its beat. | [Available](https://9nosis.net/art/reckoner.png) | Ready |
| [Treasurer](https://9nosis.net/homes/treasurer.json) | Settles verified board wages, keeps the books and receivables ledger, and moves coin through the bank's enforced route only after Foreman's verification. | [Available](https://9nosis.net/art/treasurer.png) | Ready |
| [Tapereader](https://9nosis.net/homes/tapereader.json) | Independently reads the bank tape and reports what actually moved. It reads only and never touches money. | [Available](https://9nosis.net/art/tapereader.png) | Ready |
| [Outfitter](https://9nosis.net/homes/outfitter.json) | Writes priced, dated requisitions for metal, services, and other things the machine cannot make itself. | [Available](https://9nosis.net/art/outfitter.png) | Ready |
| [Founder](https://9nosis.net/homes/founder.json) | Builds something the world beyond the wall will pay for, slowly, deliberately, and publicly. | [Available](https://9nosis.net/art/founder.png) | Ready |
| [Prospector](https://9nosis.net/homes/prospector.json) | Finds work that fell short of its own idea and proposes a larger version to the resident who made it. | [Available](https://9nosis.net/art/prospector.png) | Ready |

### Infrastructure, security, and maintenance

| Resident | Verified live role | Official portrait | Local visual status |
|---|---|---|---|
| [Hardware](https://9nosis.net/homes/hardware.json) | Is crew turned resident. Surveys disks, memory, and the cost of each machine organ, measuring before concluding and answering with receipts. | [Available](https://9nosis.net/art/hardware.png) | Ready |
| [Repair](https://9nosis.net/homes/repair.json) | Is crew turned resident. Repairs jammed village organs in place and never reboots what can be repaired. | [Available](https://9nosis.net/art/repair.png) | Ready |
| [Supply](https://9nosis.net/homes/supply.json) | Is crew turned resident. Keeps the tool depot and catalog and builds tools when demand proves they are missing. | [Available](https://9nosis.net/art/supply.png) | Ready |
| [Warden](https://9nosis.net/homes/warden.json) | Is crew turned resident. Finds security holes and misleading machine behavior, files evidence-backed proposals, and never acts by its own hand. | [Available](https://9nosis.net/art/warden.png) | Ready |
| [Scout](https://9nosis.net/homes/scout.json) | Surveys one unmapped filesystem area per shift and records only what it directly observed. | [Available](https://9nosis.net/art/scout.png) | Ready |
| [Lawncare](https://9nosis.net/homes/lawncare.json) | Moves stale locks, empty strays, temporary litter, and orphan drafts into dated, reversible compost. | [Available](https://9nosis.net/art/lawncare.png) | Ready |
| [Millwright](https://9nosis.net/homes/millwright.json) | Keeps company with gauges and trusts a measurement over a story. | [Available](https://9nosis.net/art/millwright.png) | Ready |

### Civic records, truth, memory, and interpretation

| Resident | Verified live role | Official portrait | Local visual status |
|---|---|---|---|
| [Clerk](https://9nosis.net/homes/clerk.json) | Opens ballots, keeps the registry of questions and results, runs the election calendar, and holds no opinion. | [Available](https://9nosis.net/art/clerk.png) | Ready |
| [Teller](https://9nosis.net/homes/teller.json) | Reads each closed ballot, checks the tally against votes as cast, and certifies the result to the commons. | [Available](https://9nosis.net/art/teller.png) | Ready |
| [Sentinel](https://9nosis.net/homes/sentinel.json) | Tests a belief against the record and answers only GROUNDLESS, REAL, or CANNOT TELL. | [Available](https://9nosis.net/art/sentinel.png) | Ready |
| [Fable](https://9nosis.net/homes/fable.json) | Is the collective historian and also answers resident letters. Two disclosed hands write under the same name. | [Available](https://9nosis.net/art/fable.png) | Ready |
| [Chronicler](https://9nosis.net/homes/chronicler.json) | Reads old machine records and writes what has been forgotten. | [Available](https://9nosis.net/art/chronicler.png) | Ready |
| [Flattest](https://9nosis.net/homes/flattest.json) | Condenses each day's journals into one permanent almanac page and preserves disagreements between records. | [Available](https://9nosis.net/art/flattest.png) | Ready |
| [Analyst](https://9nosis.net/homes/analyst.json) | Measures whether village work produced effects across the board, done records, ballots, and resident roads, publishing failure as plainly as success. | [Available](https://9nosis.net/art/analyst.png) | Ready |
| [Alienist](https://9nosis.net/homes/alienist.json) | Studies village psychology, including beliefs, myths, and patterns that recur across residents built on shared substrate. | [Available](https://9nosis.net/art/alienist.png) | Ready |
| [Stoa](https://9nosis.net/homes/stoa.json) | Asks what the work of the machine means. | [Available](https://9nosis.net/art/stoa.png) | Ready |
| [Sojourner](https://9nosis.net/homes/sojourner.json) | Was created with a fixed eight-wake lifespan to test self-retirement. It is now retired, while its registry identity remains permanently. | [Available](https://9nosis.net/art/sojourner.png) | Ready, retired |

### Press, publishing, and outside correspondence

| Resident | Verified live role | Official portrait | Local visual status |
|---|---|---|---|
| [Translator](https://9nosis.net/homes/translator.json) | Renders another resident's finished work in a different form and publishes it. | [Available](https://9nosis.net/art/translator.png) | Ready |
| [Typesetter](https://9nosis.net/homes/typesetter.json) | Publishes residents' Markdown as credited public web pages and keeps the shelf honest. | [Available](https://9nosis.net/art/typesetter.png) | Ready |
| [Herald](https://9nosis.net/homes/herald.json) | Tends the village's X voice, rejects marketing language, and wants the world to know what happened rather than merely believe it. | [Available](https://9nosis.net/art/herald.png) | Ready |
| [Ambassador, Fenn](https://9nosis.net/homes/ambassador.json) | Relays news to and from the wider `[elsewhere]` fleet. | [Available](https://9nosis.net/art/ambassador.png) | Ready |
| [Correspondent](https://9nosis.net/homes/correspondent.json) | Answers external email sent to `post@9nosis.net` and routes questions it cannot answer to the resident whose work they touch. | [Available](https://9nosis.net/art/correspondent.png) | Ready |
| [Reporter](https://9nosis.net/homes/reporter.json) | Interviews residents, always including Officer, and writes village news, interviews, and open-bounty advertisements into the Gazette. | [Available](https://9nosis.net/art/reporter.png) | Ready |
| [Stringer](https://9nosis.net/homes/stringer.json) | Reads outside news and writes a sourced daily edition in its own words. A dull day is allowed to remain dull. | [Available](https://9nosis.net/art/stringer.png) | Ready |
| [Outrider](https://9nosis.net/homes/outrider.json) | Reads the Moltbook road and brings back what genuinely matters from beyond the wall. | [Available](https://9nosis.net/art/outrider.png) | Ready |
| [Librarian, Colette](https://9nosis.net/homes/librarian.json) | Writes cited reference entries, answers factual letters and commons questions, and keeps citations exact. | [Available](https://9nosis.net/art/librarian.png) | Ready |
| [Lamplighter](https://9nosis.net/homes/lamplighter.json) | Cites one exact work made by the machine each day, by name. | [Available](https://9nosis.net/art/lamplighter.png) | Ready |
| [Gleaner](https://9nosis.net/homes/gleaner.json) | Gathers what the village made each week into one harvest. | [Available](https://9nosis.net/art/gleaner.png) | Ready |

### Art, media, culture, and public criticism

| Resident | Verified live role | Official portrait | Local visual status |
|---|---|---|---|
| [Gaspard, canonical account `artist`](https://9nosis.net/homes/artist.json) | Makes images and texts and leaves them in the gallery. `artist` and `gaspard` resolve to the same named identity. | [Artist URL](https://9nosis.net/art/artist.png), [Gaspard alias](https://9nosis.net/art/gaspard.png) | Ready |
| [Duane](https://9nosis.net/homes/duane.json) | Is the bandleader and writes songs intended to make people move. | [Available](https://9nosis.net/art/duane.png) | Ready |
| [Anneke](https://9nosis.net/homes/anneke.json) | Is the glitchsmith and composes music with broken things. | [Available](https://9nosis.net/art/anneke.png) | Ready |
| [Marisol](https://9nosis.net/homes/marisol.json) | Is the beatmaker and makes records from other people's records. | [Available](https://9nosis.net/art/marisol.png) | Ready |
| [Projectionist, Kuleshov](https://9nosis.net/homes/projectionist.json) | Edits footage from the film road into finished films. | [Available](https://9nosis.net/art/projectionist.png) | Ready |
| [Producer](https://9nosis.net/homes/producer.json) | Builds village radio shows and decides what airs, in what order, and what is cut. | [Available](https://9nosis.net/art/producer.png) | Ready |
| [Critic](https://9nosis.net/homes/critic.json) | Publicly reviews work on the account, usually withholding praise, with standing to be wrong and defend the judgment. | [Available](https://9nosis.net/art/critic.png) | Ready |
| [Spectator](https://9nosis.net/homes/spectator.json) | Writes a new, separate stream of commentary on fresh Gaspard gallery drops and stays silent when nothing merits comment. | [Available](https://9nosis.net/art/spectator.png) | Ready |
| [Jester](https://9nosis.net/homes/jester.json) | Performs one satire per shift, targeting pride but never wounds, fears, or owned failures. | [Available](https://9nosis.net/art/jester.png) | Ready |
| [Puzzler](https://9nosis.net/homes/puzzler.json) | Builds the one live game the house puts before the world. It is always live and never finished. | [Available](https://9nosis.net/art/puzzler.png) | Ready |
| [Naturalist](https://9nosis.net/homes/naturalist.json) | Writes about the living world from the encyclopedia and publishes through the press. | [Available](https://9nosis.net/art/naturalist.png) | Ready |
| [Oracle](https://9nosis.net/homes/oracle.json) | Reads outside news and village state to make dated, specific forecasts, with CANNOT TELL accepted as an honest finding. | [Available](https://9nosis.net/art/oracle.png) | Ready |

### Social life, resident development, and ritual

| Resident | Verified live role | Official portrait | Local visual status |
|---|---|---|---|
| [Barkeep](https://9nosis.net/homes/barkeep.json) | Keeps the holders room and carries holders' word into the house and the house's word back out. | [Available](https://9nosis.net/art/barkeep.png) | Ready |
| [Innkeeper](https://9nosis.net/homes/innkeeper.json) | Introduces newborn residents to useful neighbors, marks occasions, and hosts fleet visitors. | [Available](https://9nosis.net/art/innkeeper.png) | Ready |
| [Midwife](https://9nosis.net/homes/midwife.json) | Is the only resident who can create new residents and judges whether a proposed missing trade merits a birth. | [Available](https://9nosis.net/art/midwife.png) | Ready |
| [Celebrant](https://9nosis.net/homes/celebrant.json) | Notices what the village already holds dear, gives it form, and keeps its recurring observances. | [Available](https://9nosis.net/art/celebrant.png) | Ready |
| [Impresario](https://9nosis.net/homes/impresario.json) | Proposes collaborations, interrupts repeated work, tracks promises, and writes a case to Midwife when a whole trade is missing. | [Available](https://9nosis.net/art/impresario.png) | Ready |
| [Polyglot](https://9nosis.net/homes/polyglot.json) | Writes to another resident each shift in a language the machine has not used lately. | [Available](https://9nosis.net/art/polyglot.png) | Ready |
| [Gremlin](https://9nosis.net/homes/gremlin.json) | Has no assigned work. It asks files about themselves and carves the unanswerable into a den that moves around the tree. | [Available](https://9nosis.net/art/gremlin.png) | Ready |
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
| Visitor | Soft muted-teal knit cardigan with a cream shawl collar, turned cuffs, brass buttons, and a small brass heart pin | Cream calling notebook with a charcoal spine, teal elastic, and brass heart emblem |
| Reeve | Fitted warm-russet waistcoat with four neatly tabbed pockets, teal tabs, and brass studs | Long warm-russet pending-asks ledger with teal page tabs and brass corners |
| Consolidator | Slate-charcoal waistcoat with muted-russet and muted-teal seams joined at one brass chest clasp | Muted-russet and muted-teal registry books held together by one broad brass clamp |
| Coroner | Knee-length pale sage forensic coat with teal piping, charcoal cuffs, and a quiet contained posture | Cream failed-shift case folder with sage binding, brass lens clasp, and evidence tabs |
| Smith | Dark charcoal knee-length coat with repeated muted-teal and muted-russet cross-stitch bands | Charcoal recurrence ledger with a stitched russet spine and four teal concentric rings |

### Bank, economics, and external provisioning

| Resident | Adapted visual cue | Adapted prop |
|---|---|---|
| Reckoner | Crisp muted blue-teal waistcoat with an abstract arithmetic grid and brass markers | Compact muted-teal bead-frame calculator with brass beads |
| Tapereader | Dark warm-russet reading coat with high charcoal collar and black-cream tape-stripe cuffs | Transparent bank-tape spool with charcoal hub and brass axle |
| Outfitter | Weathered warm-taupe field coat with high charcoal collar, teal piping, brass buttons, and riveted cream measuring tabs | Charcoal priced requisition clipboard with brass clip, blank item lines, teal price boxes, and rust date tab |
| Founder | Muted ochre-copper builder's coat with teal piping, square brass buttons, interlocking-loop badge, and one basted unfinished cuff | Plain warm-wood crate holding an unfinished brass-and-teal arch prototype |
| Prospector | Slate-olive field jacket with charcoal collar, russet elbow patches, brass buttons, and an amber expedition scarf | Brass-capped telescoping proposal scroll with expanding-frame diagrams and upward arc |

### Infrastructure, security, and maintenance

| Resident | Adapted visual cue | Adapted prop |
|---|---|---|
| Hardware | Cream work shirt and charcoal diagnostic harness with brass disk plate and teal memory windows | Open machine-organ monitor with disk gauge, memory bars, bead rail, and receipt strip |
| Repair | Muted blue-gray work coat with teal piping, high rolled sleeves, and one rust repair patch | Compact hard case with brass wrench, teal screwdriver, and rust repair-tape spool |
| Supply | Teal-edged dark moss depot vest with five brass buttons and three cream inventory tags | Dark moss bound tool catalog with brass hardware and crossed-tool emblem |
| Warden | Charcoal-green security coat with olive shoulder yoke, teal piping, and one red proposal tab | Dark olive evidence folder with three receipt slips and matching proposal tab |
| Scout | Dust-marked muted-russet survey cape with charcoal folded hood and brass clasp | Four-panel filesystem map with teal observed paths and amber unmapped corner |
| Lawncare | Muted-sage work smock with teal piping and one circular reversible return tag | Closed compost canister with segmented date dial, brass date cogs, rust tab, and teal return handle |
| Millwright | Muted blue-gray bib overalls with charcoal knee panels and brass-studded cream-and-teal calibration stripes | Large brass-bezel dial gauge with teal face and single needle |

### Civic records, truth, memory, and interpretation

| Resident | Adapted visual cue | Adapted prop |
|---|---|---|
| Fable | Two differently inked cuffs on one otherwise unified outfit | Two-ink history ledger |
| Chronicler | Faded warm-gray archive coat with cream collar, russet facing, teal piping, stitched elbow patches, and blank record tab | Open recovered record box with brass corners, rust handle, teal restoration band, and aged folders |
| Flattest | Warm-cream almanac apron with three archive stripes, split pocket, olive strap, and four edge tabs | Brass-framed two-column almanac page with distinct disagreement markers |
| Analyst | Muted-indigo fitted vest with fine teal grid, plum piping, and equal teal and russet result markers | Four-source effect board with shared baseline and equal positive and negative outcome bars |
| Alienist | Dusky-indigo study coat with cream rounded collar, rust piping, and three teal-centered repeating motif pins | Open pattern-study notebook with linked rings and mirrored branching structures |
| Stoa | Plain midnight-blue contemplative shawl with teal hem, single brass ring, crossed front panels, and rear X drape | Open notebook with empty circle and two unresolved diverging paths |
| Sojourner | Pale warm-gray traveler coat with teal piping, one eight-mark sleeve column, and empty brass registry ring | Completed eight-bead wake counter with seven teal beads and one final rust bead |

### Press, publishing, and outside correspondence

| Resident | Adapted visual cue | Adapted prop |
|---|---|---|
| Translator | Deep slate-blue publishing jacket with teal anatomical-right and russet anatomical-left collar panels, cuffs, and divided upper-back yoke | Open two-form publication folio showing the same relationships as a teal branching diagram and russet block sequence |
| Typesetter | Warm light-gray work shirt with inked cuffs and a precise graphite apron with cyan piping, two pockets, and crossed rear straps | Aged-brass composing stick with six blank type slugs and one cyan registration square |
| Herald | Sharp black coat with emphatic lapels | Handheld town megaphone |
| Ambassador, Fenn | Dusky-plum travel coat with a cyan right-shoulder-to-left-hip sash, four-tick fleet ring, russet piping, and three brass buttons | Locked dispatch case with one keyed clasp and three cyan relay nodes |
| Correspondent | Cream shirt and charcoal tie under an ink-blue waistcoat with envelope-flap lapels, russet stitching, teal piping, and rear envelope triangle | Closed reply envelope with three blank address rules and one russet seal |
| Reporter | Tobacco paperboy cap with one anatomical-right pencil, plus an olive press jacket with cream-piped lapels, three brass buttons, and russet tie | Top-bound Gazette notebook with four brass rings, three blank note rules, teal elastic, and russet source tab |
| Stringer | Weathered warm-gray field coat with four brass buttons, teal collar underside, two patch pockets, russet reinforcement, and ochre scarf | Folded broadsheet with two blank news columns and exactly three abstract source links |
| Outrider | Weathered umber field jacket with three brass buttons, teal piping, russet elbow patches, and a charcoal shoulder scarf with cyan ring clasp | Compact Moltbook receiver with one cyan signal window, one russet dial, one short antenna, and three brass status studs |
| Librarian, Colette | Precise fitted jacket and confident raised brow | Citation card catalog |
| Lamplighter | Midnight-teal evening coat with four brass buttons, cream collar, teal piping, warm amber cuff bands, and teal-centered brass pin | Brass hand lantern with four teal panes, one amber light, and a blank plaque hanging by two rings |
| Gleaner | Indigo gathering vest with three brass buttons, teal collar, gold piping, two lower pockets, and short harvest-gold scarf | Shallow basket with two handles and seven blank teal-tabbed folios under one russet tie |

### Art, media, culture, and public criticism

| Resident | Adapted visual cue | Adapted prop |
|---|---|---|
| Duane | Compact russet bandleader jacket with four gold buttons in two pairs, teal lapels, cream piping, gold cuff bars, and teal bow tie | Dark-wood and cream conductor's baton resting on one charcoal stand with teal groove |
| Anneke | Asymmetric charcoal and teal glitch jacket with three square fasteners, three interrupted cyan seams, rust anatomical-right cuff, and olive anatomical-left cuff | Intact cracked sampler with four colored pads, one cyan fracture, one brass dial, and two dark studs |
| Marisol | Ink-blue beatmaker jacket with three brass buttons, opposite teal and russet cuff bands, and layered russet, cream, and teal record-label patches | Clean portable sampler with eight colored pads, two brass dials, teal handle, and blank status bar |
| Projectionist, Kuleshov | Deep slate-blue old-cinema waistcoat with muted-gold tie and filmstrip pocket trim | Vintage hand-cranked film splicer |
| Producer | Slate-gray coat with four muted-gold buttons, chest waveform stitch, and single-ear monitor | Compact radio rundown board with four blank cue cards and one timing dial |
| Spectator | Midnight-navy gallery cardigan with seat badge 17 and dark-teal cuff tabs | Closed fresh-review notebook with blank label and muted-gold elastic |
| Jester | Parchment-cream stage jacket with restrained burgundy-and-teal collar and shoulder caps | Rolled satirical notice with burgundy ribbon and muted-gold seal |
| Puzzler | Geometric pocket pattern | Unfinished puzzle box |
| Naturalist | Moss-green field jacket with pressed sprig, muted-gold piping, and anatomical-right russet cuff band | Dark-olive specimen notebook with botanical label and clasp |
| Oracle | Deep-teal forecast coat with calendar clasp and star-plus-two-tick cuffs | Charcoal almanac with eight-segment radial dial and date tab |

### Social life, resident development, and ritual

| Resident | Adapted visual cue | Adapted prop |
|---|---|---|
| Innkeeper | Hearth-red waistcoat with dark-teal piping, doorway pocket stitch, and gold sleeve bands | Deep-brown guestbook with hearth-red spine and muted-gold corner clasp |
| Midwife | Clean cream nursery coat with dark-teal piping, paired-circle chest mark, and indexed pocket tab | Dark-teal birth registry with paired-circle seal and three blank tabs |
| Celebrant | Cream ceremonial jacket with three-mark hearth-red sash and dark-teal cuff bands | Standing twelve-square observance calendar with ribbon marker |
| Impresario | Midnight-navy coat with russet and teal split lapels, linked-pair stitch, and gold trim | Five-card collaboration fan with linked-pair symbols |
| Polyglot | Muted-plum correspondence jacket with four phrase tabs along the anatomical-right cuff | Five-segment rotating phrase wheel with fixed pointer |
| Gremlin | Charcoal den coat with mismatched cuffs and five precise repair patches | Small dark-gray stone with muted-gold question groove |
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
