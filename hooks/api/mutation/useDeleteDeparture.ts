import { useMutation } from '@tanstack/react-query';
import { apiDelete } from '@/lib/api';

interface DeleteDepartureResponse {
  success: boolean;
  nickname?: string;
}

export function useDeleteDeparture(meetingId: string) {
  return useMutation<DeleteDepartureResponse, Error>({
    mutationFn: async () => {
      return apiDelete<DeleteDepartureResponse>(`/api/meeting/${meetingId}/departure`);
    },
  });
}
