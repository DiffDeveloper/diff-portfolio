import Marquee from "./Marquee";
import { nowItems } from "../constants";

const NowStrip = () => {
  return (
    <div className="c-space relative z-10 -mt-8 md:-mt-12">
      <div className="overflow-hidden rounded-full border border-white/10 bg-midnight/70 backdrop-blur-sm">
        <Marquee
          pauseOnHover
          repeat={6}
          className="py-2.5 [--duration:45s] [--gap:2.75rem] [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        >
          {nowItems.map((item) => (
            <span
              key={item.label}
              className="flex items-center gap-2 whitespace-nowrap text-xs text-neutral-300"
            >
              <span className="relative flex size-1.5" aria-hidden="true">
                {item.live && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
                )}
                <span className="relative inline-flex size-1.5 rounded-full bg-white" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                {item.label}
              </span>
              {item.text}
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default NowStrip;
