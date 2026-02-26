import { motion } from "motion/react";
import { FlipWords } from "./FlipWords";
import HoverBorderButton from "./HoverBorderButton";
import TextGenerateEffect from "./TextGenerateEffect";

const HeroText = () => {
  const words = ["Secure", "Modern", "Scalable"];

  return (
    <div className="relative z-10 flex w-full items-center py-20 md:py-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-[11px] tracking-[0.3em] text-cyan-200/85 uppercase"
          >
            Fullstack Engineer • Bangkok
          </motion.p>

          <TextGenerateEffect
            words="Building production-minded software with clean architecture and reliable delivery."
            delay={0.15}
            className="mx-auto max-w-2xl text-sm text-neutral-300 md:text-base"
          />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.45, ease: "easeOut" }}
            className="text-[clamp(1.25rem,5.1vw,3rem)] font-semibold leading-tight whitespace-nowrap text-white"
          >
            Hi, I&apos;m Min Khant Than Swe
          </motion.h1>

          <div className="space-y-3">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.45, ease: "easeOut" }}
              className="text-xl text-neutral-200 sm:text-2xl md:text-3xl"
            >
              I design and deliver
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.45, ease: "easeOut" }}
            >
              <FlipWords
                words={words}
                className="font-black text-4xl text-white sm:text-5xl md:text-6xl"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.45, ease: "easeOut" }}
              className="text-lg text-neutral-300 sm:text-xl md:text-2xl"
            >
              fullstack products and software solutions.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.45, ease: "easeOut" }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <HoverBorderButton href="#projects">View Projects</HoverBorderButton>
            <HoverBorderButton href="#contact">Let&apos;s Talk</HoverBorderButton>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.45, ease: "easeOut" }}
            className="mx-auto max-w-xl text-xs text-neutral-300 sm:text-sm"
          >
            Intern @ Sunline • 5+ shipped projects • AI capstone presenter
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.55, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-sm md:max-w-md"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(51,194,204,0.35),transparent_72%)] blur-xl" />
          <img
            src="/assets/Adobe Express - file.png"
            alt="Min Khant Than Swe profile"
            className="relative mx-auto h-auto w-full max-w-[22rem] object-contain"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default HeroText;
