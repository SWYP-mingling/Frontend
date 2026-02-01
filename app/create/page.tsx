'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCreateMeeting } from '@/hooks/api/useMeeting';
import type { MeetingCreateRequest } from '@/types/api';

export default function Page() {
  const [meetingName, setMeetingName] = useState('');
  const [meetingType, setMeetingType] = useState<'회의' | '친목' | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedSocialPlace, setSelectedSocialPlace] = useState<string | null>(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [isParticipantUndecided, setIsParticipantUndecided] = useState(false);
  const [deadlineDays, setDeadlineDays] = useState(1);
  const [isDeadlineFlexible, setIsDeadlineFlexible] = useState(false);
  const router = useRouter();
  const createMeeting = useCreateMeeting();

  const isFormValid = meetingName.length > 0 && !!meetingType;

  const getDeadlineDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + deadlineDays);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}. ${month}. ${day}까지`;
  };

  const handleIncreaseParticipants = () => {
    if (!isParticipantUndecided) {
      setParticipantCount((prev) => prev + 1);
    }
  };

  const handleDecreaseParticipants = () => {
    if (!isParticipantUndecided && participantCount > 0) {
      setParticipantCount((prev) => prev - 1);
    }
  };

  const handleIncreaseDeadline = () => {
    if (!isDeadlineFlexible) {
      setDeadlineDays((prev) => prev + 1);
    }
  };

  const handleDecreaseDeadline = () => {
    if (!isDeadlineFlexible && deadlineDays > 1) {
      setDeadlineDays((prev) => prev - 1);
    }
  };

  const handleParticipantCheckbox = () => {
    setIsParticipantUndecided((prev) => !prev);
    if (!isParticipantUndecided) {
      setParticipantCount(0);
    }
  };

  const handleDeadlineCheckbox = () => {
    setIsDeadlineFlexible((prev) => !prev);
  };

  const getPurposes = (): string[] => {
    const purposes: string[] = [];

    if (meetingType) {
      purposes.push(meetingType);
    }

    if (meetingType === '회의' && selectedLocation) {
      purposes.push(selectedLocation);
    }

    if (meetingType === '친목' && selectedSocialPlace) {
      purposes.push(selectedSocialPlace);
    }

    return purposes;
  };

  const getDeadlineISO = (): string => {
    let date: Date;

    if (isDeadlineFlexible) {
      date = new Date();
      date.setDate(date.getDate() + 60);
    } else {
      date = new Date();
      date.setDate(date.getDate() + deadlineDays);
    }

    date.setHours(23, 59, 59, 0);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const handleGenerateMeeting = async () => {
    if (!isFormValid) {
      alert('약속의 필수 요건을 만족시켜주세요.');
      return;
    }

    const purposes = getPurposes();

    // capacity 처리: "아직 안정해졌어요" 체크 시 30으로 설정
    const capacity = isParticipantUndecided ? 30 : participantCount || 1;

    const requestData: MeetingCreateRequest = {
      meetingName,
      purposes,
      purposeCount: purposes.length,
      capacity,
      deadline: getDeadlineISO(),
    };

    try {
      const result = await createMeeting.mutateAsync(requestData);
      console.log('전체 응답:', result);

      if (result.success && result.data?.meetingId) {
        const { meetingId } = result.data;
        console.log('생성된 ID:', meetingId);

        // 링크 공유 페이지 이동
        router.push(`/share/${meetingId}`);
      } else {
        // success가 false거나 데이터가 없을 때
        alert('모임 생성 응답에 문제가 있습니다.');
      }
    } catch (error) {
      const apiError = error as Error & { status?: number; data?: unknown };

      if (apiError?.data) {
        const errorMessage =
          typeof apiError.data === 'object'
            ? JSON.stringify(apiError.data, null, 2)
            : String(apiError.data);
        alert(`모임 생성에 실패했습니다:\n${errorMessage}`);
      } else if (apiError?.message) {
        alert(`모임 생성에 실패했습니다: ${apiError.message}`);
      } else {
        alert('모임 생성에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-1 justify-center overflow-hidden">
        <div className="mx-5 my-10 flex w-full flex-col items-center gap-11 sm:max-w-sm md:mx-12.5 md:my-20 lg:mx-42.5 lg:my-25 lg:gap-11">
          <div className="flex w-full flex-col gap-2">
            <label className="text-gray-9 text-[14px] leading-[1.571] font-semibold tracking-[0.203px]">
              약속의 이름을 알려주세요.
            </label>
            <input
              type="text"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
              placeholder="플레이스 홀더"
              className="border-gray-2 placeholder:text-gray-3 w-full rounded-[4px] border px-3 py-2 text-[15px] leading-[1.6] tracking-[0.144px] focus:outline-none"
            />
          </div>

          <div className="flex w-full flex-col gap-2">
            <label className="text-gray-9 text-[14px] leading-[1.571] font-semibold tracking-[0.203px]">
              어떤 약속인가요?
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMeetingType('회의')}
                className={`flex-1 rounded-[4px] py-2.5 text-[15px] leading-[1.6] tracking-[0.144px] transition-colors sm:py-2 ${
                  meetingType === '회의'
                    ? 'bg-blue-5 text-white'
                    : 'bg-gray-1 text-gray-7 hover:bg-gray-2'
                }`}
              >
                회의
              </button>
              <button
                type="button"
                onClick={() => setMeetingType('친목')}
                className={`flex-1 rounded-[4px] py-2.5 text-[15px] leading-[1.6] tracking-[0.144px] transition-colors sm:py-2 ${
                  meetingType === '친목'
                    ? 'bg-blue-5 text-white'
                    : 'bg-gray-1 text-gray-7 hover:bg-gray-2'
                }`}
              >
                친목
              </button>
            </div>

            {meetingType === '회의' && (
              <>
                <p className="text-gray-7 text-[13px] leading-[1.385] font-normal tracking-[0.2522px]">
                  어떤 장소를 원하시나요? <span className="leading-[1.385]">(선택)</span>
                </p>
                <div className="flex w-full flex-col gap-2">
                  {['스터디 카페', '장소 대여'].map((location) => {
                    const isSelected = selectedLocation === location;
                    return (
                      <button
                        key={location}
                        type="button"
                        onClick={() => setSelectedLocation(isSelected ? null : location)}
                        className={`flex h-[43px] w-full items-center gap-[14px] rounded-[4px] border px-3 py-1 transition-colors ${
                          isSelected
                            ? 'border-gray-1 bg-white'
                            : 'border-gray-1 hover:bg-gray-1 bg-white'
                        }`}
                      >
                        {!isSelected && (
                          <Image src="/icon/check.svg" alt="check" width={20} height={20} />
                        )}
                        {isSelected && (
                          <Image src="/icon/bluecheck.svg" alt="check" width={20} height={20} />
                        )}

                        <span
                          className={`text-[15px] leading-[1.6] tracking-[0.144px] ${
                            isSelected ? 'text-blue-5' : 'text-gray-6'
                          }`}
                        >
                          {location}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {meetingType === '친목' && (
              <>
                <p className="text-gray-7 text-[13px] leading-[1.385] font-normal tracking-[0.2522px]">
                  어떤 장소를 원하시나요? <span className="leading-[1.385]">(선택)</span>
                </p>
                <div className="flex w-full flex-col gap-2">
                  {['식당', '술집', '카페', '놀거리'].map((place) => {
                    const isSelected = selectedSocialPlace === place;
                    return (
                      <button
                        key={place}
                        type="button"
                        onClick={() => setSelectedSocialPlace(isSelected ? null : place)}
                        className={`flex h-[43px] w-full items-center gap-[14px] rounded-[4px] border px-3 py-1 transition-colors ${
                          isSelected
                            ? 'border-gray-1 bg-white'
                            : 'border-gray-1 hover:bg-gray-1 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <Image src="/icon/bluecheck.svg" alt="check" width={20} height={20} />
                        )}
                        {!isSelected && (
                          <Image src="/icon/check.svg" alt="check" width={20} height={20} />
                        )}

                        <span
                          className={`text-[15px] leading-[1.6] tracking-[0.144px] ${
                            isSelected ? 'text-blue-5' : 'text-gray-6'
                          }`}
                        >
                          {place}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="flex w-full flex-col gap-2">
            <label className="text-gray-9 text-[14px] leading-[1.571] font-semibold tracking-[0.203px] sm:text-[15px] md:text-[14px]">
              참여 인원을 알려주세요.
            </label>
            <div className="border-gray-2 relative flex h-[44px] items-center rounded-[4px] border bg-white">
              <button
                type="button"
                onClick={handleDecreaseParticipants}
                disabled={isParticipantUndecided || participantCount === 0}
                className="bg-gray-1 absolute -top-px -left-px flex h-[44px] w-[44px] items-center justify-center rounded-tl-[4px] rounded-bl-[4px] disabled:opacity-50 sm:h-[44px] sm:w-[44px]"
              >
                <Image src="/icon/minus.svg" alt="minus" width={20} height={20} />
              </button>
              <div className="text-gray-8 absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[2px] text-[15px] leading-[1.6] tracking-[0.144px]">
                <span>{participantCount}</span>
                <span>명</span>
              </div>
              <button
                type="button"
                onClick={handleIncreaseParticipants}
                disabled={isParticipantUndecided}
                className="bg-gray-1 absolute -top-px -right-px flex h-[44px] w-[44px] items-center justify-center rounded-tr-[4px] rounded-br-[4px] disabled:opacity-50 sm:h-[44px] sm:w-[44px]"
              >
                <Image src="/icon/plus.svg" alt="plus" width={20} height={20} />
              </button>
            </div>
            <div className="flex items-center gap-[10px]">
              <button
                type="button"
                onClick={handleParticipantCheckbox}
                className={`flex h-5 w-5 items-center justify-center rounded-[4px] transition-colors ${
                  isParticipantUndecided ? 'bg-blue-5' : 'bg-gray-3'
                }`}
              >
                <Image src="/icon/whitecheck.svg" alt="check" width={10} height={10} />
              </button>
              <span
                className={`text-[12px] leading-[1.334] tracking-[0.3024px] ${isParticipantUndecided ? 'text-blue-5' : 'text-gray-6'}`}
              >
                아직 안정해졌어요.
              </span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            <label className="text-gray-9 text-[14px] leading-[1.571] font-semibold tracking-[0.203px] sm:text-[15px] md:text-[14px]">
              참여 기한을 정해주세요.
            </label>
            <div className="border-gray-2 relative flex h-[60px] items-center rounded-[4px] border bg-white">
              <button
                type="button"
                onClick={handleDecreaseDeadline}
                disabled={isDeadlineFlexible || deadlineDays === 1}
                className="bg-gray-1 absolute -top-px -left-px flex h-[60px] w-[44px] items-center justify-center rounded-tl-[4px] rounded-bl-[4px] disabled:opacity-50 sm:h-[60px] sm:w-[44px]"
              >
                <Image src="/icon/minus.svg" alt="minus" width={20} height={20} />
              </button>
              <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <span className="text-blue-5 text-[12px] leading-[1.334] tracking-[0.3024px]">
                  {getDeadlineDate()}
                </span>
                <div className="text-gray-8 flex items-center gap-[2px] text-[15px] leading-[1.6] tracking-[0.144px]">
                  <span>{deadlineDays}</span>
                  <span>일</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleIncreaseDeadline}
                disabled={isDeadlineFlexible}
                className="bg-gray-1 absolute -top-px -right-px flex h-[60px] w-[44px] items-center justify-center rounded-tr-[4px] rounded-br-[4px] disabled:opacity-50 sm:h-[60px] sm:w-[44px]"
              >
                <Image src="/icon/plus.svg" alt="plus" width={20} height={20} />
              </button>
            </div>
            <div className="flex items-center gap-[10px]">
              <button
                type="button"
                onClick={handleDeadlineCheckbox}
                className={`flex h-5 w-5 items-center justify-center rounded-[4px] border transition-colors ${
                  isDeadlineFlexible ? 'bg-blue-5' : 'bg-gray-3'
                }`}
              >
                <Image src="/icon/whitecheck.svg" alt="check" width={10} height={10} />
              </button>
              <span
                className={` ${isDeadlineFlexible ? 'text-blue-5' : 'text-gray-6'} text-[12px] leading-[1.334] tracking-[0.3024px]`}
              >
                상관 없어요.
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={!isFormValid || createMeeting.isPending}
            onClick={handleGenerateMeeting}
            className={`h-12 w-full rounded-[4px] text-[16px] leading-[1.445] font-semibold tracking-[-0.0036px] transition-colors sm:text-[17px] md:text-[18px] ${
              isFormValid && !createMeeting.isPending
                ? 'bg-blue-5 hover:bg-blue-8 text-white'
                : 'bg-gray-4 text-gray-2 cursor-not-allowed'
            }`}
          >
            모임 만들기
          </button>
        </div>
      </div>
    </div>
  );
}
