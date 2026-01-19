import { useState } from "react";
import {
  useUserPreferences,
  type Language,
} from "../context/useUserPreferences";
import cn from "../utils/cn";

const buttonText = {
  br: ["Contato!", "Copiado!"],
  en: ["Contact Me!", "Copied!"],
};

export const ContactButton: React.FC<{
  lang: Language;
  className?: string;
  show?: boolean;
}> = ({ lang, className, show }) => {
  const [copied, setCopied] = useState(false);
  const { prefersReducedMotion } = useUserPreferences();
  const email = "daniel.rangel.guedes@gmail.com";

  const handleClick = () => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // On mobile → open mail app
      window.location.href = `mailto:${email}`;
    } else {
      // On desktop → copy to clipboard
      navigator.clipboard.writeText(email).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="cursor-pointer group"
      aria-label="Contact by Email"
    >
      {prefersReducedMotion ? (
        <div className="relative flex-col group">
          <span
            className={cn(
              "relative min-h-11 min-w-[9rem] boidsReactBtn overflow-hidden flex flex-nowrap px-4 py-2 rounded-sm font-fira font-bold text-lg text-accent hover:text-background  hover:bg-accent bg-transparent  outline-dashed outline-2 hover:outline-transparent outline-accent outline-offset-[-2px] opacity-50 hover:opacity-100 focus:opacity-100 shadow-lg focus:outline-offset-2 focus:outline focus:outline-accent focus:bg-accent focus:text-background",
              className
            )}
          >
            {copied ? buttonText[lang][1] : buttonText[lang][0]}
          </span>
          <p className="text-neutral text-sm pt-2 transition-all duration-150 group-hover:text-accent group-hover:underline">
            {show ? "daniel.rangel.guedes@gmail.com" : null}
          </p>
        </div>
      ) : (
        <div className="relative flex-col">
          <div
            className={cn(
              "relative min-h-11 min-w-[9rem] boidsReactBtn overflow-hidden flex flex-nowrap px-4 py-2 rounded-sm font-fira font-bold text-lg text-accent group-hover:text-background  group-hover:bg-accent bg-transparent  outline-dashed outline-2 group-hover:outline-transparent outline-accent outline-offset-[-2px] opacity-100 group-hover:opacity-100 focus:opacity-100 shadow-lg focus:outline-offset-2 focus:outline focus:outline-accent focus:bg-accent focus:text-background transition-all duration-300 ease-in-out",
              className
            )}
          >
            <span
              className={`absolute inset-2 transition-transform duration-200 ${
                copied ? "-translate-y-[150%]" : "translate-y-0"
              }`}
            >
              {buttonText[lang][0]}
            </span>
            <span
              className={`absolute inset-2 flex items-center gap-1 transition-transform duration-200 ${
                copied ? "translate-y-0" : "translate-y-[150%]"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {buttonText[lang][1]}
            </span>
          </div>
          <p className="relative translate-y-1 text-neutral text-sm transition-all duration-300 ease-in-out group-hover:text-accent group-hover:underline">
            {show ? "daniel.rangel.guedes@gmail.com" : null}
          </p>
        </div>
      )}
    </button>
  );
};
