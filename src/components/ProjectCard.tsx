import type { Language } from "../context/useUserPreferences";
import type { Project } from "../sections/Projects";
import { ProjectTechs } from "./ProjectTechs";

export const ProjectCard: React.FC<{
  p: Project;
  lang: Language;
  index: number;
}> = ({ p, lang, index }) => {
  const thumbSrc = `${import.meta.env.BASE_URL}project-thumbs/${index + 1}.png`;

  const thumbLink = p.links.page || p.links.github || null;

  return (
    <div
      key={p.title}
      className="rounded-lg w-full border border-neutral/30 bg-background/40 
                 shadow-md p-6 flex flex-col sm:flex-row justify-between 
                 transition-transform duration-300 hover:scale-[1.02] gap-6"
    >
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-2 text-text">{p.title}</h3>
        <p className="text-sm text-text/80 mb-4">{p.description}</p>
        <ProjectTechs techs={p.techs} />

        <div className="flex gap-4 mt-4 flex-wrap">
          {Object.entries(p.links).map(([key, url]) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline text-sm capitalize"
            >
              {lang === "en"
                ? key === "page"
                  ? "Visit Live"
                  : key
                : key === "page"
                ? "Visite"
                : key}
            </a>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 w-full sm:w-48 aspect-video sm:aspect-auto">
        {thumbLink ? (
          <a
            href={thumbLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src={thumbSrc}
              alt={`${p.title} thumbnail`}
              className="w-full h-full object-cover rounded-md shadow hover:opacity-90 transition-opacity"
            />
          </a>
        ) : (
          <img
            src={thumbSrc}
            alt={`${p.title} thumbnail`}
            className="w-full h-full object-cover rounded-md shadow"
          />
        )}
      </div>
    </div>
  );
};
