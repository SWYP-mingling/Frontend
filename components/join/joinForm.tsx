'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useEnterParticipant } from '@/hooks/api/mutation/useEnterParticipant';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/ui/toast';
import { useIsLoggedIn } from '@/hooks/useIsLoggedIn';
import { setMeetingUserId } from '@/lib/storage';

interface JoinFormProps {
  meetingId: string;
}

export default function JoinForm({ meetingId }: JoinFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // meetingId는 부모(Page)에서 props로 전달받음
  const { isLogin, isChecking } = useIsLoggedIn(meetingId);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isRemembered, setIsRemembered] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const participantEnter = useEnterParticipant();
  const { isVisible, show } = useToast();

  // [추가] 공유 링크로 들어왔을 때 카테고리 정보를 localStorage에 저장
  useEffect(() => {
    if (!meetingId) return;

    const meetingType = searchParams.get('meetingType');
    const category = searchParams.get('category');

    // 값이 존재할 때만 저장 (기존 값을 덮어쓰거나 새로 저장)
    if (meetingType) {
      localStorage.setItem(`meeting_${meetingId}_meetingType`, meetingType);
    }
    if (category) {
      localStorage.setItem(`meeting_${meetingId}_category`, category);
    }
  }, [searchParams, meetingId]);

  // 기존 로그인 체크 및 리다이렉트 로직
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

      // 200 OK (성공)일 때만 여기 실행
      if (result.success) {
        setMeetingUserId(meetingId, name, isRemembered);
        router.push(`/meeting/${meetingId}`);
      }
    } catch (error: any) {
      // ⭐ [핵심] 400 에러가 뜨면 바로 여기로 옴
      // Axios 에러 객체 안에 서버가 보낸 JSON 데이터가 들어있음
      console.log('에러 raw 데이터 확인', error);
      const errorResponse = error.response?.data;

      console.log('에러 데이터 확인:', errorResponse); // 디버깅용 로그

      // 2. 코드가 없으면 메시지 확인
      if (errorResponse?.message) {
        setErrorMessage(errorResponse.message);
      } else {
        setErrorMessage('모임 참여에 실패했습니다. 다시 시도해주세요.');
      }

      show();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-11 bg-white px-5 py-10 md:min-h-[calc(100vh-200px)] md:justify-center">
      <h1 className="w-full text-[22px] font-semibold text-black md:max-w-sm">
        모임에 참여해 주세요.
      </h1>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5 md:max-w-sm">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-gray-9 text-sm font-semibold">
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
          <label htmlFor="password" className="text-gray-9 text-sm font-semibold">
            비밀번호를 입력해주세요
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

          {/* 내 정보 기억하기 체크박스 */}
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
