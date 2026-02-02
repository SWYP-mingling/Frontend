import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { MeetingStatusResponse } from '@/types/api';

export const useCheckMeeting = (meetingId: string) => {
  return useQuery({
    queryKey: ['meeting', meetingId],
    queryFn: async () => {
      return apiGet<MeetingStatusResponse>(`/api/meeting/${meetingId}/status`);
    },
    // 10초마다 갱신 (선택사항: 다른 사람이 들어오는걸 실시간으로 보고 싶다면)
    refetchInterval: 10000,
  });
};
