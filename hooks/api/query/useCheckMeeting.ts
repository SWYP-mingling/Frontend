// hooks/api/query/useCheckMeeting.ts
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { MeetingStatusResponse } from '@/types/api';

export const useCheckMeeting = (meetingId: string) => {
  const hasUserId =
    typeof window !== 'undefined'
      ? !!(localStorage.getItem('userId') || sessionStorage.getItem('userId'))
      : false;

  return useQuery({
    queryKey: ['meeting', meetingId],
    queryFn: async () => {
      return apiGet<MeetingStatusResponse>(`/api/meeting/${meetingId}/status`);
    },
    enabled: hasUserId && !!meetingId,
    refetchInterval: 10000,
    retry: false,
    // ⭐ 에러 발생 시 에러를 throw하지 않고 조용히 실패
    throwOnError: false,
  });
};
