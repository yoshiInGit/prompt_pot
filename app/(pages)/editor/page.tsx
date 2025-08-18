'use client';

import {FaCopy } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { useEffect, useRef, useState} from "react";
import {restoreFolder} from "../../action_state/action/resource";
import ResourceList from "./section/ResourceList";
import ResourcePreview from "./section/ResourcePreview";
import PromptArea from "./section/PromptArea";
import { downloadResultMD, restorePrompts } from "@/app/action_state/action/prompt";
import LoadingSpinner from "../_common/Loading_spinner";
import LoadingState from "@/app/action_state/state/loading_state";
import ResultState from "@/app/action_state/state/result_state";
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { useSearchParams } from "next/navigation";


const Editor = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');


    const [restoreBasePrompt, setRestoreBasePrompt] = useState<string>("");
    const [result, setResult] = useState<string>("");
    const [isResultLoading, setIsResultLoading] = useState<boolean>(false);

    // リソースの復元
    const initFlag = useRef<boolean>(true);
    useEffect(() => {
        if(initFlag.current){
            // リソースの復元
            restoreFolder();
            initFlag.current = false;
        }
    }, []);

    // プロンプトの復元
    useEffect(() => {
        if(id){
            restorePrompts({setBasePrompt:setRestoreBasePrompt, contentID:id});
        }
    }, [id]);


    // 結果のロード、結果の状態を監視
    useEffect(() => {
        const updateResultLoading = ({isLoading}: {isLoading: boolean}) => {
            setIsResultLoading(isLoading);
        }

        const updateResult = ({result}: {result: string}) => {
            setResult(result);
        }
        
        const loadingState = LoadingState.getInstance();
        loadingState.subscribeResult(updateResultLoading);

        const resultState = ResultState.getInstance();
        resultState.subscribe(updateResult);

        return () => {
            loadingState.unsubscribeResult(updateResultLoading);
            resultState.unsubscribe(updateResult);
        }
    }, []);

    const onCopy = () => {
        navigator.clipboard.writeText(result).then(() => {
            console.log("Copied to clipboard");
        }).catch((error) => {
            console.error("Failed to copy: ", error);
        });
    }

    return(
        <div className="absolute top-0 left-0 bottom-0 right-0 overflow-hidden flex bg-gray-200 p-4">
            
            {/* エディター画面 */}
            <div className="w-6/10 h-full overflow-hidden flex flex-col">
                
                {/* プロンプトエリア */}
                <div className="w-full h-1/2 overflow-hidden flex">
                    <PromptArea restoreBasePrompt={restoreBasePrompt}/>
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
            <div className="relative w-4/10 h-full overflow-hidden flex flex-col">
                <div className="flex-grow bg-white shadow-md p-4 rounded flex flex-col gap-4 overflow-y-scroll">
                        <div className="flex items-center gap-4">
                            <div className="text-gray-600 font-bold">Preview</div>
                            <div className="grow"/>
                            <FaCopy size={20} className="text-gray-600 cursor-pointer hover:text-gray-800"
                                onClick={onCopy}/>
                            <IoMdDownload size={20} className="text-gray-600 cursor-pointer hover:text-gray-800"
                                onClick={downloadResultMD}/>
                        </div>

                        <div className="grow w-full leading-relaxed text-gray-800 prose">
                            <Markdown remarkPlugins={[remarkGfm]}>
                                {result}
                            </Markdown>

                            {/* やみやすくするようにフッター */}
                            <div className="h-100"/>
                        </div>

                    {isResultLoading && <LoadingSpinner/>}
                </div>
            </div>
        </div>
    )
}

export default Editor