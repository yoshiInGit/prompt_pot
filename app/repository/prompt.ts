import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { Resource } from "../models/resource";
import { onTryFirebase } from "./helper";
import { db } from "../firebase";

const FileID = "ysMm1oQEpjcrSX5NtbqE" // TODO: これは仮のIDです。実際のファイルIDに置き換えてください。

// クエリ系
export const getAdditionalPromptIds = async (): Promise<string[]> => {
    return await onTryFirebase(async () => {
        const promptDocRef = doc(db, "base", "prompts", "file", FileID);
        const promptSnapshot = await getDoc(promptDocRef);
        
          if (!promptSnapshot.exists()) {
            console.error(`ドキュメントが存在しません`);
            return [];
        }

        const data = promptSnapshot.data();
        return data.additional_resource_ids || [];
    });
}

export const getBasePrompt = async (): Promise<string> => {
    return await onTryFirebase(async () => {
        const promptDocRef = doc(db, "base", "prompts", "file", FileID);
        const promptSnapshot = await getDoc(promptDocRef);
        if (!promptSnapshot.exists()) {
            console.error(`ドキュメントが存在しません`);
            return "";
        }
        
        const data = promptSnapshot.data();
        return data.base_prompt || "";
    });
}

export const getResult = async (): Promise<string> => {
    return await onTryFirebase(async () => {
        const promptDocRef = doc(db, "base", "prompts", "file", FileID);
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
export const registerAdditionalPrompt = async ({resourceId}: {resourceId : string}) => {
    onTryFirebase(async()=>{
        const promptDocRef   = doc(db, "base", "prompts", "file", FileID);
                
        updateDoc(promptDocRef, {
            additional_resource_ids: arrayUnion(resourceId)
        });
    })
}

export const unregisterAdditionalPrompt = async ({resourceId}:{resourceId:string}) => {
    onTryFirebase(async()=>{
        const promptDocRef   = doc(db, "base", "prompts", "file", FileID);
        updateDoc(promptDocRef, {
            additional_resource_ids: arrayRemove(resourceId)
        });
    })
}

export const setBasePrompt = async (prompt : string) => {
    onTryFirebase(async()=>{
        const promptDocRef   = doc(db, "base", "prompts", "file", FileID);
        updateDoc(promptDocRef, {
            base_prompt: prompt
        });
    })
}   

export const setResult = async (result: string) => {
    onTryFirebase(async()=>{
        const promptDocRef   = doc(db, "base", "prompts", "file", FileID);
        updateDoc(promptDocRef, {
            result: result
        });
    })
}   