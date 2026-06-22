const ITEMS = ["Managed IT", "Cybersecurity", "Business Systems"];

export default function TextMarquee() {
  const track = ITEMS.concat(ITEMS);

  return (
    <div
      className="relative overflow-hidden bg-bg py-10 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee items-center gap-x-20 pr-20">
        {track.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="shrink-0 font-display text-[clamp(1.375rem,3.4vw,2.5rem)] leading-none tracking-[-0.03em] text-white/30"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
