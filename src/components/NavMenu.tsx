import { useState } from "react";
import { useUserPreferences } from "../context/useUserPreferences";
import { ThemeToggle } from "./ThemeToggle";
import { useLenis } from "lenis/react";

export const NavMenu: React.FC = () => {
  const lenis = useLenis();
  const { lang, setLang, prefersReducedMotion } = useUserPreferences();
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Track scroll position to show/hide back-to-top button
  useLenis(({ scroll }) => {
    setShowBackToTop(scroll > 100);
  });

  const toggleLang = () => {
    setLang(lang === "br" ? "en" : "br");
  };

  const scrollToTop = () => {
    if (prefersReducedMotion) {
      window.scrollTo({ top: 0, behavior: "auto" });
    } else {
      lenis?.scrollTo(0, { duration: 1.2 });
    }
  };

  return (
    <nav className="fixed left-1 top-0 flex font-fira gap-2 z-[999] text-text">
      <ThemeToggle />
      <button
        onClick={toggleLang}
        title={lang === "br" ? "Switch to English" : "Mudar para Português"}
        aria-label={lang === "br" ? "Switch to English" : "Mudar para Português"}
        className="px-2 py-1 rounded-md backdrop-blur-sm text-text/60 hover:text-text/100 cursor-pointer"
      >
        <span className={lang === "br" ? "opacity-90" : "opacity-30"}>BR</span>
        <span className="px-1">|</span>
        <span className={lang === "en" ? "opacity-90" : "opacity-30"}>EN</span>
      </button>
      <button
        onClick={scrollToTop}
        title={lang === "br" ? "Voltar ao topo" : "Scroll to top"}
        aria-label={lang === "br" ? "Voltar ao topo" : "Scroll to top"}
        className={`px-2 py-1 rounded-md backdrop-blur-sm text-text/60 hover:text-text/100 cursor-pointer transition-opacity duration-300 ${
          showBackToTop ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        ↑
      </button>
    </nav>
  );
};