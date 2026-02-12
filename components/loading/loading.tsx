'use client';

import Image from 'next/image';

export default function Loading() {
  return (
    <div className="lg:h-[533px] md:h-[493px] h-[413px] lg:mt-25 md:mt-20 mt-15 flex flex-col items-center  justify-center gap-[37px]" >
        <div className="flex  flex-col items-center justify-center">
            <span className="text-[24px] leading-[1.364] font-semibold tracking-[-2.3%] text-center text-gray-10 ">밍글링이 중간 위치를 <br/> 열심히 찾아보고 있어요!</span>
        </div>
        <div className="flex flex-col items-center justify-center">
        <Image src="/images/loding.jpg" alt="logo" width={360} height={232} />
        </div>
    </div>
  );
}