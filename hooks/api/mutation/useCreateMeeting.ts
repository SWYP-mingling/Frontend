import { useMutation } from '@tanstack/react-query';
import { apiPost } from '@/lib/api';
import type { MeetingCreateRequest, MeetingCreateResponse } from '@/types/api';

export function useCreateMeeting() {
  return useMutation<MeetingCreateResponse, Error, MeetingCreateRequest>({
    mutationFn: async (data: MeetingCreateRequest) => {
      return apiPost<MeetingCreateResponse>('/api/meeting', data);
    },
  });
}
