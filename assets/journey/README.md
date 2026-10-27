# Journey icons

The two organization logos were cleaned with the built-in imagegen tool from the user-supplied Senja JPEG and SMK-BPP PNG. Final website files are transparent 256 × 256 WebP, with a centered 224 × 224 content area and 16px outer padding. They are resized and encoded with Sharp (quality 88, alpha quality 100).

- `public/images/journey/senja-solutions.webp` — Senja logo.
- `public/images/journey/smk-bpp.webp` — school logo.
- `public/images/journey/testing-engineer.webp` — software-testing illustration with a code screen, magnifying glass, and success badge; rendered from `assets/journey/testing-engineer.svg` as transparent 256 × 256 WebP (quality 90).

Each icon path is owned by the entry in `src/features/portfolio/data/journey.json`.

## Image editing prompts

### Senja

Edit target: supplied Senja logo. Clean faithful high resolution restoration and background extraction for a website organization icon. Preserve exact original orange Senja script letterforms and charcoal slogan 'Bringing Ideas to Life', with identical original layout, letter shapes, proportions and palette. Sharpen jagged edges, remove white background completely including counters of letters. Flat clean logo only on real transparent alpha, no shadows no glow no new design. Center whole intact logo in a square canvas with modest even margins. Preserve all text exactly. Do not redesign.

### SMK-BPP

Edit target: supplied circular SMK-BPP BANDUNG school logo. Faithful high resolution restoration of THIS exact mark for website icon. Clean smooth circular dark outline, original lime green circle, original green lily pads with dark veins, white lotus and original black text 'SMK-BPP' above and 'BANDUNG' below. Preserve exact composition, lettering and botanical details of source, no redesign or extra elements. Remove all background outside circle to real transparent alpha, preserve white lotus interior. Center entire circle in square canvas with modest even margins. Crisp flat color edges, no shading no glow no shadow.

## New-design scenes (13 Oct 2026)

`testing-vignette.webp`, `school-vignette.webp`, `senja-vignette.webp` (900 × 600), `books-corner.webp` (900 × 450) and `seated-robot.webp` (800 × 1000) come unchanged from the generated asset package `feri-portfolio-new-design-assets` (built-in ImageGen, reference `02-journey.png`); masters are the `journey-*-master.png` files here and prompts are in that package's `provenance/generation-tasks.json`. Each entry in `journey.json` names its `scene`; `logoBox` (percent of the scene canvas) places the real school/Senja logo over the scene's clear area. The Ultimo scene draws its own testing illustration, so it has no `logoBox`. The seated robot is a decorative still of the same character, not the interactive 3D robot.
