import { useMutation } from '@tanstack/react-query';
import { apiPost } from '@/lib/api';
import type { ParticipantEnterRequest, ParticipantEnterResponse } from '@/types/api';

export function useEnterParticipant() {
  return useMutation<
    ParticipantEnterResponse,
    Error,
    { meetingId: string; data: ParticipantEnterRequest }
  >({
    mutationFn: async ({ meetingId, data }) => {
      return apiPost<ParticipantEnterResponse>(`/api/participant/${meetingId}/enter`, data);
    },
  });
}
