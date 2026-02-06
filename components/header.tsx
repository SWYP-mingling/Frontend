'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="border-gray-1 top-0 right-0 left-0 flex h-15 items-center justify-center border-b bg-white">
      <div className="mx-5 my-2.5 flex w-300 items-center justify-between md:mx-12.5 lg:mx-42.5">
        <Link href="/" className="shrink-0">
          <Image src="/logo.svg" alt="Mingling Logo" width={112} height={40} priority />
        </Link>

        <nav className="flex items-center gap-2.5">
          <Link href="/" className="text-gray-5 hidden p-2 text-[16px] md:block">
            문의하기
          </Link>
          <Link
            href="/create"
            className="bg-blue-5 hover:bg-blue-8 flex w-25 items-center justify-center rounded-[8px] p-2 text-[14px] font-semibold text-white transition-colors"
          >
            모임 만들기
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
