import { twMerge } from "tailwind-merge";
import ShineBorder from "./ShineBorder";

const HoverBorderButton = ({ href, children, className = "", target, rel }) => {
  const Wrapper = href ? "a" : "button";

  return (
    <Wrapper
      href={href}
      target={target}
      rel={rel}
      className={twMerge(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-primary/88 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(255,255,255,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
        className
      )}
    >
      <ShineBorder
        borderWidth={1}
        duration={5}
        shineColor={["#ffffff", "#c7c7c7", "#ffffff"]}
        className="rounded-full"
      />
      <span className="relative z-10 px-5 py-2.5">{children}</span>
    </Wrapper>
  );
};

export default HoverBorderButton;
