import { twMerge } from "tailwind-merge";

const Spotlight = ({ className = "", fill = "#33c2cc" }) => {
  return (
    <div
      className={twMerge(
        "pointer-events-none absolute h-[24rem] w-[24rem] rounded-full blur-3xl md:h-[34rem] md:w-[34rem]",
        className
      )}
      style={{
        background: `radial-gradient(circle at center, ${fill} 0%, transparent 68%)`,
      }}
      aria-hidden="true"
    />
  );
};

export default Spotlight;
