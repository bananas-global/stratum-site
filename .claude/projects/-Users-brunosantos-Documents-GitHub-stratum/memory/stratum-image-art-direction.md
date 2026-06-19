---
name: stratum-image-art-direction
description: Art direction for AI-generated imagery on the Stratum site (hero backgrounds etc.)
metadata:
  type: project
---

Locked art direction for AI-generated imagery on the Stratum marketing site, dialed in with the user over several iterations.

**Subject/form:** geometric forms with softly rounded edges — chamfers, fillets, radii — like Apple industrial design / CNC-machined hardware. NOT organic, flowing, liquid, or blobby.

**Material:** smooth anodized aluminum, like Apple Space Gray unibody MacBook — fine micro-bead-blasted satin, cool gunmetal/graphite tone. NOT brushed metal (no directional streaks/grain), NOT rubber, NOT matte plastic, NOT crystal/gem/precious stone.

**Lighting/palette:** low-key, dark, deep blacks; a single restrained amethyst `#7d34ff` separation/edge light (subtle, not a purple wash). Anti-gamer: no RGB, neon, cyberpunk, bloom, HUD, hexagons, lens flares.

**Hero composition:** macro close-up, subject weighted to the RIGHT and bleeding off the top/right edges (NOT a small centered object with margin). Left ~40% near-empty black for text. Heroes use `object-[66%_42%]`.

**Card/thumbnail composition (different from heroes):** for the service cards (`/public/images/managed-it.png`, `cybersecurity.png`, `business-systems.png`) the subject is CENTERED, fully INSIDE the frame, FLOATING/levitating (NO floor, ground plane, reflection, or cast shadow below — the user explicitly prefers floating), on a true `#000000` solid background (no lifted blacks, or the image edge shows against the card's `bg-black`). Rendered `object-contain p-8` in a 16/10 `bg-black` card; generated at 3:2.

**Model:** generate via Higgsfield CLI with **`nano_banana_2`** (Nano Banana 2), 16:9, 2k. User compared it against `gpt_image_2` and picked Nano Banana 2 for better material realism. See [[higgsfield-cli-setup]].

The full spec lives in `images-look-feel.json` at repo root (includes a `negative_prompt.avoid` list encoding all the "don't"s above). After swapping any `/public/images/*` file with the same name, run `rm -rf .next/cache/images` or the Next image optimizer serves the stale version.

`PageHero` (components/sections.tsx) renders a readability scrim over `backgroundVisual`: `bg-gradient-to-r from-black via-black/70 to-transparent` — needed because the Nano Banana renders are lighter than the old hero art.
