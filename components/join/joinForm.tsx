'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useEnterParticipant } from '@/hooks/api/mutation/useEnterParticipant';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/ui/toast';
import { useIsLoggedIn } from '@/hooks/useIsLoggedIn';
import { setMeetingUserId } from '@/lib/storage';
import Image from 'next/image';

interface JoinFormProps {
  meetingId: string;
}

export default function JoinForm({ meetingId }: JoinFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLogin, isChecking } = useIsLoggedIn(meetingId);
  const participantEnter = useEnterParticipant();
  const { isVisible, show } = useToast();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isRemembered, setIsRemembered] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // ⚡️ [핵심] 진입과 동시에 값 결정 (URL 파라미터 우선 -> 로컬스토리지 순)
  // 이렇게 해야 공유 링크로 들어왔을 때 깜빡임 없이 바로 값이 보입니다.
  const [meetingTypeVal] = useState(() => {
    if (typeof window === 'undefined') return '';
    // 1. URL 파라미터가 있으면 무조건 이걸 먼저 보여줌 (가장 최신 의도)
    const param = searchParams.get('meetingType');
    if (param) return param;
    // 2. URL에 없으면 로컬스토리지(과거 기록) 확인
    return localStorage.getItem(`meeting_${meetingId}_meetingType`) || '';
  });

  const [categoryVal] = useState(() => {
    if (typeof window === 'undefined') return '';
    const param = searchParams.get('category');
    if (param) return param;
    return localStorage.getItem(`meeting_${meetingId}_category`) || '';
  });

  // [보조] URL 파라미터가 있다면 로컬스토리지에 '저장'만 해둠 (다음 방문을 위해)
  useEffect(() => {
    if (!meetingId) return;
    const meetingType = searchParams.get('meetingType');
    const category = searchParams.get('category');

    if (meetingType) {
      localStorage.setItem(`meeting_${meetingId}_meetingType`, meetingType);
    }
    if (category) {
      localStorage.setItem(`meeting_${meetingId}_category`, category);
    }
  }, [searchParams, meetingId]);

  // 로그인 체크
  useEffect(() => {
    if (isChecking) return;
    if (isLogin && meetingId) {
      router.replace(`/meeting/${meetingId}`);
    }
  }, [isChecking, isLogin, meetingId, router]);

  if (isChecking || isLogin) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-white">
        <div className="border-t-blue-5 h-8 w-8 animate-spin rounded-full border-4 border-gray-200" />
        <p className="text-gray-5 text-sm font-medium">로그인 정보를 확인 중...</p>
      </div>
    );
  }

  const isFormValid = name.length > 0 && password.length === 4;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !meetingId) return;

    try {
      // @ts-ignore
      const result = await participantEnter.mutateAsync({
        meetingId,
        data: {
          userId: name,
          password,
        },
      });

      if (result.success) {
        setMeetingUserId(meetingId, name, isRemembered);
        router.push(`/meeting/${meetingId}`);
      } else {
        setErrorMessage(result.data?.message || '모임 참여에 실패했습니다. 다시 시도해주세요.');
        show();
      }
    } catch (error: any) {
      const errorData = error.data || error.response?.data;
      const serverMessage = errorData?.message;

      if (serverMessage) {
        setErrorMessage(serverMessage);
      } else {
        setErrorMessage('모임 참여에 실패했습니다. 다시 시도해주세요.');
      }
      show();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-11 bg-white px-5 pt-12.5 pb-25 md:min-h-[calc(100vh-200px)] md:justify-center">
      <div className="relative h-64 w-full max-w-215">
        <Image
          src="/images/banner.jpg"
          alt="배너이미지"
          fill
          className="rounded-2xl object-cover"
          sizes="(max-width: 768px) 100vw, 860px"
          priority
        />
      </div>

      <div className="flex w-full flex-col items-start gap-3 md:max-w-sm">
        <h1 className="w-full text-[22px] font-semibold text-black">모임에 참여해 주세요.</h1>

        {/* ⚡️ suppressHydrationWarning 필수 */}
        {/* 서버(값 없음) vs 클라이언트(값 있음) 불일치 경고 무시 */}
        {(meetingTypeVal || categoryVal) && (
          <div className="flex gap-2" suppressHydrationWarning>
            {meetingTypeVal && (
              <span className="text-blue-5 bg-gray-1 rounded px-3 py-1 text-xs font-medium">
                {meetingTypeVal}
              </span>
            )}
            {categoryVal && (
              <span className="text-blue-5 bg-gray-1 rounded px-3 py-1 text-xs font-medium">
                {categoryVal}
              </span>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5 md:max-w-sm">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-gray-9 text-[16px] font-semibold">
            이름을 입력해주세요.
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="최대 20자 이내로 입력해주세요"
            maxLength={20}
            className="border-gray-2 placeholder:text-gray-3 text-gray-10 focus:border-blue-5 w-full rounded-sm border py-2 pl-3 text-[15px] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-gray-9 text-[16px] font-semibold">
            비밀번호를 설정해주세요
          </label>
          <input
            id="password"
            type="password"
            inputMode="numeric"
            value={password}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              if (val.length <= 4) setPassword(val);
            }}
            placeholder="숫자 4자리를 입력해주세요"
            className={`border-gray-2 placeholder:text-gray-3 text-gray-10 focus:border-blue-5 w-full rounded-sm border py-2 pl-3 text-center text-[15px] focus:bg-white focus:outline-none ${
              password ? 'pl-0 text-center' : 'pl-3 text-left'
            }`}
          />

          <div
            onClick={() => setIsRemembered(!isRemembered)}
            className="flex cursor-pointer items-center gap-2"
          >
            <div
              className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                !isRemembered
                  ? 'border-gray-300 bg-white'
                  : isFormValid
                    ? 'border-blue-5 bg-blue-5'
                    : 'border-gray-300 bg-gray-300'
              }`}
            >
              {isRemembered && (
                <svg
                  width="8"
                  height="6"
                  viewBox="0 0 14 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 5L4.5 8.5L13 1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span className={`text-xs font-medium ${isFormValid ? 'text-blue-5' : 'text-gray-5'}`}>
              내 정보 기억하기
            </span>
          </div>
        </div>

        <div className="relative w-full md:max-w-sm">
          <button
            type="submit"
            disabled={!isFormValid || participantEnter.isPending}
            className={`text-gray-2 mt-6 h-12 w-full rounded-sm py-4 pt-3 pb-2.5 text-lg font-semibold transition-colors ${
              isFormValid && !participantEnter.isPending
                ? 'hover:bg-blue-8 bg-blue-5 text-white'
                : 'bg-gray-4 cursor-not-allowed'
            }`}
          >
            모임 참여하기
          </button>

          <div className="absolute top-full left-0 mt-2 w-full">
            <Toast message={errorMessage} isVisible={isVisible} />
          </div>
        </div>
      </form>
    </div>
  );
}
