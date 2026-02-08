'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { useSyncExternalStore, useState } from 'react';
import { MeetingLinkResponse } from '@/types/api';

// API Fetcher
const fetchMeetingResult = async (id: string) => {
  return apiGet<MeetingLinkResponse>(`/api/meeting/result/${id}`);
};

const emptySubscribe = () => () => {};
const getClientSnapshot = () => window.location.origin;
const getServerSnapshot = () => '';

export const useShareMeeting = (meetingId: string, mode: 'share' | 'nudge' = 'share') => {
  const { show, isVisible } = useToast();
  const origin = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  // [추가] 카테고리 정보를 담을 state
  const [categoryParams] = useState(() => {
    // SSR 환경 방어
    if (typeof window === 'undefined' || !meetingId) return '';

    const meetingType = localStorage.getItem(`meeting_${meetingId}_meetingType`);
    const category = localStorage.getItem(`meeting_${meetingId}_category`);

    const params = new URLSearchParams();
    if (meetingType) params.append('meetingType', meetingType);
    if (category) params.append('category', category);

    const paramString = params.toString();
    return paramString ? `&${paramString}` : '';
  });

  // 2. 쿼리스트링 결정 로직 (기본 모드 설정)
  const baseQueryString = mode === 'nudge' ? '?view=nudge' : '?view=share';

  // 3. 최종 URL 조합 (Origin + BaseQuery + CategoryParams)
  // 예: .../join/123?view=share&meetingType=date&category=food
  const shareUrl = origin ? `${origin}/join/${meetingId}${baseQueryString}${categoryParams}` : '';

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
