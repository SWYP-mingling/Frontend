'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FeedbackModal from './feedbackModal';

const Header = () => {
  // 3. 모달 상태 관리 (기본값: 닫힘 false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(true);

  return (
    <header className="border-gray-1 sticky top-0 right-0 left-0 flex h-15 items-center justify-center border-b bg-white">
      <div className="mx-5 my-2.5 flex w-300 items-center justify-between md:mx-12.5 lg:mx-42.5">
        <Link href="/" className="shrink-0">
          <Image src="/logo.svg" alt="Mingling Logo" width={112} height={40} priority />
        </Link>
        <nav className="hidden items-center gap-2.5 md:flex">
          <Link href="/" className="text-gray-5 p-2 text-[16px]">
            문의하기
          </Link>

          {/* 4. 버튼 클릭 시 상태를 true로 변경 */}
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="text-gray-5 p-2 text-[16px] transition-colors hover:text-gray-900"
          >
            피드백남기기
          </button>
        </nav>
      </div>

      {/* 5. 모달 렌더링 (Header 안에 두어도 Portal 덕분에 화면 위에 잘 뜹니다) */}
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </header>
  );
};

export default Header;
