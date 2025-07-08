import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MobileContainer } from "@/components/MobileContainer";
import { MemberCard } from "@/components/MemberCard";
import { toast } from "sonner";

interface Member {
  id: string;
  nickname: string;
  location: string;
}

export const Home = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [nickname, setNickname] = useState("");
  const [location, setLocation] = useState("");

  const addMember = () => {
    if (!nickname.trim() || !location.trim()) {
      toast.error("닉네임과 출발지를 모두 입력해주세요");
      return;
    }

    const newMember: Member = {
      id: Date.now().toString(),
      nickname: nickname.trim(),
      location: location.trim()
    };

    setMembers([...members, newMember]);
    setNickname("");
    setLocation("");
    toast.success(`${newMember.nickname}님이 추가되었습니다`);
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
  };

  const goToRecommendations = () => {
    if (members.length < 2) {
      toast.error("최소 2명 이상의 멤버가 필요합니다");
      return;
    }
    
    // 멤버 정보를 state로 전달하며 추천 페이지로 이동
    navigate("/recommendations", { state: { members } });
  };

  return (
    <MobileContainer>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">모잇지</h1>
          <p className="text-muted-foreground">
            모두가 만족하는 약속 장소를 찾아드려요
          </p>
        </div>

        {/* 멤버 추가 폼 */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">멤버 추가</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="nickname" className="text-sm font-medium">
                닉네임
              </Label>
              <Input
                id="nickname"
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-sm font-medium">
                출발지 (역명)
              </Label>
              <Input
                id="location"
                placeholder="예: 강남역, 홍대입구역"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button 
              onClick={addMember}
              className="w-full"
              variant="mobile"
            >
              <Plus className="w-4 h-4 mr-2" />
              멤버 추가
            </Button>
          </div>
        </div>

        {/* 추가된 멤버 목록 */}
        {members.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">
              참여 멤버 ({members.length}명)
            </h3>
            <div className="space-y-2">
              {members.map((member) => (
                <MemberCard
                  key={member.id}
                  nickname={member.nickname}
                  location={member.location}
                  onRemove={() => removeMember(member.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 어디서 만날까 버튼 */}
        <div className="pt-4">
          <Button 
            onClick={goToRecommendations}
            className="w-full"
            variant="gradient"
            size="xl"
            disabled={members.length < 2}
          >
            <MapPin className="w-5 h-5 mr-2" />
            어디서 만날까?
          </Button>
          
          {members.length < 2 && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              최소 2명 이상의 멤버를 추가해주세요
            </p>
          )}
        </div>
      </div>
    </MobileContainer>
  );
};