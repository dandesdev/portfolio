import cn from "../utils/cn";

type TooltipProps = {
  text: string;
  tooltipClassName?: string;
  children: React.ReactNode;
};

export const Tooltip: React.FC<TooltipProps> = ({ 
  text, 
  tooltipClassName, 
  children 
}) => {
  
  return (
    <div className="group relative">
        {children}
      <span className={cn("group-hover:opacity-100 transition-opacity bg-pallete4cA px-1 text-sm text-text bg-background rounded-md absolute left-1/2 -translate-x-1/2 translate-y-1/2 opacity-0 mx-auto pointer-events-none", tooltipClassName)}>
        {text}
      </span>
    </div>
  );
};