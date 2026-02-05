import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import type { MidpointResponse } from '@/types/api';

export const useMidpoint = (meetingId: string) => {
  return useQuery({
    queryKey: ['midpoint', meetingId],
    queryFn: async () => {
      return apiGet<MidpointResponse>(`/api/meeting/${meetingId}/midpoint`);
    },
    enabled: !!meetingId,
  });
};
