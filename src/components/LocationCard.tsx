import { MapPin, Clock, Star, Check } from "lucide-react";
import { Pin, PinOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LocationCardProps {
  name: string;
  category: string;
  address: string;
  travelTime: number;
  rating: number;
  imageUrl?: string;
  isSelected?: boolean;
  isPinned?: boolean;
  onSelect?: () => void;
  onPin?: () => void;
  showPinButton?: boolean;
}

export const LocationCard = ({ 
  name, 
  category, 
  address, 
  travelTime, 
  rating,
  imageUrl,
  isSelected = false,
  isPinned = false,
  onSelect,
  onPin,
  showPinButton = false
}: LocationCardProps) => {
  const defaultImageUrl = "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=200&fit=crop";
  const displayImageUrl = imageUrl || defaultImageUrl;

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 border-2 overflow-hidden",
        isPinned 
          ? "border-warning bg-warning/5 shadow-medium" 
          : isSelected 
            ? "border-primary bg-primary/5 shadow-elegant" 
            : "border-border hover:border-primary/50 hover:shadow-soft"
      )}
      onClick={onSelect}
    >
      <div className="flex gap-3 p-4">
        {/* 이미지 */}
        <div className="flex-shrink-0">
          <img 
            src={displayImageUrl} 
            alt={name}
            className="w-20 h-20 rounded-lg object-cover"
            onError={(e) => {
              e.currentTarget.src = defaultImageUrl;
            }}
          />
        </div>
        
        {/* 콘텐츠 */}
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">{name}</h3>
                {isPinned && <Pin className="w-4 h-4 text-warning flex-shrink-0" />}
                {isSelected && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
              </div>
              <p className="text-sm text-muted-foreground">{category}</p>
            </div>
            <div className="flex items-center gap-1 text-sm flex-shrink-0 ml-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{rating}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span>평균 {travelTime}분 소요</span>
            </div>
          </div>
          
          {showPinButton && (
            <div className="flex justify-end mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onPin?.();
                }}
                className={cn(
                  "h-8 px-3 text-xs",
                  isPinned 
                    ? "text-warning hover:text-warning/80" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isPinned ? (
                  <>
                    <PinOff className="w-3 h-3 mr-1" />
                    고정 해제
                  </>
                ) : (
                  <>
                    <Pin className="w-3 h-3 mr-1" />
                    고정하기
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};