import Project from "../components/Project";
import { myProjects } from "../constants";

const Projects = () => {
  const featuredProjects = myProjects.filter((project) => project.featured).slice(0, 2);
  const standardProjects = myProjects.filter((project) => !project.featured);

  return (
    <section id="projects" className="relative c-space section-spacing">
      <div className="space-y-3">
        <h2 className="text-heading">Featured Projects</h2>
        <p className="max-w-3xl text-sm text-neutral-300 md:text-base">
          High-impact builds that highlight backend ownership, fullstack system
          design, and production-ready implementation.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {featuredProjects.map((project) => (
          <Project key={project.id} {...project} variant="featured" />
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {standardProjects.map((project) => (
          <Project key={project.id} {...project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
