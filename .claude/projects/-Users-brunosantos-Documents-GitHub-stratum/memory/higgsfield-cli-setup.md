---
name: higgsfield-cli-setup
description: Higgsfield image/video generation is set up globally via CLI + skills
metadata:
  type: reference
---

The user generates images/videos with **Higgsfield**, set up globally (account: bruce.santos@gmail.com, plus plan).

- CLI installed globally: `higgsfield` (e.g. `higgsfield generate create <model> --prompt "..." --aspect_ratio 16:9 --resolution 2k --wait`). Auth is global (`higgsfield auth login`, already done) — do NOT run `higgsfield auth token` (it dumps the secret and the harness blocks it).
- Skills installed (via `npx skills add higgsfield-ai/skills`): `higgsfield-generate`, `higgsfield-soul-id`, `higgsfield-product-photoshoot`, `higgsfield-marketplace-cards`. Skills are per-project (in `.agents/skills/`); re-run the `npx skills add` one-liner in other projects.
- For Claude Code, use the CLI/Skill path, NOT the MCP custom connector (that's for the claude.ai app).
- Default image model chosen for this project: `nano_banana_2`. See [[stratum-image-art-direction]].
- Generated assets come back as a CloudFront URL; `curl` it down, then place in the repo.
