'use client';

import React, { useEffect } from "react";
import { AiFillFileAdd } from "react-icons/ai";
import ContentCard from "./modules/ContentCard"
import NewContentDialog from "./modules/NewContentDialog";
import { MdDelete, MdEdit } from "react-icons/md";
import RenameDialog from "./modules/RenameContentDialog";
import { useRouter } from "next/navigation";
import { createContent, deleteContent, renameContent, restoreContents } from "@/app/action_state/action/content";
import ContentState from "@/app/action_state/state/content_state";
import ConfirmDialog from "../_common/ConfirmDialog";
import { Content } from "@/app/infra/models/contents";

export default function HomePage() {
  const router = useRouter();

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
      setContents([...contents]);
    }
    contentState.subscribe(updateContents);

    return () => {
      contentState.unsubscribe(updateContents);
    }
  }, []);

  const [selectedContent, setSelectedContent] = React.useState<Content | null>(null);
  const [newContentDialogOpen, setNewContentDialogOpen] = React.useState<boolean>(false);
  const [editContentDialogOpen, setEditContentDialogOpen] = React.useState<boolean>(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = React.useState<boolean>(false);

  
  // ファイルコンポーネントを一覧
  const contentEls = () => {
    const contentEl = [];
    
    for(let i=0; i<contents.length; i+=COL_NUM){
      let row = [];
      for(let j=0; j<COL_NUM; j++){
          // 左詰めになるように空の要素を挿入
          if(i+j>=contents.length){
            row.push(<div className="w-1/8 h-full" key={i+j}/>)
            continue
          }

        row.push(
          <ContentCard
            key={contents[i+j].id}
            name={contents[i+j].name}
            onClick={() => {setSelectedContent(contents[i+j])}}
            onDoubleClick={() => {
              router.push(`/editor?id=${contents[i+j].id}`);
            }}
            isSelected={selectedContent?.id === contents[i+j].id}
          />
        );
      }

      contentEl.push(
        <div className="w-full flex justify-start items-center gap-4" key={`row-${i}`}>
          {row}
        </div>);
    }
    return contentEl;
  }


  return (
    <div className="absolute  bg-[url('/images/black_bg.jpg')] bg-cover bg-center top-0 left-0 bottom-0 right-0 overflow-hidden">
      <div className="absolute top-0 left-0 bottom-0 right-0 ">

      {/* コンテンツ */}
      <div className="absolute flex flex-col top-0 left-0 bottom-0 right-0 p-4">
        {/* ヘッダー */}
        <div className="relative w-full h-[2rem] flex gap-1 items-center mb-8">
          <div className={`ml-8 text-white font-bold text-[2rem]`}>Contents</div>
        </div>

        {/* メインコンテンツ */}
        <div className="relative w-full h-full grow flex">
          {/* ファイル＆フォルダ */}
          <div className="relative w-11/12 h-full p-2 flex flex-col gap-8 justify-start items-start ">
            
            {contentEls()}

          </div>

          {/* サイドバー */}
          <div className="relative w-1/12 h-full p-4 flex flex-col-reverse gap-8 justify-start items-center">

            <AiFillFileAdd size={52} color="#FFFFFF" className="cursor-pointer"
              onClick={()=>{setNewContentDialogOpen(true)}}/>

            {selectedContent && <>
            
            <MdEdit size={52} color="#FFFFFF" className="cursor-pointer"
              onClick={()=>{setEditContentDialogOpen(true)}}/>

            <MdDelete size={52} color="#FFFFFF" className="cursor-pointer"
              onClick={()=>{setConfirmDeleteDialogOpen(true)}}/>
            
            </>}

          </div>
        </div>

        </div>
      </div>

      <NewContentDialog 
        isOpen={newContentDialogOpen} 
        onClose={function (): void {
          setNewContentDialogOpen(false);
        }} 
        onCreate={function (name: string): void {
          createContent({name: name});
          setNewContentDialogOpen(false);
        }}/>

      <RenameDialog
        isOpen={editContentDialogOpen}
        onClose={() => setEditContentDialogOpen(false)}
        currentName={selectedContent?.name}
        onRename={(name: string) => {
          renameContent({
            contentId: selectedContent?.id ?? "",
            name: name
          });
          setEditContentDialogOpen(false);
        }}
      />

      <ConfirmDialog
        isOpen={confirmDeleteDialogOpen}
        title="コンテンツを削除する"
        message="本当に削除しますか？復元はできません。"
        onConfirm={() => { 
          setConfirmDeleteDialogOpen(false);
          deleteContent({contentId: selectedContent?.id ?? ""});
          setSelectedContent(null);
        }} 
        onCancel={function (): void {
          setConfirmDeleteDialogOpen(false);
        } }/>

    </div>
  );
}
