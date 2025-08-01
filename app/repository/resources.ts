import { arrayRemove, arrayUnion, deleteField, doc, getDoc, runTransaction, updateDoc} from "firebase/firestore";
import { Folder, File } from "../models/directory";
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

export const getFilesByParentId = async (parentId: string): Promise<File[]> => {
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
        const fileIds = folderData.files || [];
        
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
        console.log("ファイルID:", fileIds);
        console.log("ID2Name マッピング:", id2name);

        // ファイルIDと名前をマッピング
        const files: File[] = fileIds.map((id: string) => {
            return {
                id: id,
                name: id2name[id] || "Unknown File" // 名前がない場合はデフォルト名を設定
            };
        });

        return files;
    } catch (error) {
        console.error("ファイルの取得に失敗しました:", error);
        throw new Error("ファイルの取得に失敗しました。もう一度お試しください。");
    }
}

export const updateResourceName = async ({folderId, name}:{folderId : string, name : string}) => {
    try {
        const folderDocRef = doc(db, "base", "resources");

        await updateDoc(folderDocRef, {
            [`id2name.${folderId}`]: name
        });
        
        console.log(`リソース名の更新に成功しました: ${folderId} -> ${name}`);
    } catch (error) {
        console.error("フォルダ名の更新に失敗しました:", error);
        throw new Error("フォルダ名の更新に失敗しました。もう一度お試しください。");
    }
}

export const deleteFolder = async ({folderId, parentFolderId}:{folderId:string, parentFolderId:string}) => {
    try {
        const folderDocRef = doc(db, "base", "resources", "folders", folderId);
        const parentFolderDocRef = doc(db, "base", "resources", "folders", parentFolderId);
        const resourceDocRef = doc(db, "base", "resources");
        
        await runTransaction(db, async (transaction) => {
            // フォルダを削除
            transaction.delete(folderDocRef);
            // 親フォルダからフォルダIDを削除
            transaction.update(parentFolderDocRef, {
                folders: arrayRemove(folderId)
            });
            transaction.update(resourceDocRef, {
                [`id2name.${folderId}`]: deleteField() // id2name からも削除
            });

        });
        console.log(`フォルダの削除に成功しました: ${folderId}`);
    }catch (error) {
        console.error("フォルダの削除に失敗しました:", error);
        throw new Error("フォルダの削除に失敗しました。もう一度お試しください。");
    }
}

export const deleteFile = async ({fileId, parentFolderId}:{fileId:string, parentFolderId:string}) => {
    try {
        const fileDocRef = doc(db, "base", "resources", "files", fileId);
        const parentFolderDocRef = doc(db, "base", "resources", "folders", parentFolderId);
        const resourceDocRef = doc(db, "base", "resources");
        
        await runTransaction(db, async (transaction) => {
            // フォルダを削除
            transaction.delete(fileDocRef);
            // 親フォルダからフォルダIDを削除
            transaction.update(parentFolderDocRef, {
                files: arrayRemove(fileId)
            });
            transaction.update(resourceDocRef, {
                [`id2name.${fileId}`]: deleteField() // id2name からも削除
            });

        });
        console.log(`フォルダの削除に成功しました: ${fileId}`);
    }catch (error) {
        console.error("フォルダの削除に失敗しました:", error);
        throw new Error("フォルダの削除に失敗しました。もう一度お試しください。");
    }
}

export const addResource = async ({file, currentFolderId}:{file:File, currentFolderId:string}) => {
    try {
        await runTransaction(db, async (transaction) => {
            // /base/resources/file に新しいフォルダ情報をセット
            transaction.set(doc(db, "base", "resources", "files", file.id), {
                title : "",
                description: "",
                content: "",
            });

            // /base/resources の id2name にフォルダ名を追加
            transaction.update(doc(db, "base", "resources"), {
                [`id2name.${file.id}`]: file.name
            });

            // /base/resources/folders/{currentFolderId} にフォルダIDを追加  
            transaction.update(doc(db, "base", "resources", "folders", currentFolderId), {
                files : arrayUnion(file.id)
            })
        });
        console.log("ファイルの追加に成功しました:", file.id);
    } catch (error) {

        //TODO: エラーハンドリングを適切に行う
        console.error("ファイルの追加に失敗しました:", error);
        // 必要に応じて throw する
        throw new Error("ファイルの追加に失敗しました。もう一度お試しください。");
    }
}