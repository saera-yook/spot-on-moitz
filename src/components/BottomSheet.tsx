import { ReactNode, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  children: ReactNode;
  title?: string;
  defaultExpanded?: boolean;
}

export const BottomSheet = ({ 
  children, 
  title,
  defaultExpanded = false 
}: BottomSheetProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-strong transition-transform duration-300 z-40",
      "max-w-sm mx-auto rounded-t-xl",
      isExpanded ? "translate-y-0" : "translate-y-[calc(100%-4rem)]"
    )}>
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {title && (
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        )}
        <div className="flex items-center gap-2">
          {!title && (
            <div className="w-8 h-1 bg-muted rounded-full" />
          )}
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </div>
      
      <div className={cn(
        "max-h-[60vh] overflow-y-auto",
        isExpanded ? "block" : "hidden"
      )}>
        {children}
      </div>
    </div>
  );
};