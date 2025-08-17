'use client';

import React from "react";
import { AiFillFileAdd } from "react-icons/ai";
import { AiFillFolderAdd } from "react-icons/ai";
import File from "./modules/File"
import Folder from "./modules/Folder"

export default function Home() {

  // TODO 仮のフォルダデータとファイルデータ
  const [folderData, setFolderData] = React.useState([1,2,3,4,5,6,7,8,9,10]);
  const [fileData, setFileData] = React.useState([1,1,1,1,1,1,1,1,1,1,1]);


  const COL_NUM = 8; // 1行に表示するフォルダとファイルの数

  // フォルダコンポーネントを一覧
  const folderEls = () =>{
     const folderEl = [];
     
     for(let i=0; i<folderData.length; i+=COL_NUM){
        let row = [];
        for(let j=0; j<COL_NUM; j++){
          
          // 左詰めになるように空の要素を挿入
          if(i+j>=folderData.length){
            row.push(<div className="w-1/8 h-full"/>)
            continue
          }

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
          <div className="w-full flex justify-start items-center ">
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
      for(let j=0; j<COL_NUM; j++){
          // 左詰めになるように空の要素を挿入
          if(i+j>=folderData.length){
            row.push(<div className="w-1/8 h-full"/>)
            continue
          }

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
        <div className="w-full flex justify-start items-center ">
          {row}
        </div>);
    }
    return fileEl;
  }


  return (
    <div className="absolute bg-gray-200 top-0 left-0 bottom-0 right-0 overflow-hidden">

      {/* コンテンツ */}
      <div className="absolute flex flex-col top-0 left-0 bottom-0 right-0 p-4">
        {/* ヘッダー */}
        <div className="relative w-full h-[2rem] flex gap-1 items-center mb-8">
          <div className={`ml-8 text-gray-600 font-bold text-[2rem]`}>Contents</div>
        </div>

        {/* メインコンテンツ */}
        <div className="relative w-full h-full grow flex">
          {/* ファイル＆フォルダ */}
          <div className="relative w-11/12 h-full p-2 flex flex-col gap-8 justify-start items-start ">
            
            {folderEls()}
            {fileEls()}

          </div>

          {/* サイドバー */}
          <div className="relative w-1/12 h-full p-4 flex flex-col-reverse gap-8 justify-start items-center">
            <AiFillFileAdd size={64} color="#797979" className="cursor-pointer"/>
            <AiFillFolderAdd size={72} color="#797979" className="cursor-pointer"/>
          </div>
        </div>
      </div>

    </div>
  );
}
