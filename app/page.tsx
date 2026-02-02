import Link from 'next/link';
import Image from 'next/image';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// --- Data & Constants ---
const CATEGORIES = [
  { id: '식당', label: '식당', icon: '/icon/place/restaurant' },
  { id: '놀거리', label: '놀거리', icon: '/icon/place/play' },
  { id: '카페', label: '카페', icon: '/icon/place/cafe' },
  { id: '술집', label: '술집', icon: '/icon/place/bar' },
  { id: '장소대여', label: '장소대여', icon: '/icon/place/rent' },
];

const PAIN_POINTS = [
  '멀리 사는 친구가 이동하기에 여기는 괜찮을까?',
  '내 마음대로 정하면 불공평하다 느끼는 사람은 없을까?',
  '모든 참석자를 배려하고 싶어',
  '중간지점이 맞긴한데, 여긴 뭐 할게 없는데?',
  '멀리 사는 친구가 이동하기에 여기는 괜찮을까?',
  '내 마음대로 정하면 불공평하다 느끼는 사람은 없을까?',
  '모든 참석자를 배려하고 싶어',
  '중간지점이 맞긴한데, 여긴 뭐 할게 없는데?',
];

const FEATURES = [
  {
    title: '참석자별 이동시간 계산',
    desc: '출발지에서 후보 장소까지 이동시간을 일일이 확인하기',
  },
  {
    title: '적합한 위치 탐색',
    desc: '위치가 중간인 것보다 중요한건 공평함인데!',
  },
  {
    title: '모임 목적에 맞는 공간은?',
    desc: '장소만 중간이면 안돼. 먹을 것, 놀거리가 있어야 해!',
  },
];

// --- Sub Components ---

