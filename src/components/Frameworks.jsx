import { motion } from "motion/react";

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

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {skills.map((skill, index) => (
        <motion.div
          key={index}
          className="absolute opacity-15 hover:opacity-30 transition-opacity duration-300"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 80 - 40, 0],
            y: [0, Math.random() * 80 - 40, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 25 + Math.random() * 25,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 8,
          }}
        >
          <Icon src={`assets/logos/${skill.name}.${skill.ext}`} />
        </motion.div>
      ))}
    </div>
  );
}

const Icon = ({ src }) => (
  <img src={src} className="w-8 h-8 md:w-10 md:h-10 duration-200 rounded-sm hover:scale-110" />
);
