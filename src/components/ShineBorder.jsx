import { twMerge } from "tailwind-merge";

const ShineBorder = ({
  borderWidth = 1,
  duration = 14,
  shineColor = "#000000",
  className = "",
  style,
  ...props
}) => {
  const colorStops = Array.isArray(shineColor)
    ? shineColor.join(",")
    : shineColor;

  return (
    <div
      style={{
        "--border-width": `${borderWidth}px`,
        "--duration": `${duration}s`,
        backgroundImage: `radial-gradient(transparent, transparent, ${colorStops}, transparent, transparent)`,
        backgroundSize: "300% 300%",
        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        padding: "var(--border-width)",
        animation: "shine var(--duration) linear infinite",
        ...style,
      }}
      className={twMerge(
        "pointer-events-none absolute inset-0 size-full rounded-[inherit] opacity-0 transition-opacity duration-200 will-change-[background-position] [animation-play-state:paused] group-hover:opacity-100 group-hover:[animation-play-state:running] group-focus-within:opacity-100 group-focus-within:[animation-play-state:running] group-active:opacity-100 group-active:[animation-play-state:running]",
        className
      )}
      {...props}
    />
  );
};

export default ShineBorder;
