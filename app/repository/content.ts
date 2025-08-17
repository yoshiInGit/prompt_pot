import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { onTryFirebase } from "./helper"
import { db } from "../firebase";
import { Content } from "../models/contents";

//　クエリ系
export const getAllContents = async ():Promise<Content[]>=> {
    return await onTryFirebase(async () => {
        const docRef = doc(db, "base", "contents");
        const snapshot = await getDoc(docRef);  
        if (!snapshot.exists()) {
            console.error("Contents document does not exist");
            return [];
        }

        // data : {id:string, name:string}[]
        const data = snapshot.data();
        const contentRaw = data.contents || [];

        let contents: Content[] = [];
        for (const content of contentRaw) {
            if (!content.id || !content.name) {
                console.error("Invalid content data", content);
                continue;
            }

            // Contentクラスのインスタンスを作成
            const contentInstance = new Content({
                id: content.id,
                name: content.name
            });
            contents.push(contentInstance);
        }

        return contents;
    });
}

// コマンド系
export const addContent = async ({content}:{content:Content}) => {
    onTryFirebase(async () => {
        const docRef = doc(db, "base", "contents");

        await updateDoc(docRef, {
            "contents": arrayUnion({
                id:   content.id,
                name: content.name,
            })
        });
    });
}

export const updateContent = async ({content}:{content: Content}) => {
    onTryFirebase(async () => {
        const docRef = doc(db, "base", "contents");
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) {
            console.error("Contents document does not exist");
            return;
        }

        const contents = snapshot.data().contents || [];
        const contentIndex = contents.findIndex((content: { id: string }) => content.id === content.id);
        if (contentIndex === -1) {
            console.error(`Content with id ${content.id} not found`);
            return;
        }

        // 更新
        contents[contentIndex] = {
            id:   content.id,
            name: content.name
        };

        // データベース更新
        await updateDoc(docRef, {
            "contents": contents
        }); 
        console.log(`Content with id ${content.id} to ${content}`);
    });
}

export const deleteContent = async ({contentId}:{contentId:string}) => {
    onTryFirebase(async () => {
        const docRef = doc(db, "base", "contents");
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) {
            console.error("Contents document does not exist");
            return;
        }

        const contents = snapshot.data().contents || [];
        const contentIndex = contents.findIndex((content: { id: string }) => content.id === contentId);
        if (contentIndex === -1) {
            console.error(`Content with id ${contentId} not found`);
            return;
        }

        // 削除
        contents.splice(contentIndex, 1);

        // データベース更新
        await updateDoc(docRef, {
            "contents": contents
        });
        console.log(`Content with id ${contentId} deleted`);
    });
}