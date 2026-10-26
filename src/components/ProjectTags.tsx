import type { Language } from "../context/useUserPreferences";
import type { ProjectKind, ProjectSize } from "../sections/Projects";
import cn from "../utils/cn";

const kindLabels: Record<ProjectKind, Record<Language, string>> = {
  tool: { en: "tool", br: "ferramenta" },
  data: { en: "data", br: "dados" },
  game: { en: "game", br: "jogo" },
  simulation: { en: "simulation", br: "simulação" },
};

const sizeLabels: Record<ProjectSize, Record<Language, string>> = {
  small: { en: "small", br: "pequeno" },
  medium: { en: "medium", br: "médio" },
  large: { en: "large", br: "grande" },
};

const sizeSteps: Record<ProjectSize, number> = { small: 1, medium: 2, large: 3 };

const wipLabel: Record<Language, string> = {
  en: "work in progress",
  br: "em andamento",
};

const tagBase = "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-xs";

export const ProjectTags: React.FC<{
  kind: ProjectKind;
  size: ProjectSize;
  wip?: boolean;
  lang: Language;
}> = ({ kind, size, wip, lang }) => {
  const steps = sizeSteps[size];

  return (
    <ul className="flex flex-wrap gap-2 mb-3" aria-label={lang === "en" ? "Tags" : "Etiquetas"}>
      <li className={cn(tagBase, "text-primary outline outline-1 outline-primary/60")}>
        {kindLabels[kind][lang]}
      </li>
      <li className={cn(tagBase, "text-text/70 outline outline-1 outline-text/30")}>
        <span className="flex items-end gap-0.5" aria-hidden="true">
          {[1, 2, 3].map((step) => (
            <span
              key={step}
              className={cn(
                "w-1 rounded-[1px]",
                step === 1 ? "h-1.5" : step === 2 ? "h-2" : "h-2.5",
                step <= steps ? "bg-text/70" : "bg-text/20"
              )}
            />
          ))}
        </span>
        {sizeLabels[size][lang]}
      </li>
      {wip ? (
        <li className={cn(tagBase, "text-secondary outline-dashed outline-1 outline-secondary")}>
          {wipLabel[lang]}
        </li>
      ) : null}
    </ul>
  );
};
