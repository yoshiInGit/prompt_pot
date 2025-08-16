import { Resource, sortResourcesByGenre } from "@/app/models/resource";
import PromptState from "../state/prompt_state";
import { getAdditionalPromptIds, getBasePrompt, registerAdditionalPrompt, setBasePrompt, unregisterAdditionalPrompt } from "@/app/repository/prompt";
import { getResourceById } from "@/app/repository/resources";

export const restorePrompts = async ({setBasePrompt}:{setBasePrompt:(prompt:string)=>void}) => {
    // 追加プロンプトのIDを取得
    // IDを取得
    const promptIds = await getAdditionalPromptIds();

    const resources: Resource[] = [];
    for(const id of promptIds){
        const resource = await getResourceById({id:id});
        if(resource){
            resources.push(resource);
        }
    }

    // ベースプロンプトを設定
    const basePrompt = await getBasePrompt();
    setBasePrompt(basePrompt);

    // ステート更新
    const promptState = PromptState.getInstance();
    promptState.additionalPrompts = resources;
    promptState.additionalPrompts = sortResourcesByGenre(promptState.additionalPrompts);
    promptState.notify();
}   


export const addPrompt = async (resource : Resource) => {

    // ステート更新
    const promptState = PromptState.getInstance();

    const currentPrompts = promptState.additionalPrompts;
    if(currentPrompts.some(prompt => prompt.id === resource.id)) {
        // 既に存在する場合は何もしない
        return;
    }

    promptState.additionalPrompts.push(resource);
    promptState.additionalPrompts = sortResourcesByGenre(promptState.additionalPrompts);
    promptState.notify();

    // データベース更新
    await registerAdditionalPrompt({resourceId : resource.id});
}

export const removePrompt = async ({resourceId}:{resourceId:string}) => {
    // ステート更新
    const promptState = PromptState.getInstance();  
    const currentPrompts = promptState.additionalPrompts;

    // 指定されたIDのプロンプトを削除
    promptState.additionalPrompts = currentPrompts.filter(prompt => prompt.id !== resourceId);
    promptState.notify();

    // データベース更新
    await unregisterAdditionalPrompt({resourceId : resourceId});
}

export const saveBasePrompt = async ({prompt}: {prompt:string}) => {
    // データベース更新
    await setBasePrompt(prompt)
}
