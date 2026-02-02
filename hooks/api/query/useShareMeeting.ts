'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { useSyncExternalStore } from 'react';

// API Fetcher
const fetchMeetingResult = async (id: string) => {
  return apiGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/meeting/result/${id}`);
};

// (URL origin은 변하지 않으므로 구독 함수는 빈 함수가 된다.)
const emptySubscribe = () => () => {};
// 브라우저에서 실행될 함수 (브라우저 URL을 가져오는 함수)
const getClientSnapshot = () => window.location.origin;
// 서버에서 실행될 함수 (서버에는 window가 없기에 빈 값 반환)
const getServerSnapshot = () => '';

export const useShareMeeting = (meetingId: string) => {
  const { show, isVisible } = useToast();

  // useSyncExternalStore hooks를 통해 window.location.origin을 안전하게 가져오기
  const origin = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  // URL 계산 (origin이 있을 때만 합침)
  const shareUrl = origin ? `${origin}/join/${meetingId}` : '';

  // 모임 존재 여부 확인 (Query)
  const { isError, isLoading, error } = useQuery({
    queryKey: ['meeting', 'exist', meetingId],
    queryFn: () => fetchMeetingResult(meetingId),
    enabled: !!meetingId,
    retry: false,
  });

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      show();
    } catch (err) {
      console.error(err);
      alert('복사 실패');
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
