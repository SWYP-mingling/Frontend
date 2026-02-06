// hooks/api/query/useCheckMeeting.ts
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { MeetingStatusResponse } from '@/types/api';
import { getMeetingUserId } from '@/lib/storage';

export const useCheckMeeting = (meetingId: string) => {
  // ⭐ 모임별로 분리된 userId 확인
  const hasUserId = typeof window !== 'undefined' ? !!getMeetingUserId(meetingId) : false;

  return useQuery({
    queryKey: ['meeting', meetingId],
    queryFn: async () => {
      return apiGet<MeetingStatusResponse>(`/api/meeting/${meetingId}/status`);
    },
    enabled: hasUserId && !!meetingId,
    refetchInterval: 10000,
    retry: false,
    throwOnError: false,
  });
};
