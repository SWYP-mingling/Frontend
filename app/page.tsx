'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center mx-[71.73px] md:px-[101px] lg:mx-42.5 mt-30">

 
          <div className="flex flex-col items-center">
            <h1 className="text-gray-8 text-[28px] md:text-[40px] font-bold leading-[1.3] tracking-[-1.128px] text-center max-w-[209px] md:max-w-full">
              모임 장소 선정, 출발역만 넣으면 끝!
            </h1>
            <div className="flex flex-col items-center mt-4">
              <p className="text-gray-5 text-[16px] md:text-[22px] font-semibold leading-[1.364] tracking-[-0.4268px] text-center max-w-[212px] md:max-w-[478px]">
                참석자들이 지하철 출발역을 입력하면, 이동시간과 편차를 분석해 서울 내 최적의 번화가를 추천합니다
              </p>
            </div>
        
          <Link
            href="/create"
            className="mt-7.5 bg-blue-5 text-white h-12 w-[196px] rounded-[8px] flex items-center justify-center text-[18px] font-semibold leading-[1.445] tracking-[-0.0036px] hover:bg-blue-8 transition-colors"
          >
            모임 만들기
          </Link>
          <div className='mt-[74px] md:mt-[74px] lg:mt-10'>
            <Image 
              src="/images/light.png" 
              alt="image" 
              width={860} 
              height={635} 
              className=" lg:max-w-[860px] md:max-w-[658px] max-w-[216.54px] h-auto"
            />
          </div>
        </div>
      </section>

      {/* Concerns Section */}
      <section
      style={{
        background:
          'radial-gradient(105.9% 65.99% at 50.04% 65.99%, rgba(107, 191, 255, 0.50) 0%, rgba(107, 191, 255, 0.00) 100%), #FFF',
      }}
        className="flex flex-col items-center lg:mt-[166.56px] md:mt-[213.81px] mt-[213px]">
         <h2 className="text-gray-8 text-[32px] md:text-[38px] lg:text-[40px] font-bold leading-[1.3] tracking-[-1.128px] text-center px-5">
            이런 고민, 해보신 적 있으신가요?
          </h2>

          <div className="flex flex-col items-center w-full max-w-full overflow-hidden">
            <TooltipProvider>
              <div className="w-full opacity-80 md:mt-[62px] md:mb-[62px] overflow-hidden">
                <div className="flex gap-7.5 items-center animate-slide-smooth">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-white px-6.25 py-3.5 rounded-[10px] cursor-pointer shrink-0">
                        <p className="text-blue-5 text-[20px] font-semibold leading-[1.4] tracking-[-0.24px] text-center whitespace-nowrap">
                          멀리 사는 친구가 이동하기에 여기는 괜찮을까?
                        </p>
                      </div>
                    </TooltipTrigger>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-white px-6.25 py-3.5 rounded-[10px] cursor-pointer shrink-0">
                        <p className="text-blue-5 text-[20px] font-semibold leading-[1.4] tracking-[-0.24px] text-center whitespace-nowrap">
                          내 마음대로 정하면 불공평하다 느끼는 사람은 없을까?
                        </p>
                      </div>
                    </TooltipTrigger>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-white px-6.25 py-3.5 rounded-[10px] cursor-pointer shrink-0">
                        <p className="text-blue-5 text-[20px] font-semibold leading-[1.4] tracking-[-0.24px] text-center whitespace-nowrap">
                          모든 참석자를 배려하고 싶어
                        </p>
                      </div>
                    </TooltipTrigger>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-white px-6.25 py-3.5 rounded-[10px] cursor-pointer shrink-0">
                        <p className="text-blue-5 text-[20px] font-semibold leading-[1.4] tracking-[-0.24px] text-center whitespace-nowrap">
                          중간지점이 맞긴한데, 여긴 뭐 할게 없는데?
                        </p>
                      </div>
                    </TooltipTrigger>
                  </Tooltip>

                  {/* 중복된 아이템들로 무한 스크롤 효과 */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-white px-6.25 py-3.5 rounded-[10px] cursor-pointer shrink-0">
                        <p className="text-blue-5 text-[20px] font-semibold leading-[1.4] tracking-[-0.24px] text-center whitespace-nowrap">
                          멀리 사는 친구가 이동하기에 여기는 괜찮을까?
                        </p>
                      </div>
                    </TooltipTrigger>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-white px-6.25 py-3.5 rounded-[10px] cursor-pointer shrink-0">
                        <p className="text-blue-5 text-[20px] font-semibold leading-[1.4] tracking-[-0.24px] text-center whitespace-nowrap">
                          내 마음대로 정하면 불공평하다 느끼는 사람은 없을까?
                        </p>
                      </div>
                    </TooltipTrigger>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-white px-6.25 py-3.5 rounded-[10px] cursor-pointer shrink-0">
                        <p className="text-blue-5 text-[20px] font-semibold leading-[1.4] tracking-[-0.24px] text-center whitespace-nowrap">
                          모든 참석자를 배려하고 싶어
                        </p>
                      </div>
                    </TooltipTrigger>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-white px-6.25 py-3.5 rounded-[10px] cursor-pointer shrink-0">
                        <p className="text-blue-5 text-[20px] font-semibold leading-[1.4] tracking-[-0.24px] text-center whitespace-nowrap">
                          중간지점이 맞긴한데, 여긴 뭐 할게 없는데?
                        </p>
                      </div>
                    </TooltipTrigger>
                  </Tooltip>
                </div>
              </div>
            </TooltipProvider>



          <div className="flex flex-col md:flex-row gap-2.25 items-center justify-center mb-[72px] px-5 md:px-0">
            <div className="bg-white border-2 border-gray-2 h-[236px] rounded-[20px] lg:max-w-[280px] max-w-[247px] md:max-w-[247px] flex flex-col items-center justify-center gap-7.75 px-5">
              <h3 className="text-gray-10 text-[22px] font-semibold leading-[1.364] tracking-[-0.4268px] text-center">
                참석자별 이동시간 계산
              </h3>
              <div className="flex flex-col items-center gap-0">
                <p className="text-gray-9 text-[16px] font-normal leading-[1.625] tracking-[0.0912px] text-center">
                  출발지에서 후보 장소까지 이동시간을 일일이 확인하기
                </p>
              </div>
            </div>
            <div className="bg-white border-2 border-gray-2 h-[236px] rounded-[20px] w-full max-w-[247px] md:max-w-[280px] flex flex-col items-center justify-center gap-7.75 px-5">
              <h3 className="text-gray-10 text-[22px] font-semibold leading-[1.364] tracking-[-0.4268px] text-center">
                적합한 위치 탐색
              </h3>
              <div className="flex flex-col items-center gap-0">
                <p className="text-gray-9 text-[16px] font-normal leading-[1.625] tracking-[0.0912px] text-center">
                  위치가 중간인 것보다 중요한건 공평함인데!
                </p>
              </div>
            </div>
            <div className="bg-white border-2 border-gray-2 h-[236px] rounded-[20px] w-full max-w-[247px] md:max-w-[280px] flex flex-col items-center justify-center gap-7.75 px-5">
              <h3 className="text-gray-10 text-[22px] font-semibold leading-[1.364] tracking-[-0.4268px] text-center">
                모임 목적에 맞는 공간은?
              </h3>
              <div className="flex flex-col items-center gap-0">
                <p className="text-gray-9 text-[16px] font-normal leading-[1.625] tracking-[0.0912px] text-center">
                  장소만 중간이면 안돼. 먹을 것, 놀거리가 있어야 해!
                </p>
              </div>
            </div>
          </div>
        </div>




        <div className="bg-gray-8 flex flex-col items-center justify-center h-[216px] w-full">
          <div className="flex flex-col items-center gap-0 md:max-w-[700px] max-w-[300px]">
            <p className="text-white text-[18px] md:text-[24px] font-bold leading-[1.334] tracking-[-0.552px] text-center">
              배려 없는 선택은 피하고 싶기에, 우리는 이동시간·대중교통·출발지를 고려하며 위치 선정에 많은 시간을 소비하게 됩니다
            </p>
          </div>
        </div>
       
      </section>

      {/* Solution Section */}
      <section className="flex flex-col items-center gap-4 md:py-30 py-20 px-5 md:px-12.5 lg:px-42.5">
        <h2 className="text-gray-8 text-[32px] md:text-[38px] lg:text-[40px] font-bold leading-[1.3] tracking-[-1.128px] text-center">
          밍글링이 제안하는 새로운 방법
        </h2>
        <div className="flex flex-col items-center gap-0 max-w-[320px] md:max-w-[429px] lg:max-w-full">
          <p className="text-gray-5 text-[18px] md:text-[22px] font-semibold leading-[1.364] tracking-[-0.4268px] text-center">
            복잡한 계산은 우리가 할게요. 각자의 출발역을 넣고, 제안받은 번화가 중에서 선택만 하세요!
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="flex flex-col items-center gap-20 py-20 px-5 md:px-12.5 lg:px-42.5">
        {/* Feature 1: 공평한 중간지점 계산 */}
        <div className="flex gap-10 md:gap-39.25 items-center justify-center max-w-[1200px] w-full flex-col md:flex-row">
          <div className="flex flex-col gap-6 md:gap-11 items-start w-full max-w-[320px] md:max-w-[354px]">
            <div className="flex flex-col gap-1.25 items-start w-full">
              <h3 className="text-gray-8 text-[30px] md:text-[28px] font-bold leading-[1.358] tracking-[-0.6608px]">
                공평한 중간지점 계산
              </h3>
              <p className="text-gray-6 text-[16px] font-normal leading-[1.625] tracking-[0.0912px]">
                출발지를 기반으로 최적의 중간 지점을 계산합니다
              </p>
            </div>
            <div className="flex gap-2.5 items-center flex-wrap">
              <div className="bg-gray-1 px-2.5 py-1.25 rounded-[5px]">
                <p className="text-gray-6 text-[16px] font-normal leading-[1.625] tracking-[0.0912px]">
                  이동 시간이 비슷한 위치
                </p>
              </div>
              <div className="bg-gray-1 px-2.5 py-1.25 rounded-[5px]">
                <p className="text-gray-6 text-[16px] font-normal leading-[1.625] tracking-[0.0912px]">
                  환승 효율을 고려한 위치
                </p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[360px] md:w-[360px] h-auto md:h-[360px]">
          <Image src="/images/Rendering1.jpg" alt="map" width={360} height={360} className="w-full h-auto" />       
          </div>
        </div>

        {/* Feature 2: 즐겁게 밍글링할 위치 추천 */}
        <div className="flex gap-10 md:gap-37.75 items-center justify-center max-w-[1200px] w-full flex-col md:flex-row">
        <div className="w-full max-w-[320px] md:w-[360px] h-auto md:h-[360px] order-2 md:order-1">
          <Image src="/images/Rendering2.jpg" alt="map" width={360} height={360} className="w-full h-auto" />       
          </div>
          <div className="flex flex-col gap-6.25 items-start w-full max-w-[320px] md:max-w-[277px] order-1 md:order-2">
            <div className="flex flex-col gap-1.25 items-start">
              <h3 className="text-gray-8 text-[30px] md:text-[28px] font-bold leading-[1.358] tracking-[-0.6608px]">
                즐겁게 밍글링할 위치 추천
              </h3>
              <div className="flex flex-col items-start gap-0">
                <p className="text-gray-6 text-[16px] font-normal leading-[1.625] tracking-[0.0912px]">
                  만나서 함께 즐길 장소가 많아야하니까! 중간 번화가 Top3를 추천해드립니다
                </p>
              </div>
            </div>
            <p className="text-error text-[12px] font-normal leading-[1.334] tracking-[0.3024px]">
              번화가는 서울지역 내로 한정됩니다
            </p>
          </div>
        </div>

        {/* Feature 3: 모임 목적별 장소 추천 */}
        <div className="flex gap-10 md:gap-10.75 items-center justify-center max-w-[1200px] w-full flex-col md:flex-row">
          <div className="flex flex-col gap-6 md:gap-11 items-start w-full max-w-[320px] md:max-w-[450px]">
            <div className="flex flex-col gap-1.25 items-start w-full md:w-[271px]">
              <h3 className="text-gray-8 text-[30px] md:text-[28px] font-bold leading-[1.358] tracking-[-0.6608px]">
                모임 목적별 장소 추천
              </h3>
              <p className="text-gray-6 text-[16px] font-normal leading-[1.625] tracking-[0.0912px]">
                모임 목적에 맞는 장소 리스트를 제공합니다
              </p>
            </div>
            <div className="flex gap-3 items-center overflow-x-auto w-full pb-2">
              {['식당', '놀거리', '카페', '술집', '장소대여'].map((category) => (
                <div
                  key={category}
                  className="bg-white flex gap-1 h-8 items-center justify-center px-3 rounded-[50px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.06)] shrink-0"
                >
                  <p className="text-gray-10 text-[14px] font-semibold leading-[1.571] tracking-[0.203px]">
                    {category}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full max-w-[320px] md:w-[360px] h-auto md:h-[360px]">
          <Image src="/images/Rendering3.jpg" alt="map" width={360} height={360} className="w-full h-auto" />       
          </div>
        </div>
        
      </section>

      {/* CTA Section */}
      <section className="flex flex-col items-center py-30 px-5 md:px-12.5 lg:px-42.5">
        <div
          className="border-2 border-blue-3 flex flex-col items-start overflow-hidden px-5 md:px-12 py-8.25 rounded-[10px] w-full max-w-[320px] md:max-w-[720px] lg:max-w-[860px] relative"
          style={{
            backgroundImage:
              'linear-gradient(171.979deg, rgb(4, 161, 254) 20.741%, rgb(0, 94, 255) 128.77%)',
          }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full relative z-10 gap-4 md:gap-0">
            <div className="flex flex-col gap-0.75 items-start w-full md:w-[331px]">
              <p className="text-gray-2 text-[18px] font-semibold leading-[1.445] tracking-[-0.0036px]">
                오프라인 모임을 더욱 간편하게!
              </p>
              <p className="text-white text-[28px] font-bold leading-[1.358] tracking-[-0.6608px]">
                지금, 밍글링과 함께 시작하세요
              </p>
            </div>
            <Link
              href="/create"
              className="bg-white h-12 rounded-[46px] w-full md:w-[142px] flex items-center justify-center text-blue-5 text-[20px] font-semibold leading-[1.4] tracking-[-0.24px] hover:bg-gray-1 transition-colors"
            >
              지금 시작하기
            </Link>
          </div>
          <div className="absolute inset-[-2px] pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_60px_10px_rgba(255,255,255,0.25)]" />
        </div>
      </section>
    </div>
  );
} 
