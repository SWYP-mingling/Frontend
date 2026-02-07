'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { useSyncExternalStore } from 'react';
import { MeetingLinkResponse } from '@/types/api';

// API Fetcher
const fetchMeetingResult = async (id: string) => {
  return apiGet<MeetingLinkResponse>(`/api/meeting/result/${id}`);
};

// URL Origin 구독 함수 (변하지 않으므로 빈 함수)
const emptySubscribe = () => () => {};
const getClientSnapshot = () => window.location.origin;
const getServerSnapshot = () => '';

// [수정] mode 파라미터 추가 (기본값: 'share')
export const useShareMeeting = (meetingId: string, mode: 'share' | 'nudge' = 'share') => {
  const { show, isVisible } = useToast();

  // 1. Base Origin 가져오기
  const origin = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  // 2. 쿼리스트링 결정 로직
  const queryString = mode === 'nudge' ? '?view=nudge' : '?view=share';

  // 3. 최종 URL 조합 (화면에 보여줄 용도)
  const shareUrl = origin ? `${origin}/join/${meetingId}${queryString}` : '';

  // 4. 모임 존재 여부 확인 (Query)
  const { isError, isLoading, error } = useQuery({
    queryKey: ['meeting', 'exist', meetingId],
    queryFn: () => fetchMeetingResult(meetingId),
    enabled: !!meetingId,
    retry: false,
  });

  // 5. 링크 복사 핸들러
  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      show();
    } catch (err) {
      console.error('링크 복사 실패:', err);
      alert('링크 복사에 실패했습니다.');
    }
  };

  return {
    shareUrl,
    isError,
    isLoading,
    error,
    handleCopyLink,
    isVisible,
  };
};
