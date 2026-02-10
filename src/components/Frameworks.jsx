import { OrbitingCircles } from "./OrbitingCircles";

export function Frameworks() {
  const skills = [
    { name: "auth0", ext: "svg" },
    { name: "aws-svgrepo-com", ext: "svg" },
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
    { name: "kubernetes-svgrepo-com", ext: "svg" },
    { name: "vitejs", ext: "svg" },
  ];

  const reversedSkills = [...skills].reverse();

  return (
    <div className="relative flex h-[15rem] w-full flex-col items-center justify-center">
      <OrbitingCircles iconSize="clamp(1.8rem, 4.5vw, 2.5rem)">
        {skills.map((skill) => (
          <Icon
            key={skill.name}
            src={`assets/logos/${skill.name}.${skill.ext}`}
            alt={skill.name}
          />
        ))}
      </OrbitingCircles>
      <OrbitingCircles
        iconSize="clamp(1.2rem, 3.2vw, 1.6rem)"
        radius={100}
        reverse
        speed={2}
      >
        {reversedSkills.map((skill) => (
          <Icon
            key={`${skill.name}-reverse`}
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
    className="size-full rounded-sm object-contain duration-200 hover:scale-110"
  />
);
