import type { Language } from "../context/useUserPreferences";
import type { ProjectArch, ProjectKind } from "../sections/Projects";
import cn from "../utils/cn";

const kindLabels: Record<ProjectKind, Record<Language, string>> = {
  tool: { en: "tool", br: "ferramenta" },
  data: { en: "data", br: "dados" },
  game: { en: "game", br: "jogo" },
  simulation: { en: "simulation", br: "simulação" },
  toy: { en: "toy", br: "brinquedo" },
};

const archLabels: Record<ProjectArch, Record<Language, string>> = {
  client: { en: "runs entirely in your browser", br: "tudo no seu navegador" },
  data: { en: "uses external data", br: "consumo de dados externos" },
  fullstack: { en: "full stack", br: "full stack" },
};

// Lucide icons: app-window, cloud-download, layers.
const archIcons: Record<ProjectArch, React.ReactNode> = {
  client: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M10 4v4" />
      <path d="M2 8h20" />
      <path d="M6 4v4" />
    </>
  ),
  data: (
    <>
      <path d="M12 13v8" />
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="m8 17 4 4 4-4" />
    </>
  ),
  fullstack: (
    <>
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
      <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
      <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
    </>
  ),
};

const wipLabel: Record<Language, string> = {
  en: "work in progress",
  br: "em andamento",
};

const tagBase = "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-xs";

export const ProjectTags: React.FC<{
  kind: ProjectKind;
  arch: ProjectArch;
  wip?: boolean;
  lang: Language;
}> = ({ kind, arch, wip, lang }) => {
  const archLabel = archLabels[arch][lang];

  return (
    <ul className="flex flex-wrap gap-2 mb-3" aria-label={lang === "en" ? "Tags" : "Etiquetas"}>
      <li className={cn(tagBase, "text-primary outline outline-1 outline-primary/60")}>
        {kindLabels[kind][lang]}
      </li>
      {/* Focusable so the tooltip also opens on tap, where there is no hover. */}
      <li
        tabIndex={0}
        aria-label={archLabel}
        className={cn(
          tagBase,
          "relative group text-text/70 outline outline-1 outline-text/30 cursor-help focus-visible:outline-2 focus-visible:outline-primary"
        )}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {archIcons[arch]}
        </svg>
        <span
          role="tooltip"
          className="absolute bottom-full left-0 mb-2 px-2 py-1 rounded-sm whitespace-nowrap
                     bg-text text-background text-xs shadow pointer-events-none z-10
                     opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity"
        >
          {archLabel}
        </span>
      </li>
      {wip ? (
        <li className={cn(tagBase, "text-secondary outline-dashed outline-1 outline-secondary")}>
          {wipLabel[lang]}
        </li>
      ) : null}
    </ul>
  );
};
