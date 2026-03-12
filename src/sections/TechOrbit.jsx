import { useLayoutEffect, useMemo, useRef, useState } from "react";
import ShineBorder from "../components/ShineBorder";

const talentNodes = [
  {
    id: "root",
    title: "Diff's Talent Tree",
    tier: "Root Node",
    subtitle: "Start here and unlock each branch",
    skills: [],
    className: "talent-pos-root",
  },
  {
    id: "languages",
    title: "Languages",
    tier: "Layer 1",
    skills: [
      { name: "C++", logo: "/assets/logos/cplusplus.svg", short: "C++" },
      { name: "Java", logo: "/assets/logos/java.png", short: "Java" },
      { name: "Python", logo: "/assets/logos/python.png", short: "Py" },
      { name: "JavaScript", logo: "/assets/logos/javascript.svg", short: "JS" },
      { name: "TypeScript", logo: "/assets/logos/icons8-typescript.svg", short: "TS" },
      { name: "C#", logo: "/assets/logos/csharp.svg", short: "C#" },
    ],
    className: "talent-pos-languages",
  },
  {
    id: "frontend",
    title: "Front-end",
    tier: "Layer 2",
    skills: [
      { name: "React", logo: "/assets/logos/react.svg", short: "React" },
      { name: "Vue", logo: "/assets/logos/icons8-vue-js.svg", short: "Vue" },
      { name: "Next.js", logo: "/assets/logos/icons8-nextjs.svg", short: "Next" },
      { name: "Tailwind CSS", logo: "/assets/logos/tailwindcss.svg", short: "TW" },
      { name: "Nuxt 3", logo: "/assets/logos/icons8-nuxt-js.svg", short: "Nuxt" },
    ],
    className: "talent-pos-frontend",
  },
  {
    id: "backend",
    title: "Back-end",
    tier: "Layer 2",
    skills: [
      { name: "Spring Boot", logo: "/assets/logos/springboot.png", short: "Spring" },
      { name: "NestJS", logo: "/assets/logos/icons8-nestjs.svg", short: "Nest" },
      { name: "Node.js", logo: "/assets/logos/icons8-nodejs-50.svg", short: "Node" },
      { name: "PHP", logo: "/assets/logos/icons8-php-48.png", short: "PHP" },
      { name: "Django", logo: "/assets/logos/django.png", short: "Django" },
      { name: "Flask", logo: "/assets/logos/python.png", short: "Flask" },
    ],
    className: "talent-pos-backend",
  },
  {
    id: "databases",
    title: "Databases",
    tier: "Layer 3",
    skills: [
      { name: "Firebase", logo: "/assets/logos/icons8-firebase.svg", short: "FB" },
      { name: "PostgreSQL", logo: "/assets/logos/postgre.png", short: "PG" },
      { name: "MySQL", logo: "/assets/logos/mysql.png", short: "MySQL" },
      { name: "MongoDB", logo: "/assets/logos/icons8-mongo-db-32.png", short: "MDB" },
      { name: "Prisma", logo: "/assets/logos/icons8-prisma-orm-50.svg", short: "Prisma" },
      { name: "Drizzle ORM", logo: "/assets/logos/drizzle.svg", short: "Drizzle" },
    ],
    className: "talent-pos-databases",
  },
  {
    id: "tools",
    title: "Tools",
    tier: "Layer 3",
    skills: [
      { name: "Docker", logo: "/assets/logos/icons8-docker.svg", short: "Docker" },
      { name: "DBeaver", logo: "/assets/logos/icons8-dbeaver-64.png", short: "DB" },
      { name: "Postman", logo: "/assets/logos/icons8-postman-api-48.png", short: "Postman" },
      { name: "Git", logo: "/assets/logos/git.svg", short: "Git" },
      { name: "GitHub", logo: "/assets/logos/github.svg", short: "GH" },
      { name: "TurboRepo", logo: "/assets/logos/turbo repo.png", short: "Turbo" },
      { name: "Stripe", logo: "/assets/logos/stripe.svg", short: "Stripe" },
    ],
    className: "talent-pos-tools",
  },
  {
    id: "exploring",
    title: "Exploring",
    tier: "Passive Talent",
    skills: [
      { name: "AWS", logo: "/assets/logos/aws-svgrepo-com.svg", short: "AWS" },
      {
        name: "Kubernetes",
        logo: "/assets/logos/kubernetes-svgrepo-com.svg",
        short: "K8s",
      },
      { name: "Auth0", logo: "/assets/logos/auth0.svg", short: "Auth0" },
      { name: "Three.js", logo: "/assets/logos/threejs.svg", short: "3JS" },
      { name: "OpenAI API", logo: "", short: "AI" },
    ],
    className: "talent-pos-exploring",
    sideQuest: true,
  },
];

const treeEdges = [
  { from: "root", to: "languages" },
  { from: "languages", to: "frontend" },
  { from: "languages", to: "backend" },
  { from: "frontend", to: "databases" },
  { from: "backend", to: "databases" },
  { from: "backend", to: "tools" },
  {
    from: "languages",
    to: "exploring",
    variant: "sidequest",
    fromAnchor: "right",
    toAnchor: "left",
  },
];

