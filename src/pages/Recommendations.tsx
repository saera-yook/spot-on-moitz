import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RotateCcw, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileContainer } from "@/components/MobileContainer";
import { Header } from "@/components/Header";
import { BottomSheet } from "@/components/BottomSheet";
import { LocationCard } from "@/components/LocationCard";
import { toast } from "sonner";

interface Member {
  id: string;
  nickname: string;
  location: string;
}

interface Recommendation {
  id: string;
  name: string;
  category: string;
  address: string;
  travelTime: number;
  rating: number;
  imageUrl?: string;
  latitude: number;
  longitude: number;
}

export const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { members = [], purpose = "" }: { members: Member[]; purpose: string } = location.state || {};
  
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 더미 추천 장소 데이터
  const generateRecommendations = (): Recommendation[] => {
    const dummyRecommendations = [
        {
          id: "1",
          name: "스타벅스 강남점",
          category: "카페",
          address: "서울특별시 강남구 강남대로 390",
          travelTime: 15,
          rating: 4.2,
          imageUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=200&fit=crop",
          latitude: 37.5665,
          longitude: 126.9780
        },
        {
          id: "2", 
          name: "투썸플레이스 홍대점",
          category: "카페",
          address: "서울특별시 마포구 양화로 160",
          travelTime: 18,
          rating: 4.1,
          imageUrl: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400&h=200&fit=crop",
          latitude: 37.5563,
          longitude: 126.9241
        },
        {
          id: "3",
          name: "CGV 강남점",
          category: "영화관",
          address: "서울특별시 강남구 강남대로 438",
          travelTime: 20,
          rating: 4.3,
          imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=200&fit=crop",
          latitude: 37.5665,
          longitude: 126.9780
        }
    ];
    
    return dummyRecommendations;
  };

  useEffect(() => {
    if (members.length === 0) {
      navigate("/");
      return;
    }

    // 추천 장소 생성 시뮬레이션
    setTimeout(() => {
      const newRecommendations = generateRecommendations();
      setRecommendations(newRecommendations);
      setLoading(false);
      toast.success("추천 장소를 찾았습니다!");
    }, 2000);
  }, [members, navigate]);

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocations(prev => {
      if (prev.includes(locationId)) {
        return prev.filter(id => id !== locationId);
      } else {
        return [...prev, locationId];
      }
    });
  };

  const handleRecommendAgain = () => {
    setLoading(true);
    setTimeout(() => {
      const newRecommendations = generateRecommendations().map(rec => ({
        ...rec,
        id: rec.id + "_new",
        travelTime: rec.travelTime + Math.floor(Math.random() * 10) - 5
      }));
      setRecommendations(newRecommendations);
      setLoading(false);
      toast.success("새로운 장소를 추천했습니다!");
    }, 1500);
  };

  const goToVoting = () => {
    if (selectedLocations.length === 0) {
      toast.error("투표할 장소를 선택해주세요");
      return;
    }
    
    const selectedRecommendations = recommendations.filter(rec => 
      selectedLocations.includes(rec.id)
    );
    
    navigate("/voting", { 
      state: { 
        members, 
        recommendations: selectedRecommendations 
      } 
    });
  };

  if (loading) {
    return (
      <MobileContainer>
        <Header title="장소 추천" showBack />
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <div className="animate-bounce-gentle">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-foreground">
              최적의 장소를 찾고 있어요
            </p>
            <p className="text-sm text-muted-foreground">
              모든 멤버의 위치와 취향을 고려하여<br />
              추천 장소를 계산 중입니다
            </p>
          </div>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer className="pb-32" withPadding={false}>
      <Header title="추천 장소" showBack />
      
      {/* 지도 영역 */}
      <div className="h-96 bg-gradient-subtle relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2 p-6 bg-background/80 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">
              {members.length}명의 멤버 위치를 고려한
            </p>
            <p className="font-semibold text-foreground">
              추천 장소 {recommendations.length}곳
            </p>
            <div className="flex gap-2 justify-center mt-3">
              {recommendations.map((_, index) => (
                <div 
                  key={index}
                  className="w-3 h-3 bg-primary rounded-full animate-pulse"
                  style={{ animationDelay: `${index * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="p-4 space-y-3 bg-background border-b">
        <div className="flex gap-2">
          <Button 
            onClick={handleRecommendAgain}
            variant="outline"
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            다시 추천받기
          </Button>
          <Button 
            onClick={goToVoting}
            variant="success"
            className="flex-1"
            disabled={selectedLocations.length === 0}
          >
            <Vote className="w-4 h-4 mr-2" />
            최종 투표하기
          </Button>
        </div>
        
        {selectedLocations.length > 0 && (
          <p className="text-xs text-center text-muted-foreground">
            {selectedLocations.length}개 장소가 선택되었습니다
          </p>
        )}
      </div>

      {/* 추천 장소 리스트 (Bottom Sheet) */}
      <BottomSheet title="추천 장소" defaultExpanded={true} collapsedHeight="13rem">
        <div className="p-4 space-y-3">
          {recommendations.map((recommendation) => (
            <LocationCard
              key={recommendation.id}
              name={recommendation.name}
              category={recommendation.category}
              address={recommendation.address}
              travelTime={recommendation.travelTime}
              rating={recommendation.rating}
              imageUrl={recommendation.imageUrl}
              isSelected={selectedLocations.includes(recommendation.id)}
              onSelect={() => handleLocationSelect(recommendation.id)}
            />
          ))}
        </div>
      </BottomSheet>
    </MobileContainer>
  );
};