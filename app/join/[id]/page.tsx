'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useEnterParticipant } from '@/hooks/api/mutation/useEnterParticipant';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/ui/toast';
import { useIsLoggedIn } from '@/hooks/useIsLoggedIn';

export default function Page() {
  const params = useParams();
  const meetingId = params?.id as string;
  const router = useRouter();

  const { isLogin, isChecking } = useIsLoggedIn(); // ⭐ 객체 구조분해로 변경

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isRemembered, setIsRemembered] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const participantEnter = useEnterParticipant();
  const { isVisible, show } = useToast();

  // 로그인 상태 확인 및 리다이렉트
  useEffect(() => {
    if (!isChecking && isLogin && meetingId) {
      // ⭐ 출발지 입력 여부 확인
      const checkDeparture = async () => {
        try {
          const response = await fetch(`/api/meeting/${meetingId}/status`, {
            credentials: 'include',
          });
          const data = await response.json();

          // 출발지가 이미 입력되어 있으면 result 페이지로
          // 출발지가 없으면 meeting 페이지로
          if (data.hasDeparture) {
            router.replace(`/result/${meetingId}`);
          } else {
            router.replace(`/meeting/${meetingId}`);
          }
        } catch (error) {
          router.replace(`/meeting/${meetingId}`);
        }
      };

      checkDeparture();
    }
  }, [isChecking, isLogin, meetingId, router]);

  // 확인 중이거나 로그인된 상태면 로딩 화면
  if (isChecking || isLogin) {
    return <div className="flex h-screen items-center justify-center bg-white"></div>;
  }

  const isFormValid = name.length > 0 && password.length === 4;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !meetingId) return;

    try {
      const result = await participantEnter.mutateAsync({
        meetingId,
        data: {
          userId: name,
          password,
        },
      });

      if (result.success) {
        if (isRemembered) {
          localStorage.setItem('userId', name);
        } else {
          sessionStorage.setItem('userId', name);
        }

        router.push(`/meeting/${meetingId}`);
      } else {
        setErrorMessage('모임 참여에 실패했습니다. 다시 시도해주세요.');
        show();
      }
    } catch {
      setErrorMessage('모임 참여에 실패했습니다. 이름과 비밀번호를 확인해주세요.');
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
            className={`border-gray-2 placeholder:text-gray-3 text-gray-10 focus:border-blue-5 w-full rounded-sm border py-2 pl-3 text-center text-[15px] focus:bg-white focus:outline-none ${password ? 'pl-0 text-center' : 'pl-3 text-left'}`}
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
                    ? 'border-blue-500 bg-blue-500'
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
                ? 'hover:bg-blue-8 bg-blue-5'
                : 'bg-gray-4 cursor-not-allowed'
            }`}
          >
            모임 참여하기
          </button>
          <Toast message={errorMessage} isVisible={isVisible} />
        </div>
      </form>
    </div>
  );
}
