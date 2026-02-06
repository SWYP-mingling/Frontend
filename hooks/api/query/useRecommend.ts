import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import type { RecommendResponse } from '@/types/api';

interface UseRecommendParams {
  meetingId: string;
  midPlace: string;
  category: string;
  page?: number;
  size?: number;
}

export const useRecommend = ({ meetingId, midPlace, category, page = 1, size = 15 }: UseRecommendParams) => {
  return useQuery({
    queryKey: ['recommend', meetingId, midPlace, category, page, size],
    queryFn: async () => {
      const params = new URLSearchParams({
        midPlace,
        category,
        page: page.toString(),
        size: size.toString(),
      });
      return apiGet<RecommendResponse>(`/api/meeting/${meetingId}/recommend?${params.toString()}`);
    },
    enabled: !!meetingId && !!midPlace && !!category,
  });
};
