import { useUserPreferences } from "../context/useUserPreferences";
import cn from "../utils/cn";
import projectsEn from "./projects_content/projects.en.json";
import projectsBr from "./projects_content/projects.br.json";
import { ProjectCard } from "../components/ProjectCard";

type ProjectProps = {
  className?: string;
};

type Project = {
  title: string;
  description: string;
  techs: string[];
  links: Record<string, string>;
};

export const Projects: React.FC<ProjectProps> = ({ className }) => {
  const { lang } = useUserPreferences();
  const projects: Project[] = lang === "en" ? projectsEn : projectsBr;

  return (
    <section
      id="projects"
      className={cn(
        "min-h-[100dvh] bg-backrgound flex flex-col justify-center place-items-center py-16 px-8 font-fira",
        className
      )}
    >
      <div className="md:max-w-[800px]">
        <h2 className="text-4xl text-primary font-bold text-center pb-10">
          {lang === "en" ? "Projects" : "Projetos"}
        </h2>

        <div className="flex flex-col justify-center place-items-center gap-4">
          {projects.map((p, index) => (<ProjectCard p={p} lang={lang} key={`project-card-${p.title}`} index={index}/>))}
        </div>
      </div>
    </section>
  );
};
