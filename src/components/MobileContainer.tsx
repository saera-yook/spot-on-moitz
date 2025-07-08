import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
  withPadding?: boolean;
}

export const MobileContainer = ({ 
  children, 
  className,
  withPadding = true 
}: MobileContainerProps) => {
  return (
    <div 
      className={cn(
        "min-h-screen bg-background max-w-sm mx-auto relative overflow-hidden",
        withPadding && "px-4 py-6",
        className
      )}
    >
      {children}
    </div>
  );
};