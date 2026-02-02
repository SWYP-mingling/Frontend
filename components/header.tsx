'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useOpenModal } from '@/hooks/useOpenModal';

const Header = () => {
  const openModal = useOpenModal();

  return (
    <header className="border-gray-1 top-0 right-0 left-0 flex h-15 items-center justify-center border-b bg-white">
      <div className="mx-5 my-2.5 flex w-300 items-center justify-between md:mx-12.5 lg:mx-42.5">
        <Link href="/" className="shrink-0">
          <Image src="/logo.svg" alt="Mingling Logo" width={112} height={40} priority />
        </Link>
        <nav className="hidden items-center gap-2.5 md:flex">
          <Link href="/" className="text-gray-5 p-2 text-[16px]">
            문의하기
          </Link>
          <button
            type="button"
            onClick={(e) => openModal('FEEDBACK', undefined, e)}
            className="text-gray-5 p-2 text-[16px] transition-colors hover:text-gray-900"
          >
            피드백남기기
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
