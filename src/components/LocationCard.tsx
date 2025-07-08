import { MapPin, Clock, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface LocationCardProps {
  name: string;
  category: string;
  address: string;
  travelTime: number;
  rating: number;
  imageUrl?: string;
  isSelected?: boolean;
  onSelect?: () => void;
  onToggleFavorite?: () => void;
}

export const LocationCard = ({ 
  name, 
  category, 
  address, 
  travelTime, 
  rating,
  imageUrl,
  isSelected = false,
  onSelect,
  onToggleFavorite
}: LocationCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
    onToggleFavorite?.();
  };

  return (
    <Card 
      className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-medium ${
        isSelected ? 'ring-2 ring-primary bg-accent' : 'bg-card'
      }`}
      onClick={onSelect}
    >
      <div className="flex gap-3">
        {imageUrl && (
          <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
            <img 
              src={imageUrl} 
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-foreground truncate">{name}</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleFavoriteClick();
              }}
              className="h-8 w-8 flex-shrink-0"
            >
              <Heart 
                className={`w-4 h-4 ${
                  isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                }`} 
              />
            </Button>
          </div>
          
          <Badge variant="secondary" className="mb-2">
            {category}
          </Badge>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{travelTime}분</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="flex items-start gap-1">
            <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-xs text-muted-foreground leading-tight">{address}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};