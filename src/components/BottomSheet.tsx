import { ReactNode, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  children: ReactNode;
  title?: string;
  defaultExpanded?: boolean;
  collapsedHeight?: string;
}

export const BottomSheet = ({ 
  children, 
  title,
  defaultExpanded = false,
  collapsedHeight = "8rem"
}: BottomSheetProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-strong z-40",
        "max-w-sm mx-auto rounded-t-xl transition-all duration-300 ease-out"
      )}
      style={{
        height: isExpanded ? "60vh" : collapsedHeight,
      }}
    >
      {/* 헤더 영역 */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer border-b border-border/50"
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
      
      {/* 콘텐츠 영역 - 항상 렌더링되지만 스크롤 가능 */}
      <div 
        className={cn(
          "overflow-y-auto transition-all duration-300",
          "h-full pb-4"
        )}
        style={{
          height: `calc(100% - 4rem)`, // 헤더 높이 제외
        }}
      >
        {children}
      </div>
    </div>
  );
};