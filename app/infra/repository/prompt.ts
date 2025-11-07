/*
    プロンプトに関するリポジトリ
    Firestoreでのプロンプトデータの取得・追加・更新を行う
    エラー処理はonTryFirebaseでラップして行う
*/

import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { onTryFirebase } from "./helper";
import { db } from "../../firebase";


// クエリ系
export const getAdditionalPromptIds = async ({contentId}:{contentId:string}): Promise<string[]> => {
    return await onTryFirebase(async () => {
        const promptDocRef = doc(db, "base", "prompts", "file", contentId);
        const promptSnapshot = await getDoc(promptDocRef);
        
          if (!promptSnapshot.exists()) {
            console.error(`ドキュメントが存在しません`);
            return [];
        }

        const data = promptSnapshot.data();
        return data.additional_resource_ids || [];
    });
}

export const getBasePrompt = async ({contentId}:{contentId:string}): Promise<string> => {
    return await onTryFirebase(async () => {
        const promptDocRef = doc(db, "base", "prompts", "file", contentId);
        const promptSnapshot = await getDoc(promptDocRef);
        if (!promptSnapshot.exists()) {
            console.error(`ドキュメントが存在しません`);
            return "";
        }
        
        const data = promptSnapshot.data();
        return data.base_prompt || "";
    });
}

export const getResult = async ({contentId}:{contentId:string}): Promise<string> => {
    return await onTryFirebase(async () => {
        const promptDocRef = doc(db, "base", "prompts", "file", contentId);
        const promptSnapshot = await getDoc(promptDocRef);
        if (!promptSnapshot.exists()) {
            console.error(`ドキュメントが存在しません`);
            return "";
        }

        const data = promptSnapshot.data();
        return data.result || "";
    });
}

//コマンド系
// コンテンツに追加プロンプトを登録する
export const registerAdditionalPrompt = async ({resourceId, contentId}: {resourceId : string, contentId:string}) => {
    onTryFirebase(async()=>{
        const promptDocRef   = doc(db, "base", "prompts", "file", contentId);
                
        updateDoc(promptDocRef, {
            additional_resource_ids: arrayUnion(resourceId)
        });
    })
}

// コンテンツから追加プロンプトを解除する
export const unregisterAdditionalPrompt = async ({resourceId, contentID}:{resourceId:string, contentID:string}) => {
    onTryFirebase(async()=>{
        const promptDocRef   = doc(db, "base", "prompts", "file", contentID);
        updateDoc(promptDocRef, {
            additional_resource_ids: arrayRemove(resourceId)
        });
    })
}

export const setBasePrompt = async ({prompt, contentId} : {prompt:string, contentId:string}) => {
    onTryFirebase(async()=>{
        const promptDocRef   = doc(db, "base", "prompts", "file", contentId);
        updateDoc(promptDocRef, {
            base_prompt: prompt
        });
    })
}   

export const setResult = async ({result, contentId}: {result : string, contentId:string}) => {
    onTryFirebase(async()=>{
        const promptDocRef   = doc(db, "base", "prompts", "file", contentId);
        updateDoc(promptDocRef, {
            result: result
        });
    })
}   