import { motion } from "motion/react";
import { useMemo } from "react";

export function Frameworks() {
  const skills = [
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

  // Generate random positions and animations only once
  const skillElements = useMemo(() => {
    return skills.map((skill, index) => {
      const left = Math.random() * 100; // Spread across full screen width (0%-100%)
      const top = Math.random() * 100;  // Spread across full screen height (0%-100%)
      const moveX = Math.random() * 120 - 60; // Movement range: -60px to +60px
      const moveY = Math.random() * 120 - 60; // Movement range: -60px to +60px
      const duration = 25 + Math.random() * 25;
      const delay = Math.random() * 8;
      
      return {
        skill,
        left,
        top,
        moveX,
        moveY,
        duration,
        delay
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {skillElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute opacity-15 hover:opacity-30 transition-opacity duration-300"
          style={{
            left: `${element.left}%`,
            top: `${element.top}%`,
          }}
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
        >
          <Icon src={`assets/logos/${element.skill.name}.${element.skill.ext}`} />
        </motion.div>
      ))}
    </div>
  );
}

const Icon = ({ src }) => (
  <img src={src} className="w-8 h-8 md:w-12 md:h-12 duration-200 rounded-sm hover:scale-110" />
);