// 1. 반복되는 툴팁 컴포넌트
const PainPointTooltip = ({ text }: { text: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="shrink-0 cursor-pointer rounded-[10px] bg-white px-6.25 py-3.5">
        <p className="text-blue-5 text-center text-[20px] leading-[1.4] font-semibold tracking-[-0.24px] whitespace-nowrap">
          {text}
        </p>
      </div>
    </TooltipTrigger>
  </Tooltip>
);

// 2. 반복되는 특징 카드 컴포넌트
const FeatureCard = ({ title, desc }: { title: string; desc: string }) => (
  <div className="border-gray-2 flex h-[236px] w-full max-w-[247px] flex-col items-center justify-center gap-7.75 rounded-[20px] border-2 bg-white px-5 md:max-w-[247px] lg:max-w-[280px]">
    <h3 className="text-gray-10 text-center text-[22px] leading-[1.364] font-semibold tracking-[-0.4268px]">
      {title}
    </h3>
    <div className="flex flex-col items-center gap-0">
      <p className="text-gray-9 text-center text-[16px] leading-[1.625] font-normal tracking-[0.0912px]">
        {desc}
      </p>
    </div>
  </div>
);

// --- Sections ---

const HeroSection = () => (
  <section className="mx-[71.73px] mt-30 flex flex-col items-center justify-center md:px-[101px]">
    <div className="flex flex-col items-center">
      <h1 className="text-gray-8 max-w-[209px] text-center text-[28px] leading-[1.3] font-bold tracking-[-1.128px] break-keep md:max-w-full md:text-[40px]">
        모임 장소 선정, 출발역만 넣으면 끝!
      </h1>
      <div className="mt-4 flex flex-col items-center">
        <p className="text-gray-5 max-w-[240px] text-center text-[16px] leading-[1.364] font-semibold tracking-[-0.4268px] break-keep md:max-w-[530px] md:text-[22px]">
          참석자들이 지하철 출발역을 입력하면, 이동시간과 편차를 분석해 서울 내 최적의 번화가를
          추천합니다
        </p>
      </div>

      <Link
        href="/create"
        className="bg-blue-5 hover:bg-blue-8 mt-7.5 flex h-12 w-[196px] items-center justify-center rounded-[8px] text-[18px] leading-[1.445] font-semibold tracking-[-0.0036px] text-white transition-colors"
      >
        모임 만들기
      </Link>

      {/* Responsive Images */}
      <div className="mt-[74px] md:mt-[74px] lg:mt-10">
        <Image
          src="/images/iphone.jpg"
          alt="mobile preview"
          width={860}
          height={635}
          className="block h-auto w-[216.54px] md:hidden"
        />
        <Image
          src="/images/tablet.jpg"
          alt="tablet preview"
          width={860}
          height={635}
          className="hidden h-auto md:block md:w-[658px] lg:hidden lg:w-[860px]"
        />
        <Image
          src="/images/desktop.jpg"
          alt="desktop preview"
          width={860}
          height={635}
          className="hidden h-auto md:w-[658px] lg:block lg:w-[860px]"
        />
      </div>
    </div>
  </section>
);

const PainPointsSection = () => (
  <section
    style={{
      background:
        'radial-gradient(105.9% 65.99% at 50.04% 65.99%, rgba(107, 191, 255, 0.50) 0%, rgba(107, 191, 255, 0.00) 100%), #FFF',
    }}
    className="flex flex-col items-center gap-15.5 pt-[213px] md:mt-[213.81px] lg:mt-[166.56px]"
  >
    <h2 className="text-gray-8 px-5 text-center text-[32px] leading-[1.3] font-bold tracking-[-1.128px] md:text-[38px] lg:text-[40px]">
      이런 고민, 해보신 적 있으신가요?
    </h2>

    {/* Tooltip Slider */}
    <div className="flex w-full max-w-full flex-col items-center overflow-hidden">
      <TooltipProvider>
        <div className="w-full overflow-hidden opacity-80 md:mt-[62px] md:mb-[62px]">
          <div className="animate-slide-smooth flex w-max items-center will-change-transform hover:[animation-play-state:paused]">
            {/* 첫 번째 세트 */}
            <div className="flex shrink-0 gap-7.5 pr-7.5">
              {PAIN_POINTS.map((text, index) => (
                <PainPointTooltip key={`original-${index}`} text={text} />
              ))}
            </div>
            {/* 두 번째 세트 */}
            <div className="flex shrink-0 gap-7.5 pr-7.5">
              {PAIN_POINTS.map((text, index) => (
                <PainPointTooltip key={`copy-${index}`} text={text} />
              ))}
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>

    {/* Feature Cards */}
    <div className="mb-[72px] flex flex-col items-center justify-center gap-2.5 px-5 md:flex-row md:px-0">
      {FEATURES.map((feature, index) => (
        <FeatureCard key={index} title={feature.title} desc={feature.desc} />
      ))}
    </div>

    {/* Section Footer Banner */}
    <div className="bg-gray-8 flex h-[216px] w-full flex-col items-center justify-center">
      <div className="flex max-w-[300px] flex-col items-center gap-0 md:max-w-[592px] lg:max-w-[700px]">
        <p className="text-center text-lg tracking-[-0.552px] text-white md:text-xl md:leading-[1.4] md:font-semibold lg:text-2xl lg:leading-[1.334] lg:font-bold">
          배려 없는 선택은 피하고 싶기에, 우리는 이동시간·대중교통·출발지를 고려하며 위치 선정에
          많은 시간을 소비하게 됩니다
        </p>
      </div>
    </div>
  </section>
);

const SolutionIntroSection = () => (
  <section className="flex flex-col items-center gap-4 px-5 py-20 md:px-12.5 md:py-30 lg:px-42.5">
    <h2 className="text-gray-8 text-center text-[24px] leading-[1.3] font-bold tracking-[-1.128px] md:text-[28px] lg:text-[40px]">
      밍글링이 제안하는 새로운 방법
    </h2>
    <div className="flex w-[320px] flex-col items-center gap-0 md:w-[429px] lg:w-[520px]">
      <p className="text-gray-5 text-center text-[13px] leading-[1.444] font-normal tracking-[-0.2px] md:text-[18px] md:font-semibold lg:text-[22px]">
        복잡한 계산은 우리가 할게요. <br /> 각자의 출발역을 넣고, 제안받은 번화가 중에서 선택만
        하세요!
      </p>
    </div>
  </section>
);

const DetailFeaturesSection = () => (
  <section className="flex flex-col items-center gap-20 px-5 py-20 md:px-8 lg:px-42.5">
    {/* Feature 1: 공평한 중간지점 */}
    <div className="flex w-full max-w-[870px] flex-col-reverse items-center gap-10 md:flex-row md:justify-center">
      <div className="flex w-[320px] flex-col items-center gap-6 text-start md:w-[354px]">
        <div className="flex w-full flex-col gap-1.25">
          <h3 className="text-gray-8 text-[30px] leading-[1.358] font-bold tracking-[-0.6608px] md:text-[28px]">
            공평한 중간지점 계산
          </h3>
          <p className="text-gray-6 text-[16px] leading-[1.625] font-normal tracking-[0.0912px]">
            출발지를 기반으로 최적의 중간 지점을 계산합니다
          </p>
          <div className="flex flex-row justify-start gap-2.5">
            {['이동 시간이 비슷한 위치', '환승 효율을 고려한 위치'].map((tag) => (
              <div key={tag} className="bg-gray-1 mt-3 rounded-[5px] px-2.5 py-1.25">
                <p className="text-gray-6 text-[12px] leading-[1.334] font-normal tracking-[0.0912px]">
                  {tag}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center md:justify-end">
        <Image
          src="/images/Rendering1.jpg"
          alt="feature 1 map"
          width={360}
          height={360}
          className="h-auto md:max-w-[360px]"
        />
      </div>
    </div>

    {/* Feature 2: 번화가 추천 (Order Swap) */}
    <div className="flex w-full max-w-[870px] flex-col items-center gap-10 md:flex-row md:justify-center">
      <Image
        src="/images/Rendering2.jpg"
        alt="feature 2 map"
        width={360}
        height={360}
        className="flex h-auto justify-center md:justify-start"
      />
      <div className="order-1 flex w-[320px] flex-col items-center gap-6.25 text-start md:order-2 md:w-[277px]">
        <div className="flex flex-col items-start justify-start gap-1.25">
          <h3 className="text-gray-8 text-[30px] leading-[1.358] font-bold tracking-[-0.6608px] md:text-[28px]">
            즐겁게 밍글링할 위치 추천
          </h3>
          <div className="flex flex-col items-start gap-0">
            <p className="text-gray-6 text-[16px] leading-[1.625] font-normal tracking-[0.0912px] break-keep">
              만나서 함께 즐길 장소가 많아야하니까!
              <br />
              중간 번화가 Top3를 추천해드립니다
            </p>
          </div>
          <p className="text-error mt-2.5 text-[12px] leading-[1.334] font-normal tracking-[0.3024px]">
            번화가는 서울지역 내로 한정됩니다
          </p>
        </div>
      </div>
    </div>

    {/* Feature 3: 카테고리별 추천 */}
    <div className="flex w-full max-w-[870px] flex-col-reverse items-center gap-10 md:flex-row md:justify-center">
      <div className="flex w-[320px] flex-col items-start gap-3 overflow-hidden md:w-[450px] md:gap-11">
        <div className="flex w-full flex-col items-start gap-1.25">
          <h3 className="text-gray-8 text-[30px] leading-[1.358] font-bold tracking-[-0.6608px] md:text-[28px]">
            모임 목적별 장소 추천
          </h3>
          <p className="text-gray-6 text-[16px] leading-[1.625] font-normal tracking-[0.0912px]">
            모임 목적에 맞는 장소 리스트를 제공합니다
          </p>
        </div>
        <div className="flex w-full items-center gap-3 pb-2">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="flex h-8 shrink-0 items-center justify-center gap-1 rounded-[50px] bg-white px-3 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.06)]"
            >
              <Image src={`${category.icon}.svg`} alt={category.label} width={20} height={20} />
              <p className="text-gray-10 text-[10.5px] leading-[1.571] font-semibold">
                {category.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Image
        src="/images/Rendering3.jpg"
        alt="feature 3 map"
        width={360}
        height={360}
        className="h-auto md:max-w-[360px]"
      />
    </div>
  </section>
);

const CTASection = () => (
  <section className="flex flex-col items-center px-5 py-30 md:px-12.5 lg:px-42.5">
    <div
      className="border-blue-3 relative flex w-full min-w-[320px] flex-col items-start overflow-hidden rounded-[10px] border-2 px-5 py-8.25 md:max-w-[720px] md:px-12 lg:max-w-[860px]"
      style={{
        backgroundImage:
          'linear-gradient(171.979deg, rgb(4, 161, 254) 20.741%, rgb(0, 94, 255) 128.77%)',
      }}
    >
      <div className="relative z-10 flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center md:gap-0">
        <div className="flex w-full flex-col items-start gap-0.75 md:w-[331px]">
          <p className="text-gray-2 text-[14px] leading-[1.445] font-semibold tracking-[-0.0036px] md:text-[18px]">
            오프라인 모임을 더욱 간편하게!
          </p>
          <p className="text-[20px] leading-[1.358] font-bold tracking-[-0.6608px] text-white md:text-[28px]">
            지금, 밍글링과 함께 시작하세요
          </p>
        </div>
        <Link
          href="/create"
          className="text-blue-5 hover:bg-gray-1 flex h-[38px] w-[106px] items-center justify-center rounded-[46px] bg-white text-[14px] leading-[1.4] font-semibold tracking-[-0.24px] transition-colors md:h-12 md:w-[142px] md:text-[20px]"
        >
          지금 시작하기
        </Link>
      </div>
      <div className="pointer-events-none absolute inset-[-2px] rounded-[inherit] shadow-[inset_0px_0px_60px_10px_rgba(255,255,255,0.25)]" />
    </div>
  </section>
);

// --- Main Page Component ---

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <PainPointsSection />
      <SolutionIntroSection />
      <DetailFeaturesSection />
      <CTASection />
    </div>
  );
}
