import { OrbitingCircles } from "./OrbitingCircles";

export function Frameworks({ className = "" }) {
  const frontendSkills = [
    { name: "html5", ext: "svg" },
    { name: "css3", ext: "svg" },
    { name: "javascript", ext: "svg" },
    { name: "react", ext: "svg" },
    { name: "tailwindcss", ext: "svg" },
    { name: "vitejs", ext: "svg" },
  ];

  const backendDataToolSkills = [
    { name: "java", ext: "png" },
    { name: "springboot", ext: "png" },
    { name: "python", ext: "png" },
    { name: "django", ext: "png" },
    { name: "postgre", ext: "png" },
    { name: "sqlite", ext: "svg" },
    { name: "mysql", ext: "png" },
    { name: "git", ext: "svg" },
    { name: "aws-svgrepo-com", ext: "svg" },
    { name: "kubernetes-svgrepo-com", ext: "svg" },
    { name: "auth0", ext: "svg" },
  ];

  return (
    <div
      className={`relative flex h-[15rem] w-full flex-col items-center justify-center ${className}`}
    >
      <OrbitingCircles
        radius={68}
        speed={1.05}
        iconSize="clamp(1.2rem, 3.6vw, 1.75rem)"
      >
        {frontendSkills.map((skill) => (
          <Icon
            key={skill.name}
            src={`assets/logos/${skill.name}.${skill.ext}`}
            alt={skill.name}
          />
        ))}
      </OrbitingCircles>

      <OrbitingCircles
        radius={108}
        reverse
        speed={1.25}
        iconSize="clamp(0.95rem, 2.8vw, 1.35rem)"
      >
        {backendDataToolSkills.map((skill) => (
          <Icon
            key={skill.name}
            src={`assets/logos/${skill.name}.${skill.ext}`}
            alt={skill.name}
          />
        ))}
      </OrbitingCircles>
    </div>
  );
}

const Icon = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    className="size-full object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.18)] duration-200 hover:scale-110"
  />
);
