import { Resource } from "@/app/models/resource";
import PromptState from "../_state/prompt_state";

export const addPrompt = async (resource : Resource) => {

    // ステート更新
    const promptState = PromptState.getInstance();

    const currentPrompts = promptState.additionalPrompts;
    if(currentPrompts.some(prompt => prompt.id === resource.id)) {
        // 既に存在する場合は何もしない
        return;
    }

    promptState.additionalPrompts.push(resource);
    promptState.notify();

    //TODO: データベースに保存する処理を追加
}

export const removePrompt = async ({resourceId}:{resourceId:string}) => {
    // ステート更新
    const promptState = PromptState.getInstance();  
    const currentPrompts = promptState.additionalPrompts;

    // 指定されたIDのプロンプトを削除
    promptState.additionalPrompts = currentPrompts.filter(prompt => prompt.id !== resourceId);
    promptState.notify();

    //TODO: データベースから削除する処理を追加
}