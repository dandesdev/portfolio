import { useLenis } from "lenis/react";
import { SocialMediaNav } from "../components/SocialMediaNav";
import cn from "../utils/cn";
import { useUserPreferences } from "../context/useUserPreferences";
import { ContactButton } from "../components/ContactButton";
import { WaveBackground } from "../components/WaveBackground";

type HeroContent = {
  title: string;
  subtitle: string;
  text: string;
  btnProjects: string;
  btnBlog: string
};

type HeroProps = {
  className?: string;
};

const content: Record<string, HeroContent> = {
  br: {
    title: "Daniel",
    subtitle: "Desenvolvedor Fullstack",
    text: "Oi! Gosto de criar coisas legais, interessantes, desafiadoras e bonitas, seja bem vinde. Aqui você vai encontrar alguns projetos que misturam tecnologia, educação e arte — e um pouco sobre mim.",
    btnProjects: "Vem ver",
    btnBlog: "Blog" 
  },
  en: {
    title: "Daniel",
    subtitle: "Fullstack developer",
    text: "Hi! I like to create cool, interesting, challenging and beautiful stuff, welcome. Here you'll find projects that blend tech, education and some art — and a little about me.",
    btnProjects: "Take a look!",
    btnBlog: "Blog" 
  },
};

export const Hero: React.FC<HeroProps> = ({ className }) => {
  const { lang } = useUserPreferences();

  const currentContent = content[lang] || content.en;

  const lenis = useLenis();

  const handleScrollToProjects = () => {
    const target = document.getElementById("projects");
    if (target) {
      lenis?.scrollTo(target, {
        offset: 0,
      });
    }
  };

  return (
    <section className={cn("h-[90dvh]", className)}>
      <>
        <div className="absolute my-auto p-2 inset-0 sm:inset-[10%] mx-auto flex flex-col items-center max-w-[600px] justify-center h-fit max-h-screen z-10 overflow-show gap-4">
          <div className="flex flex-col px-8 sm:px-0 sm:self-center select-none text-text font-fira">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col">
                <span className="font-bold text-3xl">
                  {currentContent.title}
                </span>
                <span className="font-bold text-xl">
                  {currentContent.subtitle}
                </span>
              </div>
              <div className="flex justify-center sm:justify-end pt-4 sm:pt-0 border-t-2 sm:border-t-0 border-primary/[0.05] gap-4">
                <SocialMediaNav />
              </div>
            </div>
            <span className="flex flex-wrap font-normal my-4 sm:text-justify">
              {currentContent.text}
            </span>
          </div>
          <div className="flex flex-wrap justify-center items-center sm:w-full select-none mt-2 pb-20 gap-4">
            <button
              className="boidsReactBtn flex flex-nowrap px-4 py-2 rounded-sm font-fira font-bold text-lg  
             text-background hover:text-primary 
             bg-primary hover:bg-transparent 
             outline-dashed outline-2 outline-transparent hover:outline-primary 
             shadow-lg cursor-pointer 
             focus:outline-offset-2 focus:outline focus:outline-text 
             group
             transition-all duration-300 ease-in-out"
              aria-label={currentContent.btnProjects}
              onClick={handleScrollToProjects}
            >
              <span className="group-hover:rotate-90 transition-transform duration-300 ease-in-out hidden sm:block">
                {"> "}
              </span>
              <span className="pl-1">{currentContent.btnProjects}</span>
            </button>
            <a 
              href={`https://dandesdev.github.io/journal/${lang}`} target="blank"
              className="flex h-fit flex-nowrap px-5 py-2 rounded-sm font-fira font-bold text-lg  
             text-primary hover:text-background 
             hover:bg-primary bg-transparent 
             outline-dashed outline-2 hover:outline-transparent outline-primary 
             shadow-lg cursor-pointer 
             focus:outline-offset-2 focus:outline focus:outline-text 
             outline-offset-[-2px] opacity-100 hover:opacity-100
             transition-all duration-300 ease-in-out"
              aria-label={currentContent.btnBlog}
            >
                {currentContent.btnBlog}
            </a>
            <ContactButton lang={lang} />
          </div>
        </div>
      </>
      <WaveBackground />
    </section>
  );
};
