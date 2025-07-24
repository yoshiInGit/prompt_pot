'use client';

import Image from "next/image";
import { Audiowide } from "next/font/google";
import Folder from "./modules/Folder";
import File from "./modules/File";
import React from "react";
import { AiFillFileAdd } from "react-icons/ai";
import { AiFillFolderAdd } from "react-icons/ai";

const AudiWideFont = Audiowide({
  weight: "400"
});

export default function Home() {

  // TODO 仮のフォルダデータとファイルデータ
  const [folderData, setFolderData] = React.useState([1,1,1,1,1,1,1,1,]);
  const [fileData, setFileData] = React.useState([1,1,1,1,1,1,1,1,]);

  const COL_NUM = 6; // 1行に表示するフォルダとファイルの数

  // フォルダコンポーネントを一覧
  const folderEls = () =>{
     const folderEl = [];
     
     for(let i=0; i<folderData.length; i+=COL_NUM){
        let row = [];
        for(let j=0; j<COL_NUM && i+j<folderData.length; j++){
          row.push(
            <Folder
              key={i+j}
              name={"Folder " + (i+j+1)}
              onClick={() => console.log(`Clicked`)}
              onDoubleClick={() => console.log(`Double Clicked `)}
            />
          );
        }

        folderEl.push(
          <div className="w-full flex justify-start items-center gap-8">
            {row}
          </div>
        );
     }

     return folderEl;
  }
  // ファイルコンポーネントを一覧
  const fileEls = () => {
    const fileEl = [];
    
    for(let i=0; i<fileData.length; i+=COL_NUM){
      let row = [];
      for(let j=0; j<COL_NUM && i+j<fileData.length; j++){
        row.push(
          <File
            key={i+j}
            name={"File " + (i+j+1)}
            onClick={() => console.log(`Clicked`)}
            onDoubleClick={() => console.log(`Double Clicked `)}
          />
        );
      }

      fileEl.push(
        <div className="w-full flex justify-start items-center gap-8">
          {row}
        </div>);
    }
    return fileEl;
  }


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
      <div className="absolute flex flex-col top-0 left-0 bottom-0 right-0 p-4">
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

        {/* メインコンテンツ */}
        <div className="relative w-full h-full grow flex">
          {/* ファイル＆フォルダ */}
          <div className="relative w-11/12 h-full p-2 flex flex-wrap gap-8 justify-start items-start ">
            
            {folderEls()}
            {fileEls()}

          </div>

          {/* サイドバー */}
          <div className="relative w-1/12 h-full p-4 flex flex-col-reverse gap-8 justify-start items-center">
            <AiFillFileAdd size={70} color="white" className="cursor-pointer"/>
            <AiFillFolderAdd size={80} color="white" className="cursor-pointer"/>
          </div>
        </div>
      </div>

    </div>
  );
}
