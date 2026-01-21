export default function Home() {
  return (
    <div className="flex h-screen justify-center gap-10 bg-slate-950">
      <div className="flex flex-col gap-5 text-white">
        <h1 className="py-4 text-3xl font-bold text-white">타이포그래피 세팅</h1>
        <h3 className="text-2xl font-thin">안녕, 세계!!</h3>
        <h3 className="text-2xl font-extralight">안녕, 세계!!</h3>
        <h3 className="text-2xl font-light">안녕, 세계!!</h3>
        <h3 className="text-2xl font-normal">안녕, 세계!!</h3>
        <h3 className="text-2xl font-medium">안녕, 세계!!</h3>
        <h3 className="text-2xl font-semibold">안녕, 세계!!</h3>
        <h3 className="text-2xl font-bold">안녕, 세계!!</h3>
        <h3 className="text-2xl font-extrabold">안녕, 세계!!</h3>
        <h3 className="text-2xl font-black">안녕, 세계!!</h3>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="py-4 text-3xl font-bold text-white">컬러 세팅</h1>
        <div className="flex gap-5">
          <div className="flex flex-col gap-2">
            <div className="bg-blue-1 h-6 w-6 rounded-sm"></div>
            <div className="bg-blue-2 h-6 w-6 rounded-sm"></div>
            <div className="bg-blue-3 h-6 w-6 rounded-sm"></div>
            <div className="bg-blue-4 h-6 w-6 rounded-sm"></div>
            <div className="bg-blue-5 h-6 w-6 rounded-sm"></div>
            <div className="bg-blue-8 h-6 w-6 rounded-sm"></div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-6 w-6 rounded-sm bg-white"></div>
            <div className="bg-gray-1 h-6 w-6 rounded-sm"></div>
            <div className="bg-gray-2 h-6 w-6 rounded-sm"></div>
            <div className="bg-gray-3 h-6 w-6 rounded-sm"></div>
            <div className="bg-gray-4 h-6 w-6 rounded-sm"></div>
            <div className="bg-gray-5 h-6 w-6 rounded-sm"></div>
            <div className="bg-gray-6 h-6 w-6 rounded-sm"></div>
            <div className="bg-gray-7 h-6 w-6 rounded-sm"></div>
            <div className="bg-gray-8 h-6 w-6 rounded-sm"></div>
            <div className="bg-gray-9 h-6 w-6 rounded-sm"></div>
            <div className="bg-gray-10 h-6 w-6 rounded-sm"></div>
          </div>

          <div className="bg-error h-6 w-6 rounded-sm"></div>
        </div>
      </div>
    </div>
  );
}
