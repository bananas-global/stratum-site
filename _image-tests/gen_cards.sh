#!/bin/bash
# Generate 10 variations per service card, crush blacks, build contact sheets.
set -u
cd /Users/brunosantos/Documents/GitHub/stratum
ROOT=_image-tests
mkdir -p "$ROOT/managed-it" "$ROOT/cybersecurity" "$ROOT/business-systems"

CAM="Clean THREE-QUARTER ISOMETRIC perspective, camera at a fixed medium distance, object CENTERED and FLOATING, LARGE and close to camera — filling about 80 percent of the frame width with only a small even margin around it, fully inside the frame, NOT cropped. NO floor, NO ground plane, NO surface beneath, NO reflection or mirrored image below, NO cast shadow on ground — it floats in a pure black void."
MAT="Material: DARK GUNMETAL / GRAPHITE anodized aluminum, deep charcoal Space Gray tone (the darkest graphite Apple finish), subdued matte-satin, fine micro-bead-blasted; clearly metal but DARK — NOT bright silver, NOT chrome, NOT mirror-polished, NOT light grey, NOT white metal. Restrained soft non-directional sheen with only subtle controlled specular highlights on the edges; no brushed streaks, no grain."
LIGHT="Studio product render on a SOLID PURE BLACK seamless infinite background, true black #000000 with NO lifted blacks. Low-key, dark, moody studio lighting, deep rich blacks, a single restrained amethyst violet (#7d34ff) edge/separation accent, soft-box key from upper right kept dim, controlled subtle metallic glints. 50mm, shallow depth of field. Octane / Redshift ultra-high-definition render, ray tracing. Restrained, premium, precision-engineered, editorial minimalism. Low saturation, dark, cinematic."
NEG="STRICTLY AVOID: bright silver, chrome, mirror-polished metal, light grey or white metal, high-key bright lighting, small object with large empty margin, floor, ground plane, surface beneath object, reflection, mirrored reflection below, cast shadow on ground, object cropped or bleeding off frame, off-center composition, busy background, gradient or grey background, lifted or washed-out blacks, organic or flowing or liquid forms, blobby shapes, brushed metal texture, directional grain, rubber, matte plastic, painted look, cheap plastic, crystal, gemstone, gamer aesthetic, RGB lighting, neon, glowing bloom, cyberpunk, circuit-board glow, hexagons, HUD, sci-fi UI, lens flares, particles, holographic, high saturation, amateur CGI, tacky kitsch, stock-photo feel, any text or logos."

form_for() {
  case "$1" in
    managed-it) echo "The object: three precise rounded-rectangular machined plates stacked and slightly offset like layered tiles, representing layered oversight — geometric form with softly rounded edges, clean chamfers, fillets and radii, Apple industrial design / CNC-machined hardware." ;;
    cybersecurity) echo "The object: a rounded machined sphere nested inside a precise curved protective shell or bracket that partially wraps around it, representing protection and security — geometric form with softly rounded edges, clean chamfers, fillets and radii, Apple industrial design / CNC-machined hardware." ;;
    business-systems) echo "The object: four rounded machined cubes arranged in a tidy SYMMETRIC 2x2 square cluster, joined by short STRAIGHT orthogonal connecting bars (horizontal and vertical only, NO diagonals), perfectly balanced, representing connected business systems — geometric forms with softly rounded edges, clean chamfers, fillets and radii, Apple industrial design / CNC-machined hardware." ;;
  esac
}

gen() {
  local cat="$1"; local i="$2"
  local form; form="$(form_for "$cat")"
  local out; out="$(higgsfield generate create nano_banana_2 --aspect_ratio 3:2 --resolution 2k --prompt "$CAM $form $MAT $LIGHT $NEG" --wait --wait-timeout 15m 2>/dev/null | tail -1)"
  if [[ "$out" == http* ]]; then
    curl -fsSL "$out" -o "$ROOT/$cat/$(printf '%02d' "$i").png" && echo "ok $cat $i"
  else
    echo "FAIL $cat $i: $out"
  fi
}

N=0
for cat in managed-it cybersecurity business-systems; do
  for i in $(seq 1 10); do
    gen "$cat" "$i" &
    N=$((N+1))
    if (( N % 6 == 0 )); then wait; fi
  done
done
wait
echo "=== all generations done ==="

python3 - <<'PY'
from PIL import Image, ImageDraw
import os, glob
black=22
lut=[max(0,round((v-black)*255/(255-black))) for v in range(256)]*3
root='_image-tests'
for cat in ['managed-it','cybersecurity','business-systems']:
    files=sorted(glob.glob(f'{root}/{cat}/*.png'))
    thumbs=[]
    for f in files:
        try:
            im=Image.open(f).convert('RGB').point(lut)
        except Exception as e:
            print('skip',f,e); continue
        im.save(f)
        t=im.copy(); t.thumbnail((520,520))
        thumbs.append((os.path.splitext(os.path.basename(f))[0],t))
    if not thumbs:
        print('no images for',cat); continue
    cols=2; cw=540; ch=400
    rows=(len(thumbs)+cols-1)//cols
    sheet=Image.new('RGB',(cols*cw, rows*ch),(0,0,0))
    d=ImageDraw.Draw(sheet)
    for idx,(name,t) in enumerate(thumbs):
        r,c=divmod(idx,cols)
        x=c*cw+(cw-t.width)//2; y=r*ch+(ch-t.height)//2
        sheet.paste(t,(x,y))
        d.text((c*cw+10, r*ch+10), f"{cat} #{name}", fill=(180,140,255))
    sheet.save(f'{root}/contact_{cat}.png')
    print('contact sheet',cat,len(thumbs),'imgs')
PY
echo "=== done ==="
open /Users/brunosantos/Documents/GitHub/stratum/_image-tests/ 2>/dev/null || true
