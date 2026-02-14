'use client';

import Image from 'next/image';
import { useCountdown } from '@/hooks/useCountdown';

interface MeetingInfoProps {
  deadline: string;
  isDeadlineFlexible?: boolean;
  totalCapacity: number;
  currentParticipants: number;
  isParticipantUndecided?: boolean;
  onShare: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function MeetingInfoSection({
  deadline,
  isDeadlineFlexible = false,
  totalCapacity,
  currentParticipants,
  isParticipantUndecided = false,
  onShare,
}: MeetingInfoProps) {
  const { days, hours, minutes, isExpired } = useCountdown(deadline);

  const pendingCount = Math.max(0, totalCapacity - currentParticipants);

  // 1. 시간 렌더링 여부: (기한 유연 아님) AND (59일 미만)
  const isTimeSet = !isDeadlineFlexible && days < 59;

  // 2. 인원 렌더링 여부: (인원 미정 아님) AND (남은 사람이 있음)
  // 👉 !isParticipantUndecided 덕분에 "인원 선택 안 함" 상태면 false가 되어 숨겨집니다.
  const isCapacitySet = !isParticipantUndecided && pendingCount > 0;

  return (
    <div className="px-5 pt-10 md:p-0">
      <div className="flex items-start justify-between">
        <div className="text-[28px] leading-[1.358] font-bold tracking-[-2.36%] break-keep">
          {/* --- [타이틀 영역] --- */}
          <h2 className="text-gray-9">
            {isTimeSet ? (
              // Case: 시간이 설정됨 (시간만 입력 or 둘 다 입력)
              <>
                투표 마감 시간
                <br />
                {isExpired ? (
                  <span className="text-gray-400">마감되었습니다</span>
                ) : (
                  <>
                    <span className="text-blue-5">
                      {days > 0 && `${days}일 `}
                      {hours}시간 {minutes}분
                    </span>
                    {' 남았습니다'}
                  </>
                )}
              </>
            ) : (
              // Case: 시간이 유연함 (참여자만 입력 or 둘 다 안 함)
              '투표에 참여해주세요'
            )}
          </h2>

          {/* --- [인원 텍스트 영역] --- */}
          {/* isCapacitySet이 false면 아예 렌더링되지 않음 */}
          {isCapacitySet && (
            <p className="text-gray-5 mt-2 text-[15px] font-normal">
              <span>아직 입력 안 한 모임원 {pendingCount}명</span>
            </p>
          )}
        </div>

        <button
          className="text-blue-5 bg-blue-1 hover:bg-blue-2 flex h-6 w-fit shrink-0 cursor-pointer items-center gap-0.5 rounded px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-colors"
          type="button"
          onClick={onShare}
        >
          <Image src="/icon/share.svg" alt="공유 아이콘" width={12} height={12} />
          참여 링크 공유하기
        </button>
      </div>
    </div>
  );
}
