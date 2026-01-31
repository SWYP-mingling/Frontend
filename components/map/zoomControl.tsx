import Image from 'next/image';

const ZoomControl = ({ map }: { map: kakao.maps.Map | null }) => {
  const zoomIn = () => {
    if (!map) return;
    map.setLevel(map.getLevel() - 1, { animate: true });
  };

  const zoomOut = () => {
    if (!map) return;
    map.setLevel(map.getLevel() + 1, { animate: true });
  };

  return (
    <div className="border-gray-4 text-gray-10 absolute right-4 bottom-4 z-10 flex flex-col overflow-hidden rounded border bg-white">
      <button
        type="button"
        onClick={zoomIn}
        className="hover:bg-gray-2 flex h-8 w-8 items-center justify-center"
        aria-label="확대"
      >
        <Image src="/icon/plus.svg" alt="줌인버튼" width={12} height={12} />
      </button>
      <button
        type="button"
        onClick={zoomOut}
        className="hover:bg-gray-2 flex h-8 w-8 items-center justify-center"
        aria-label="축소"
      >
        <Image src="/icon/minus.svg" alt="줌아웃버튼" width={12} height={12} />
      </button>
    </div>
  );
};

export default ZoomControl;
