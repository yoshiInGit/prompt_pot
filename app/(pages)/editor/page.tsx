'use client';

import {FaCopy } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import PrevHighlightCard from "./modules/PrevHighlightCard";
import { useEffect, useRef} from "react";
import {restoreFolder} from "../../action_state/_action/resouce";
import ResourceList from "./section/ResourceList";
import ResourcePreview from "./section/ResourcePreview";
import PromptArea from "./section/PromptArea";
import { restorePrompts } from "@/app/action_state/_action/prompt";

const Editor = () => {
    // データの復元
    const initFlag = useRef<boolean>(true);
    useEffect(() => {
        if(initFlag.current){
            // リソースの復元
            restoreFolder();
            restorePrompts();
            initFlag.current = false;
        }
    }, []);

    return(
        <div className="absolute top-0 left-0 bottom-0 right-0 overflow-hidden flex bg-gray-200 p-4">
            
            {/* エディター画面 */}
            <div className="w-6/10 h-full overflow-hidden flex flex-col">
                
                {/* プロンプトエリア */}
                <div className="w-full h-1/2 overflow-hidden flex">
                    <PromptArea/>
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