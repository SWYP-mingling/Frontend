'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useOpenModal } from '@/hooks/useOpenModal';

const ICON = ['threads', 'instagram'];

const Footer = () => {
  const openModal = useOpenModal();

  return (
    <footer className="bg-gray-1 flex h-59 items-center md:h-35">
      <div className="flex w-full flex-col items-start gap-5 px-5 md:flex-row md:justify-between md:gap-0">
        <Image src="/logo.svg" alt="Mingling Logo" width={112} height={40} priority />
        <nav className="flex flex-col items-start gap-6 md:items-end">
          <div className="flex flex-col gap-3 md:flex-row md:gap-8">
            <div className="flex gap-4 md:gap-8">
              <Link href="/" className="text-gray-7 text-[16px]">
                이용약관
              </Link>
              <Link href="/" className="text-gray-7 text-[16px]">
                개인정보 처리방침
              </Link>
            </div>
            <div className="flex gap-4 md:gap-8">
              <Link href="https://tally.so/r/lbry1p" className="text-gray-7 text-[16px]">
                문의하기
              </Link>
              {/* <button
                type="button"
                onClick={(e) => openModal('FEEDBACK', undefined, e)}
                className="text-gray-7 cursor-pointer text-[16px]"
              >
                피드백남기기
              </button> */}
            </div>
          </div>
          {/* 쓰레드, 인스타그램 아이콘 렌더링 숨김 */}
          {/* <div className="text-gray-4 flex gap-3">
            {ICON.map((item, idx) => (
              <Link href={`https://www.${item}.com/`} key={idx}>
                <Image src={`/icon/${item}.svg`} alt={`${item} Logo`} width={24} height={24} />
              </Link>
            ))}
          </div> */}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
