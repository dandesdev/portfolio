
import { useState } from "react";
import { Tooltip } from "./Tooltip";
import { useUserPreferences } from "../context/useUserPreferences";
import cn from "../utils/cn";

type ProjectTechsProps = {
  techs: string[];
};

// Special logo overrides (per tech name)
const logoOverrides: Record<string, string> = {
  "Next": "invert",
};

export const ProjectTechs: React.FC<ProjectTechsProps> = ({ techs }) => {

  return (
    <div className="w-fit flex flex-row flex-wrap gap-4 self-center">
      {techs.map((tech, i) => (
        <TechLogo tech={tech} key={tech + i} />
      ))}
    </div>
  );
};

const TechLogo: React.FC<{ tech: string }> = ({ tech }) => {
  const [error, setError] = useState(false);

  const {theme} = useUserPreferences();
  const specialLogoOverrideClass =
    theme === "light" ? logoOverrides[tech] ?? "" : "";

  const fileName = tech.replace(/\s+/g, "");
  const base = import.meta.env.BASE_URL;
  const src = `${base}/tech-logos/${fileName}.png`;

  return (
    <Tooltip text={tech}>
      {!error ? (
        <img
          src={src}
          alt={tech}
          className={cn("w-6 aspect-square object-contain", specialLogoOverrideClass)}
          onError={() => setError(true)}
        />
      ) : (
        <span className="text-xs font-fira text-neutral">{tech}</span>
      )}
    </Tooltip>
  );
};