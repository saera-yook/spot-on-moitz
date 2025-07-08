import * as React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Share2, Trophy, Users, MapPin, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileContainer } from "@/components/MobileContainer";
import { Header } from "@/components/Header";
import { LocationCard } from "@/components/LocationCard";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
}

interface Vote {
  locationId: string;
  votes: number;
  voters: string[];
}

export const Voting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    members = [], 
    recommendations = [] 
  }: { 
    members: Member[]; 
    recommendations: Recommendation[] 
  } = location.state || {};

  const [votes, setVotes] = useState<Vote[]>(
    recommendations.map(rec => ({
      locationId: rec.id,
      votes: Math.floor(Math.random() * members.length), // 더미 투표 데이터
      voters: []
    }))
  );
  
  const [userVote, setUserVote] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");

  // 컴포넌트 마운트 시 공유 URL 생성
  React.useEffect(() => {
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams();
    urlParams.set('members', JSON.stringify(members));
    urlParams.set('recommendations', JSON.stringify(recommendations));
    
    const guestVoteUrl = `${window.location.origin}/voting?${urlParams.toString()}`;
    setShareUrl(guestVoteUrl);
  }, [members, recommendations]);

  const totalVotes = votes.reduce((sum, vote) => sum + vote.votes, 0);
  const sortedVotes = [...votes].sort((a, b) => b.votes - a.votes);
  const winnerVote = sortedVotes[0];
  const winnerLocation = recommendations.find(rec => rec.id === winnerVote?.locationId);

  const handleVote = (locationId: string) => {
    if (userVote) {
      toast.error("이미 투표하셨습니다");
      return;
    }

    setUserVote(locationId);
    setVotes(prev => prev.map(vote => 
      vote.locationId === locationId 
        ? { ...vote, votes: vote.votes + 1, voters: [...vote.voters, "현재사용자"] }
        : vote
    ));
    
    toast.success("투표가 완료되었습니다!");
    setTimeout(() => setShowResults(true), 1000);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "모잇지 - 약속 장소 투표",
          text: `${members.map(m => m.nickname).join(', ')}님과의 약속 장소를 투표해주세요!`,
          url: shareUrl
        });
        toast.success("투표 링크가 공유되었습니다!");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("링크가 복사되었습니다!");
      }
    } catch (error) {
      console.error("Share failed:", error);
      // 폴백: 클립보드에 복사
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("링크가 복사되었습니다!");
      } catch (clipboardError) {
        toast.error("공유에 실패했습니다");
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("투표 링크가 복사되었습니다!");
    } catch (error) {
      toast.error("링크 복사에 실패했습니다");
    }
  };

  const getVotePercentage = (locationId: string) => {
    const vote = votes.find(v => v.locationId === locationId);
    if (!vote || totalVotes === 0) return 0;
    return Math.round((vote.votes / totalVotes) * 100);
  };

  if (recommendations.length === 0) {
    navigate("/");
    return null;
  }

  return (
    <MobileContainer>
      <Header 
        title="최종 투표" 
        showBack 
        rightAction={
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
          </Button>
        }
      />

      <div className="space-y-6">
        {/* 투표 현황 */}
        <Card className="p-4 bg-gradient-subtle border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">투표 현황</h2>
              <p className="text-sm text-muted-foreground">
                {totalVotes}명이 투표했습니다
              </p>
            </div>
          </div>
          
          {showResults && winnerLocation && (
            <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">현재 1위</span>
              </div>
              <p className="font-semibold text-foreground">{winnerLocation.name}</p>
              <p className="text-sm text-muted-foreground">{winnerLocation.address}</p>
            </div>
          )}
        </Card>

        {/* 투표 장소 목록 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            투표 후보 ({recommendations.length}곳)
          </h3>
          
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => {
              const vote = votes.find(v => v.locationId === recommendation.id);
              const percentage = getVotePercentage(recommendation.id);
              const isUserVoted = userVote === recommendation.id;
              
              return (
                <div key={recommendation.id} className="space-y-2">
                  <div 
                    className={`cursor-pointer transition-all duration-200 ${
                      userVote && !isUserVoted ? 'opacity-60' : ''
                    }`}
                    onClick={() => handleVote(recommendation.id)}
                  >
                    <LocationCard
                      name={`${index + 1}. ${recommendation.name}`}
                      category={recommendation.category}
                      address={recommendation.address}
                      travelTime={recommendation.travelTime}
                      rating={recommendation.rating}
                      isSelected={isUserVoted}
                    />
                  </div>
                  
                  {showResults && vote && (
                    <div className="px-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {vote.votes}표 ({percentage}%)
                        </span>
                        {isUserVoted && (
                          <span className="text-primary font-medium">내가 투표한 장소</span>
                        )}
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 공유 버튼 */}
        <div className="pt-4 border-t space-y-3">
          <div className="bg-accent/30 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">게스트 투표 참여</span>
            </div>
            <p className="text-xs text-muted-foreground">
              친구들에게 링크를 공유하여 투표에 참여하게 할 수 있습니다
            </p>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleShare}
                variant="default"
                className="flex-1"
                size="sm"
              >
                <Share2 className="w-4 h-4 mr-2" />
                공유하기
              </Button>
              <Button 
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="px-3"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <Button 
            onClick={() => window.open(shareUrl, '_blank')}
            variant="outline"
            className="w-full"
            size="mobile"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            새 창에서 게스트 투표 페이지 열기
          </Button>
        </div>

        {!userVote && (
          <div className="bg-accent/50 p-4 rounded-lg text-center">
            <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">
              원하는 장소를 선택하여 투표해주세요
            </p>
          </div>
        )}
      </div>
    </MobileContainer>
  );
};