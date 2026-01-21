import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="border-gray-1 sticky top-0 right-0 left-0 flex h-15 items-center justify-center border-b bg-white">
      <div className="mx-5 my-2.5 flex w-300 items-center justify-between sm:mx-12.5 lg:mx-42.5">
        <Link href="/" className="shrink-0">
          <Image src="/logo.svg" alt="Mingling Logo" width={112} height={40} priority />
        </Link>
        <nav className="hidden items-center gap-2.5 sm:flex">
          <Link href="/" className="text-gray-5 p-2 text-[16px]">
            문의하기
          </Link>
          <Link href="/" className="text-gray-5 p-2 text-[16px]">
            피드백남기기
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
