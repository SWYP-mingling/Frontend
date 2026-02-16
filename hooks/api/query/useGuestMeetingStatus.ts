import { apiGet } from '@/lib/api';
import { GuestStatusResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export const useGuestMeetingStatus = (meetingId: string) => {
  return useQuery({
    queryKey: ['guestStatus', meetingId],
    queryFn: async () => {
      return apiGet<GuestStatusResponse>(`/api/meeting/${meetingId}/guestStatus`);
    },
    enabled: !!meetingId,
    refetchInterval: 60 * 1000,
    retry: false,
  });
};
