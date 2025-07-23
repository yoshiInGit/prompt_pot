import Image from "next/image";
import { Audiowide } from "next/font/google";

const AudiWideFont = Audiowide({
  weight: "400"
});

export default function Home() {
  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 overflow-hidden">
      {/* 背景 */}
      <Image
        src="/images/marble_bg.png"
        alt="Hero Image"
        fill
        objectFit="cover"
        className="absolute top-0 left-0 bottom-0 right-0"
      />

      {/* コンテンツ */}
      <div className="absolute top-0 left-0 bottom-0 right-0 p-4">
        {/* ヘッダー */}
        <div className="relative w-full h-[2rem] flex gap-1 items-center">
          <div className="w-12 h-full bg-white"/>
          <div className="w-4 h-full bg-white"/>
          <div className={`text-white text-[2rem] ${AudiWideFont.className}`}>Contents</div>
          <div className="w-2 h-full bg-white"/>
          <div className="w-2 h-full bg-white"/>
          <div className="w-2 h-full bg-white"/>
          <div className="w-64 h-full bg-white"/>
          <div className="h-full grow border-b-2 border-b-white"/>
        </div>
      </div>

    </div>
  );
}
