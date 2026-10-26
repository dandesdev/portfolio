import { useRef } from "react";
import { useUserPreferences } from "../context/useUserPreferences";
import cn from "../utils/cn";
import projectsEn from "./projects_content/projects.en.json";
import projectsBr from "./projects_content/projects.br.json";
import { ProjectCard } from "../components/ProjectCard";
import { useScrollBlur } from "../hooks/useScrollBlur";

type ProjectProps = {
  className?: string;
};

export type ProjectKind = "tool" | "data" | "game" | "simulation";
export type ProjectArch = "client" | "data" | "fullstack";

export type Project = {
  id: string;
  title: string;
  description: string;
  kind: ProjectKind;
  arch: ProjectArch;
  wip?: boolean;
  techs: string[];
  links: Record<string, string>;
};

export const Projects: React.FC<ProjectProps> = ({ className }) => {
  const { lang } = useUserPreferences();
  const projects = (lang === "en" ? projectsEn : projectsBr) as Project[];
  const titleRef = useRef<HTMLHeadingElement>(null);

  useScrollBlur(titleRef);

  return (
    <section
      id="projects"
      className={cn(
        "min-h-[100dvh] bg-background flex flex-col justify-center place-items-center py-16 px-8 font-fira",
        className
      )}
    >
      <div className="md:max-w-[800px]">
        <h2 
          ref={titleRef}
          className="text-4xl text-primary font-bold text-center pb-10 origin-center will-change-[filter,text-shadow]"
        >
          {lang === "en" ? "Projects" : "Projetos"}
        </h2>

        <div className="flex flex-col justify-center place-items-center gap-4">
          {projects.map((p) => (<ProjectCard p={p} lang={lang} key={p.id} />))}
        </div>
      </div>
    </section>
  );
};
