import { GoCpu } from "react-icons/go";
import AdditionalPromptCard from "../modules/AdditionalPromptCard";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useState, useEffect } from "react";
import { Resource } from "@/app/models/resource";
import PromptState from "@/app/action_state/state/prompt_state";
import { executePrompt, removePrompt, saveBasePrompt } from "@/app/action_state/action/prompt";
import { IoIosSave } from "react-icons/io";
import { exec } from "child_process";

const PromptArea = ({restoreBasePrompt}:{restoreBasePrompt:string}) => {
    const [basePrompt, setBasePrompt] = useState<string>("");
    const [additionalPrompts, setAdditionalPrompts] = useState<Resource[]>([]);

    useEffect(() => {
        const updatePrompts = ({additionalPrompts}: {additionalPrompts: Resource[]}) => {
            setAdditionalPrompts([...additionalPrompts]);
        }

        // PromptStateのインスタンスを取得
        const promptState = PromptState.getInstance();
        promptState.subscribe(updatePrompts);
        return () => {
            promptState.unsubscribe(updatePrompts);
        }
    }, []);

    //　初期ベースプロンプトの復元
    useEffect(() => {
        if(restoreBasePrompt){
            setBasePrompt(restoreBasePrompt);
        }
    }, [restoreBasePrompt]);

  return (
    <>
    {/* ベースプロンプト */}
    <div className="w-5/10 h-full text-white bg-white/10 backdrop-blur-lg border border-white/40 shadow-md p-4 rounded flex flex-col">
        <div className="flex items-center mb-2">
            <GoCpu size={16}/>
            <div className="text-white ml-2">Base Prompt</div>
            <div className="grow"/>
            <IoIosSave size={20} className="text-white cursor-pointer hover:text-gray-300"
                onClick={()=>{saveBasePrompt({prompt:basePrompt})}}/>
        </div>

        <textarea 
                className="flex-1 bg-transparent text-sm  focus:outline-none resize-none rounded"
                placeholder="例）小学3年生でも理解できる言葉で、地球温暖化について説明してください。専門用語は使わず、具体..."
                defaultValue={basePrompt}
                onChange={(e) => {setBasePrompt(e.target.value);}}
        ></textarea>

    </div>
    
    {/* アディクションプロンプト */}
    <div className="relative flex-grow h-full">
        <div className="absolute w-full h-full flex flex-col gap-2 px-2 overflow-y-scroll hidden-scrollbar"
            style={{
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none' /* IE/Edge */
          }}>
            {additionalPrompts.map((resource, index) => (
                <AdditionalPromptCard 
                    key={index}
                    name={resource.title}
                    description={resource.description}
                    color={resource.genre.color()}
                    onRemove={()=>{
                        removePrompt({resourceId: resource.id });
                    }}/>
            ))}
        </div>

    </div>

    {/* 実行ボタン */}
    <div className="w-1/25 h-full flex items-center justify-center text-white bg-white/10 backdrop-blur-lg border border-white/40 shadow-md mr-2 rounded-r-lg cursor-pointer"
        onClick={() =>{executePrompt({basePrompt: basePrompt})}}>
        <MdKeyboardDoubleArrowRight size={28} color="white"/>
    </div>
  </>
  )
}

export default PromptArea;