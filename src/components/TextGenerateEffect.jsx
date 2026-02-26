import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";

const TextGenerateEffect = ({
  words,
  className = "",
  wordClassName = "",
  delay = 0,
}) => {
  const tokens = words.trim().split(/\s+/);

  return (
    <motion.p
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.045,
            delayChildren: delay,
          },
        },
      }}
      initial="hidden"
      animate="visible"
      className={twMerge("leading-relaxed", className)}
    >
      {tokens.map((token, index) => (
        <motion.span
          key={`${token}-${index}`}
          variants={{
            hidden: { opacity: 0, y: 6, filter: "blur(7px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.32, ease: "easeOut" },
            },
          }}
          className={twMerge("mr-1.5 inline-block", wordClassName)}
        >
          {token}
        </motion.span>
      ))}
    </motion.p>
  );
};

export default TextGenerateEffect;
