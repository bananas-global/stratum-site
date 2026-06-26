const ITEMS = ["Managed IT", "Cybersecurity", "Business Systems"];

// Each half repeats the items enough times to overflow even very wide
// viewports. The track is two identical halves, so the -50% loop is seamless.
const HALF = Array.from({ length: 6 }, () => ITEMS).flat();

export default function TextMarquee() {
  return (
    <div
      className="relative overflow-hidden bg-bg py-10 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee items-center">
        {[...HALF, ...HALF].map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="shrink-0 pr-20 font-display text-[clamp(1.375rem,3.4vw,2.5rem)] leading-none tracking-[-0.03em] text-white/30"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
