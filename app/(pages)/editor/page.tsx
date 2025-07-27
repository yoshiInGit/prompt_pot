'use client';

import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { VscPreview } from "react-icons/vsc";
import { GoCpu } from "react-icons/go";
import AdditionalPromptCard from "./modules/AdditionalPromptCard";
import ResourceTile from "./modules/ResouceTile";

const Editor = () => {
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
                <div className="w-full h-1/2 overflow-hidden flex p-2">
                    {/* リソースリスト */}
                    <div className="w-2/3 flex flex-col pr-2">
                        <ResourceTile/>
                        <ResourceTile/>
                        <ResourceTile/>
                        <ResourceTile
                            type="file"/>

                    </div>

                    {/* リソースプレビュー */}
                    <div className="w-3/5 h-full bg-white shadow flex flex-col p-2 rounded">
                        <div className="flex items-center mb-2">
                            <VscPreview size={16}/>
                            <div className="text-gray-600 ml-2">Resource Preview</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* プレビュー画面 */}
            <div className="w-4/10 h-full overflow-hidden flex flex-col">
                <div className="flex-grow bg-white shadow-md p-2 rounded flex flex-col">
                </div>
            </div>
        </div>
    )
}

export default Editor