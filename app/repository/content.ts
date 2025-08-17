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