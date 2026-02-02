import { useMutation } from '@tanstack/react-query';
import { apiPost } from '@/lib/api';
import { SetDepartureResponse } from '@/types/api';

// [1] 요청 보낼 데이터 타입 정의 (Body)
interface DepartureBody {
  departure: string;
}

// [2] 훅에서는 meetingId만 받습니다 (data는 제거)
export const useSetDeparture = (meetingId: string) => {
  return useMutation<SetDepartureResponse, Error, DepartureBody>({
    mutationFn: async (body) => {
      return apiPost<SetDepartureResponse>(`/api/meeting/${meetingId}/departure`, body);
    },
  });
};