const SkillPill = ({ skill }) => {
  const [broken, setBroken] = useState(false);
  const needsLightBadge = skill.name === "MySQL" || skill.name === "PostgreSQL";

  return (
    <span className="talent-skill-pill inline-flex items-center gap-2 rounded-full border border-white/18 bg-primary/60 px-3 py-1.5 text-xs text-neutral-200">
      {skill.logo && !broken ? (
        <img
          src={skill.logo}
          alt={skill.name}
          className={`talent-skill-icon ${needsLightBadge ? "talent-skill-icon--light" : ""}`}
          onError={() => setBroken(true)}
        />
      ) : (
        <span className="talent-skill-fallback inline-grid place-items-center rounded-full border border-white/25 text-[8px] text-neutral-100">
          {skill.short}
        </span>
      )}
      {skill.name}
    </span>
  );
};

const getBezierPath = (fromPoint, toPoint, variant) => {
  if (variant === "sidequest") {
    const curve = Math.max(70, Math.abs(toPoint.x - fromPoint.x) * 0.4);
    return [
      `M ${fromPoint.x} ${fromPoint.y}`,
      `C ${fromPoint.x + curve} ${fromPoint.y}, ${toPoint.x - curve} ${toPoint.y}, ${toPoint.x} ${toPoint.y}`,
    ].join(" ");
  }

  const depth = Math.max(48, Math.abs(toPoint.y - fromPoint.y) * 0.45);
  return [
    `M ${fromPoint.x} ${fromPoint.y}`,
    `C ${fromPoint.x} ${fromPoint.y + depth}, ${toPoint.x} ${toPoint.y - depth}, ${toPoint.x} ${toPoint.y}`,
  ].join(" ");
};

