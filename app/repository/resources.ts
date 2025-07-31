import { arrayUnion, doc, getDoc, runTransaction} from "firebase/firestore";
import { Folder } from "../models/directory";
import { db } from "../firebase";

export const addResourceFolder = async ({folder, currentFolderId}:{folder: Folder, currentFolderId : string}): Promise<void> => {
    try {
        await runTransaction(db, async (transaction) => {
            // /base/resources/folders に新しいフォルダ情報をセット
            transaction.set(doc(db, "base", "resources", "folders", folder.id), {
                folders: [] as string[],
                files: [] as string[],
            });

            // /base/resources の id2name にフォルダ名を追加
            transaction.update(doc(db, "base", "resources"), {
                [`id2name.${folder.id}`]: folder.name
            });

            // /base/resources/folders/{currentFolderId} にフォルダIDを追加  
            transaction.update(doc(db, "base", "resources", "folders", currentFolderId), {
                folders : arrayUnion(folder.id)
            })
        });
        console.log("フォルダの追加に成功しました:", folder.id);
    } catch (error) {

        //TODO: エラーハンドリングを適切に行う
        console.error("フォルダの追加に失敗しました:", error);
        // 必要に応じて throw する
        throw new Error("フォルダの追加に失敗しました。もう一度お試しください。");
    }
};

export const getFoldersByParentId = async (parentId: string): Promise<Folder[]> => {
    try {
        // フォルダIDを取得
        const folderDocRef = doc(db, "base", "resources", "folders", parentId);
        const folderSnapshot = await getDoc(folderDocRef);
        
        if (!folderSnapshot.exists()) {
            // TODO : エラーハンドリングを適切に行う
            console.error(`フォルダが見つかりません: ${parentId}`);
            return [];
        }

        const folderData = folderSnapshot.data();
        const folderIds = folderData.folders || [];
        
        // ID2Name マッピングを取得
        const resourceDocRef = doc(db, "base", "resources");
        const resourceSnapshot = await getDoc(resourceDocRef);

        if (!resourceSnapshot.exists()) {
            // TODO : エラーハンドリングを適切に行う
            console.error("リソース情報が見つかりません");
            return [];
        }

        const resourceData = resourceSnapshot.data();
        const id2name = resourceData.id2name || {};


        console.log("フォルダID:", folderIds);
        console.log("ID2Name マッピング:", id2name);

        // フォルダIDと名前をマッピング
        const folders: Folder[] = folderIds.map((id: string) => {
            return {
                id: id,
                name: id2name[id] || "Unknown Folder" // 名前がない場合はデフォルト名を設定
            };
        });

        return folders;
    } catch (error) {
        console.error("フォルダの取得に失敗しました:", error);
        throw new Error("フォルダの取得に失敗しました。もう一度お試しください。");
    }
}