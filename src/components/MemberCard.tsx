import { X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MemberCardProps {
  nickname: string;
  location: string;
  onRemove: () => void;
}

export const MemberCard = ({ nickname, location, onRemove }: MemberCardProps) => {
  return (
    <Card className="p-4 bg-card border border-border shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">{nickname}</p>
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};