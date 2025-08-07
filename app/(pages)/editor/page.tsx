'use client';

import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { GoCpu } from "react-icons/go";
import {FaCopy } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import AdditionalPromptCard from "./modules/AdditionalPromptCard";
import PrevHighlightCard from "./modules/PrevHighlightCard";
import { useEffect, useRef} from "react";
import {restoreFolder} from "../../action_state/_action/resouce";
import ResourceList from "./section/ResourceList";
import ResourcePreview from "./section/ResourcePreview";

const Editor = () => {
    // データの復元
    const initFlag = useRef<boolean>(true);
    useEffect(() => {
        if(initFlag.current){
            // リソースの復元
            restoreFolder();
            initFlag.current = false;
        }
    }, []);

    return(
        <div className="absolute top-0 left-0 bottom-0 right-0 overflow-hidden flex bg-gray-200 p-4">
            
            {/* エディター画面 */}
            <div className="w-6/10 h-full overflow-hidden flex flex-col">
                {/* プロンプトエリア */}
                <div className="w-full h-1/2 overflow-hidden flex">
                    {/* ベースプロンプト */}
                    <div className="w-5/10 h-full bg-white shadow-md p-4 rounded flex flex-col">
                        <div className="flex items-center mb-2">
                            <GoCpu size={16}/>
                            <div className="text-gray-600 ml-2">Base Prompt</div>
                        </div>

                        <textarea 
                                className="flex-1 bg-white border text-sm border-white focus:border-white focus:outline-none resize-none rounded"
                                placeholder="このTextAreaはflexコンテナ内で最大限大きくなります..."
                        ></textarea>

                    </div>
                    {/* アディクションプロンプロ */}
                    <div className="relative flex-grow h-full">
                        <div className="absolute w-full h-full flex flex-col gap-2 px-2">
                                <AdditionalPromptCard />
                                <AdditionalPromptCard />
                                <AdditionalPromptCard />
                        </div>

                    </div>
                    {/* 実行ボタン */}
                    <div className="w-1/25 h-full flex items-center justify-center bg-white shadow-md mr-2 rounded-r-lg cursor-pointer">
                        <MdKeyboardDoubleArrowRight size={28} color="gray"/>
                    </div>
                </div>

                {/* リソースエリア */}
                <div className="w-full h-1/2 overflow-hidden flex pr-2 pt-2">
                    {/* リソースリスト */}
                    <ResourceList/>

                    {/* リソースプレビュー */}
                    <ResourcePreview/>
                </div>
            </div>

            {/* プレビュー画面 */}
            <div className="w-4/10 h-full overflow-hidden flex flex-col">
                <div className="flex-grow bg-white shadow-md p-4 rounded flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <div className="text-gray-600 font-bold">Preview</div>
                            <div className="grow"/>
                            <FaCopy size={20} className="text-gray-600 cursor-pointer hover:text-gray-800"/>
                            <IoMdDownload size={20} className="text-gray-600 cursor-pointer hover:text-gray-800"/>
                        </div>

                        <PrevHighlightCard />

                        <div className="grow w-full">
                            
                        </div>
                </div>
            </div>
        </div>
    )
}

export default Editor