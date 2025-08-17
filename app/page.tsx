'use client';

import React, { useEffect } from "react";
import { AiFillFileAdd } from "react-icons/ai";
import { AiFillFolderAdd } from "react-icons/ai";
import ContentCard from "./modules/ContentCard"
import { restoreContents } from "./action_state/action/content";
import { Content } from "./models/contents";
import ContentState from "./action_state/state/content_state";

export default function Home() {
  const COL_NUM = 8; // 1行に表示するフォルダとファイルの数

  const initFlag = React.useRef<boolean>(true);
  useEffect(() => {
    if (initFlag.current) {
      restoreContents();
      initFlag.current = false;
    }
  }, []);


  const [contents, setContents] = React.useState<Content[]>([]);
  useEffect(() => {
    const contentState = ContentState.getInstance();
    const updateContents = ({ contents }: { contents: Content[] }) => {
      setContents(contents);
    }
    contentState.subscribe(updateContents);

    return () => {
      contentState.unsubscribe(updateContents);
    }
  }, []);

  
  // ファイルコンポーネントを一覧
  const contentEls = () => {
    const contentEl = [];
    
    for(let i=0; i<contents.length; i+=COL_NUM){
      let row = [];
      for(let j=0; j<COL_NUM; j++){
          // 左詰めになるように空の要素を挿入
          if(i+j>=contents.length){
            row.push(<div className="w-1/8 h-full" key={i*COL_NUM+j}/>)
            continue
          }

        row.push(
          <ContentCard
            key={contents[i+j].id}
            name={"File " + (i+j+1)}
            onClick={() => console.log(`Clicked`)}
            onDoubleClick={() => console.log(`Double Clicked `)}
          />
        );
      }

      contentEl.push(
        <div className="w-full flex justify-start items-center" key={`row-${i}`}>
          {row}
        </div>);
    }
    return contentEl;
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
            
            {contentEls()}

          </div>

          {/* サイドバー */}
          <div className="relative w-1/12 h-full p-4 flex flex-col-reverse gap-8 justify-start items-center">
            <AiFillFileAdd size={64} color="#797979" className="cursor-pointer"/>
          </div>
        </div>
      </div>

    </div>
  );
}
