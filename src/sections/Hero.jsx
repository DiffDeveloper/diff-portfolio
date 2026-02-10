import HeroText from "../components/HeroText";
import { Particles } from "../components/Particles";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useCallback, useMemo, useRef } from "react";

const SKILLS = [
  { name: "auth0", ext: "svg" },
  { name: "cplusplus", ext: "svg" },
  { name: "css3", ext: "svg" },
  { name: "django", ext: "png" },
  { name: "git", ext: "svg" },
  { name: "html5", ext: "svg" },
  { name: "java", ext: "png" },
  { name: "javascript", ext: "svg" },
  { name: "postgre", ext: "png" },
  { name: "python", ext: "png" },
  { name: "react", ext: "svg" },
  { name: "springboot", ext: "png" },
  { name: "sqlite", ext: "svg" },
  { name: "tailwindcss", ext: "svg" },
  { name: "vitejs", ext: "svg" },
];

const FloatingSkillLogo = ({ element, containerRef, cursorX, cursorY }) => {
  const parallaxX = useTransform(
    cursorX,
    [-0.5, 0.5],
    [-element.depth, element.depth]
  );
  const parallaxY = useTransform(
    cursorY,
    [-0.5, 0.5],
    [-element.depth, element.depth]
  );

  return (
    <motion.div
      className="absolute z-0 cursor-grab select-none touch-none active:cursor-grabbing"
      style={{ left: `${element.left}%`, top: `${element.top}%` }}
      drag
      dragConstraints={containerRef}
      dragElastic={0.2}
      dragMomentum
      dragPropagation={false}
      dragTransition={{
        power: 0.2,
        timeConstant: 350,
        bounceStiffness: 120,
        bounceDamping: 20,
      }}
      whileTap={{ scale: 1.1, opacity: 0.5 }}
      whileDrag={{ scale: 1.15, opacity: 0.45, zIndex: 20 }}
    >
      <motion.div style={{ x: parallaxX, y: parallaxY }}>
        <motion.img
          src={`assets/logos/${element.skill.name}.${element.skill.ext}`}
          alt={`${element.skill.name} logo`}
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
          className="size-8 rounded-sm opacity-15 transition-opacity duration-300 hover:opacity-35 md:size-12"
          animate={{
            x: [0, element.moveX, 0],
            y: [0, element.moveY, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            ease: "linear",
            delay: element.delay,
          }}
        />
      </motion.div>
    </motion.div>
  );
};

const Hero = () => {
  const backgroundRef = useRef(null);
  const cursorXValue = useMotionValue(0);
  const cursorYValue = useMotionValue(0);
  const cursorX = useSpring(cursorXValue, {
    stiffness: 120,
    damping: 20,
    mass: 0.3,
  });
  const cursorY = useSpring(cursorYValue, {
    stiffness: 120,
    damping: 20,
    mass: 0.3,
  });

  // Generate random positions and animations only once
  const skillElements = useMemo(() => {
    return SKILLS.map((skill) => {
      const left = Math.random() * 100; // Spread across full screen width (0%-100%)
      const top = Math.random() * 100;  // Spread across full screen height (0%-100%)
      const moveX = Math.random() * 120 - 60; // Movement range: -60px to +60px
      const moveY = Math.random() * 120 - 60; // Movement range: -60px to +60px
      const duration = 25 + Math.random() * 25;
      const delay = Math.random() * 8;
      const depth = 8 + Math.random() * 20;

      return {
        skill,
        left,
        top,
        moveX,
        moveY,
        duration,
        delay,
        depth,
      };
    });
  }, []);

  const handlePointerMove = useCallback(
    (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
      const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;

      cursorXValue.set(normalizedX);
      cursorYValue.set(normalizedY);
    },
    [cursorXValue, cursorYValue]
  );

  const handlePointerLeave = useCallback(() => {
    cursorXValue.set(0);
    cursorYValue.set(0);
  }, [cursorXValue, cursorYValue]);

  return (
    <section
      id="home"
      className="relative isolate flex min-h-screen items-start justify-center overflow-hidden md:items-start md:justify-start c-space"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <HeroText />
      
      {/* Floating Tech Stacks Background */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 z-0 h-full w-full overflow-hidden"
      >
        {skillElements.map((element) => (
          <FloatingSkillLogo
            key={element.skill.name}
            element={element}
            containerRef={backgroundRef}
            cursorX={cursorX}
            cursorY={cursorY}
          />
        ))}
      </div>
      
      {/* Particles Background - Same as Contact.jsx */}
      <Particles
        className="absolute inset-0 -z-50"
        quantity={100}
        ease={80}
        color={"#ffffff"}
        refresh
      />
    </section>
  );
};

export default Hero;