const TechOrbit = () => {
  const boardRef = useRef(null);
  const nodeRefs = useRef({});
  const [layout, setLayout] = useState(null);
  const [activeNode, setActiveNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});

  const nodeById = useMemo(
    () => Object.fromEntries(talentNodes.map((node) => [node.id, node])),
    []
  );

  const setNodeRef = (id) => (element) => {
    if (element) {
      nodeRefs.current[id] = element;
      return;
    }
    delete nodeRefs.current[id];
  };

  useLayoutEffect(() => {
    const boardElement = boardRef.current;
    if (!boardElement) return undefined;

    const calculateLayout = () => {
      if (window.innerWidth < 1280) {
        setLayout(null);
        return;
      }

      const boardRect = boardElement.getBoundingClientRect();
      const nodes = {};

      talentNodes.forEach((node) => {
        const element = nodeRefs.current[node.id];
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2 - boardRect.left;
        const centerY = rect.top + rect.height / 2 - boardRect.top;

        nodes[node.id] = {
          top: { x: centerX, y: rect.top - boardRect.top - 1.5 },
          bottom: { x: centerX, y: rect.bottom - boardRect.top + 1.5 },
          left: { x: rect.left - boardRect.left - 1.5, y: centerY },
          right: { x: rect.right - boardRect.left + 1.5, y: centerY },
        };
      });

      if (Object.keys(nodes).length !== talentNodes.length) return;

      setLayout({ width: boardRect.width, height: boardRect.height, nodes });
    };

    calculateLayout();

    const resizeObserver = new ResizeObserver(calculateLayout);
    resizeObserver.observe(boardElement);
    Object.values(nodeRefs.current).forEach((node) => resizeObserver.observe(node));
    window.addEventListener("resize", calculateLayout);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", calculateLayout);
    };
  }, []);

  const activeEdgeSet = useMemo(() => {
    const edgeKeys = {
      root: ["root-languages"],
      languages: ["root-languages"],
      frontend: ["root-languages", "languages-frontend"],
      backend: ["root-languages", "languages-backend"],
      databases: [
        "root-languages",
        "languages-frontend",
        "languages-backend",
        "frontend-databases",
        "backend-databases",
      ],
      tools: ["root-languages", "languages-backend", "backend-tools"],
      exploring: ["root-languages", "languages-exploring"],
    };

    return new Set(edgeKeys[activeNode] || []);
  }, [activeNode]);

  const toggleNodeExpand = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const renderNodeSkills = (nodeId, limit = 4) => {
    const node = nodeById[nodeId];
    if (!node || node.skills.length === 0) return null;

    const isExpanded = Boolean(expandedNodes[nodeId]);
    const visibleSkills = isExpanded ? node.skills : node.skills.slice(0, limit);
    const hiddenCount = Math.max(node.skills.length - limit, 0);

    return (
      <>
        <div className="talent-card__skills">
          {visibleSkills.map((skill) => (
            <SkillPill key={`${nodeId}-${skill.name}`} skill={skill} />
          ))}
        </div>

        {hiddenCount > 0 && (
          <button
            type="button"
            className="quest-node__toggle"
            onClick={() => toggleNodeExpand(nodeId)}
          >
            {isExpanded ? "Show less" : `+${hiddenCount} more`}
          </button>
        )}
      </>
    );
  };

  return (
    <section id="tech" className="c-space mt-16 md:mt-20">
      <h2 className="text-heading">Tech Stack Talent Tree</h2>
      <p className="mt-3 max-w-3xl text-sm text-neutral-300 md:text-base">
        Welcome to my RPG-style Tech Stack Talent Tree.
      </p>

      <div className="group relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-midnight/90 to-primary/90 p-5 sm:p-6 md:p-8">
        <ShineBorder
          borderWidth={1}
          duration={10}
          shineColor={["#ffffff", "#bdbdbd", "#ffffff"]}
          className="rounded-3xl"
        />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.12),transparent_44%)]" />

        <div className="quest-mobile relative z-10 xl:hidden">
          <div className="quest-mobile__rail" aria-hidden="true" />

          <article className="quest-node quest-node--root">
            <span className="quest-node__dot" aria-hidden="true" />
            <p className="quest-node__tier">Root</p>
            <h3 className="quest-node__title">{nodeById.root.title}</h3>
            <p className="quest-node__sub">{nodeById.root.subtitle}</p>
          </article>

          <article className="quest-node">
            <span className="quest-node__dot" aria-hidden="true" />
            <p className="quest-node__tier">Layer 1</p>
            <h3 className="quest-node__title">{nodeById.languages.title}</h3>
            {renderNodeSkills("languages")}
          </article>

          <div className="quest-fork" aria-hidden="true">
            <span className="quest-fork__line" />
            <span className="quest-fork__label">Branch Route</span>
            <span className="quest-fork__line" />
          </div>

          <div className="quest-branch-grid">
            <article className="quest-branch-card">
              <p className="quest-node__tier">Layer 2</p>
              <h3 className="quest-node__title">{nodeById.frontend.title}</h3>
              {renderNodeSkills("frontend")}
            </article>

            <article className="quest-branch-card">
              <p className="quest-node__tier">Layer 2</p>
              <h3 className="quest-node__title">{nodeById.backend.title}</h3>
              {renderNodeSkills("backend")}
            </article>
          </div>

          <article className="quest-node">
            <span className="quest-node__dot" aria-hidden="true" />
            <p className="quest-node__tier">Layer 3</p>
            <h3 className="quest-node__title">{nodeById.databases.title}</h3>
            {renderNodeSkills("databases")}
          </article>

          <div className="quest-sidequest-block">
            <p className="quest-sidequest__title">Side Quests</p>

            <div className="quest-sidequest__grid">
              <article className="quest-branch-card quest-branch-card--sidequest">
                <h3 className="quest-node__title">{nodeById.tools.title}</h3>
                {renderNodeSkills("tools", 5)}
              </article>

              <article className="quest-branch-card quest-branch-card--sidequest">
                <h3 className="quest-node__title">{nodeById.exploring.title}</h3>
                {renderNodeSkills("exploring")}
              </article>
            </div>
          </div>
        </div>

        <div
          ref={boardRef}
          className="talent-tree-board relative z-10 hidden xl:block"
          onMouseLeave={() => setActiveNode(null)}
        >
          {layout && (
            <svg
              className="talent-tree-lines hidden xl:block"
              viewBox={`0 0 ${layout.width} ${layout.height}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {treeEdges.map((edge) => {
                const fromNode = layout.nodes[edge.from];
                const toNode = layout.nodes[edge.to];
                if (!fromNode || !toNode) return null;

                const fromPoint = fromNode[edge.fromAnchor || "bottom"];
                const toPoint = toNode[edge.toAnchor || "top"];
                const key = `${edge.from}-${edge.to}`;
                const isActive = activeEdgeSet.has(key);

                return (
                  <path
                    key={key}
                    className={`talent-tree-path ${
                      edge.variant === "sidequest" ? "talent-tree-path--sidequest" : ""
                    } ${isActive ? "talent-tree-path--active" : ""}`}
                    d={getBezierPath(fromPoint, toPoint, edge.variant)}
                  />
                );
              })}

            </svg>
          )}

          <div className="talent-tree-layout">
            {talentNodes.map((node) => {
              const isActive = activeNode === node.id;

              return (
                <article
                  ref={setNodeRef(node.id)}
                  key={node.id}
                  className={`talent-card ${node.className} ${
                    node.id === "root" ? "talent-card--root" : ""
                  } ${node.sideQuest ? "talent-card--sidequest" : ""} ${
                    isActive ? "talent-card--active" : ""
                  }`}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onFocusCapture={() => setActiveNode(node.id)}
                >
                  <span
                    className={`talent-card__socket ${
                      node.id === "root" ? "talent-card__socket--bottom" : ""
                    }`}
                    aria-hidden="true"
                  />

                  <div className="talent-card__header">
                    <h3 className="talent-card__title">{node.title}</h3>
                  </div>

                  {node.subtitle && <p className="talent-card__sub">{node.subtitle}</p>}

                  {node.skills.length > 0 && (
                    <div className="talent-card__skills">
                      {node.skills.map((skill) => (
                        <SkillPill key={`${node.id}-${skill.name}`} skill={skill} />
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <p className="talent-tree-hint">
            Hover a talent node to highlight progression path.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TechOrbit;
