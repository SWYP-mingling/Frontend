'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { useState, useEffect } from 'react';

// API Fetcher 분리
const fetchMeetingResult = async (id: string) => {
  return apiGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/meeting/result/${id}`);
};

export const useShareMeeting = (meetingId: string) => {
  const { show, isVisible } = useToast();
  const [shareUrl, setShareUrl] = useState('');

  // 모임 존재 여부 확인 (Query)
  const { isError, isLoading, error } = useQuery({
    queryKey: ['meeting', 'exist', meetingId],
    queryFn: () => fetchMeetingResult(meetingId),
    enabled: !!meetingId, // ID가 있을 때만 실행
    retry: false, // 404면 재시도 없이 에러 처리
  });

  // 공유 URL 생성
  useEffect(() => {
    if (typeof window !== 'undefined' && meetingId) {
      setShareUrl(`${window.location.origin}/join/${meetingId}`);
    }
  }, [meetingId]);

  // 복사 핸들러
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
