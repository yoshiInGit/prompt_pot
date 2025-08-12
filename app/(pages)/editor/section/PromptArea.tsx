import { GoCpu } from "react-icons/go";
import AdditionalPromptCard from "../modules/AdditionalPromptCard";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useState, useEffect } from "react";
import { Resource } from "@/app/models/resource";
import PromptState from "@/app/action_state/_state/prompt_state";

const PromptArea = () => {
    const [additionalPrompts, setAdditionalPrompts] = useState<Resource[]>([]);

    useEffect(() => {
        const updatePrompts = ({additionalPrompts}: {additionalPrompts: Resource[]}) => {
            setAdditionalPrompts(additionalPrompts);
        }

        // PromptStateのインスタンスを取得
        const promptState = PromptState.getInstance();
        promptState.subscribe(updatePrompts);
        return () => {
            promptState.unsubscribe(updatePrompts);
        }
    }, []);

  return (
    <>
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
    
    {/* アディクションプロンプト */}
    <div className="relative flex-grow h-full">
        <div className="absolute w-full h-full flex flex-col gap-2 px-2">
            {additionalPrompts.map((prompt, index) => (
                <AdditionalPromptCard key={index}/>
            ))}
        </div>

    </div>

    {/* 実行ボタン */}
    <div className="w-1/25 h-full flex items-center justify-center bg-white shadow-md mr-2 rounded-r-lg cursor-pointer">
        <MdKeyboardDoubleArrowRight size={28} color="gray"/>
    </div>
  </>
  )
}

export default PromptArea;