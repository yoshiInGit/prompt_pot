import { Resource, ResourceGenreType } from "@/app/models/resource";
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
    promptState.additionalPrompts = _sortByGenre(promptState.additionalPrompts);
    promptState.notify();

    //TODO: データベースに保存する処理を追加
}

const _sortByGenre = (resources : Resource[]) => {
    const genreOrder = [
        ResourceGenreType.INSTRUCTION,
        ResourceGenreType.CONTEXT,
        ResourceGenreType.FORMAT,
        ResourceGenreType.CONSTRAINT,
        ResourceGenreType.OTHER
    ]

    return resources.sort((a, b) => {
        const genreIndexA = genreOrder.indexOf(a.genre.genre);
        const genreIndexB = genreOrder.indexOf(b.genre.genre);
        return genreIndexA - genreIndexB;
    });
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