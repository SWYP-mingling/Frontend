'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { useParticipantEnter } from '@/hooks/api/useParticipant';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/ui/toast';

export default function Page() {
  const params = useParams();
  const meetingId = params?.id as string;
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isRemembered, setIsRemembered] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const participantEnter = useParticipantEnter();
  const { isVisible, show } = useToast();

  // 이름/비번 유효성 검사 (입력값이 있을 때만 버튼 활성화)
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
          sessionStorage.removeItem('userId');
        } else {
          sessionStorage.setItem('userId', name);
          localStorage.removeItem('userId');
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
      {/* 타이틀 */}
      <h1 className="w-full text-[22px] font-semibold text-black md:max-w-sm">
        모임에 참여해 주세요.
      </h1>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5 md:max-w-sm">
        {/* 이름 입력 */}
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

        {/* 비밀번호 입력 */}
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
              // 4자리 숫자만 입력받도록 처리하기
              const val = e.target.value.replace(/[^0-9]/g, '');
              if (val.length <= 4) setPassword(val);
            }}
            placeholder="숫자 4자리를 입력해주세요"
            className={`border-gray-2 placeholder:text-gray-3 text-gray-10 focus:border-blue-5 w-full rounded-sm border py-2 pl-3 text-center text-[15px] focus:bg-white focus:outline-none ${password ? 'pl-0 text-center' : 'pl-3 text-left'}`}
          />
          {/* 체크박스 */}
          <div
            onClick={() => setIsRemembered(!isRemembered)}
            className="flex cursor-pointer items-center gap-2"
          >
            {/* 체크 아이콘 박스 */}
            <div
              className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                !isRemembered
                  ? 'border-gray-300 bg-white' // 1. 체크가 안 된 경우
                  : isFormValid
                    ? 'border-blue-500 bg-blue-500' // 2. 체크가 됐고, 이름/비번을 제대로 입력한 경우
                    : 'border-gray-300 bg-gray-300' // 3. 체크가 됐으나, 입력이 제대로 안 된 경우
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
        {/* 하단 버튼 */}
        <div className="relative w-full md:max-w-sm">
          <button
            type="submit"
            disabled={!isFormValid || participantEnter.isPending}
            className={`text-gray-2 mt-6 h-12 w-full rounded-sm py-4 pt-3 pb-2.5 text-lg font-semibold transition-colors ${
              isFormValid && !participantEnter.isPending
                ? 'hover:bg-blue-8 bg-blue-5' // 활성화 상태
                : 'bg-gray-4 cursor-not-allowed' // 비활성화 상태
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
