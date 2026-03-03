import { OrbitingCircles } from "./OrbitingCircles";

export function Frameworks({ className = "" }) {
  const frontendSkills = [
    { name: "html5", ext: "svg" },
    { name: "css3", ext: "svg" },
    { name: "javascript", ext: "svg" },
    { name: "react", ext: "svg" },
    { name: "icons8-vue-js", ext: "svg" },
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
    { name: "icons8-docker", ext: "svg" },
    { name: "icons8-firebase", ext: "svg" },
  ];

  return (
    <div
      className={`relative flex h-[17rem] w-full flex-col items-center justify-center ${className}`}
    >
      <OrbitingCircles
        radius={86}
        speed={0.85}
        pathStroke="rgba(169, 215, 237, 0.28)"
        pathStrokeWidth={1.15}
        iconSize="clamp(1.28rem, 3.5vw, 1.78rem)"
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
        radius={156}
        reverse
        speed={1.05}
        pathStroke="rgba(169, 215, 237, 0.16)"
        pathStrokeWidth={1}
        iconSize="clamp(1.22rem, 3.15vw, 1.62rem)"
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
    className="size-full object-contain drop-shadow-[0_0_9px_rgba(34,211,238,0.2)] duration-200 hover:scale-[1.04]"
  />
);
