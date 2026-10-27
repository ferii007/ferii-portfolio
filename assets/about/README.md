# About Me illustration

`public/images/about/plant-and-books.png` is a transparent decorative asset generated with the built-in imagegen tool. The visual reference is the About Me vignette in `feri-portfolio-all-assets/01-ui-design/01-home-selected.png` from the supplied ZIP. It is design reference, not a source of profile facts. The note and all profile text remain HTML.

## Generation prompt

Generate one transparent-background web illustration asset inspired by ONLY the About Me decorative vignette in the supplied portfolio mockup (second section below hero). Do NOT generate a website or robot. Wide landscape composition 3:2. Hand-painted editorial watercolor and colored-pencil illustration with subtle soft realistic volume, warm paper texture, dark fine sketch contours. On the RIGHT: a flourishing small rubber plant with rounded olive/sage green leaves and dark thin stems in a small gray ceramic pot, sitting on three stacked thick hardcover books, spines navy/teal blue, blue, and warm brown, subtle cream page edges. Spines have just the tiny hand-drawn words DESIGN, CODE, PROGRESS, in that order. Include a few small loose green leaves near the book base. LEFT HALF MUST BE EMPTY TRANSPARENT SPACE for an HTML sticky note overlay, no paper and no text in the empty left half. Plant foliage may reach slightly into the top middle but keep the left two thirds clear below. Behind the right-side objects include just a few faint pale warm-gray brush marks that fade into transparency, with soft contact shadow at base. Isolated PNG true alpha background. Composition plant spans upper right, books lower right, illustrated subject fits wholly inside canvas with no clipping. Match the original reference plant/books proportions, palette and friendly organic illustration quality. No huge title, no interface, no frames, no card, no watermark. The HTML note will be inserted on left at x12%-57% y25%-85%, keep that region clear.

## Studio desk (new design, A01)

Base artwork: `studio-desk-master.png` (1536 × 1024, alpha), unchanged from the generated asset package `feri-portfolio-new-design-assets` (13 Oct 2026, built-in ImageGen, reference `01-hero-about-currently-skills.png`; prompt in that package's `provenance/generation-tasks.json`).

`public/images/about/studio-desk.webp` is `studio-desk-clean.png`: that artwork with the two small orange spark marks on the notebook pages painted out (paper colour), encoded with cwebp q 88. The small labels from the mockup (book spines, mug, notebook notes, sticky note) are real HTML text in `AboutIllustration.jsx`, placed by percent coordinates and angles traced from this canvas. `plant-and-books.png` remains only as the interim footer prop.

> Removed in the v1 launch cleanup: `plant-and-books.png` is no longer used by the page and was deleted from `public/` (recoverable from git history at commit `f173578`).
