import { arrayRemove, arrayUnion, deleteField, doc, DocumentData, getDoc, runTransaction, updateDoc} from "firebase/firestore";
import { Folder, File } from "../models/directory";
import {Resource, ResourceGenre, ResourceGenreType} from "../models/resource";
import { db } from "../firebase";

//クエリ系
const resourceCache : Map<string, Resource> = new Map();

export const getFoldersByParentId = async (parentId: string): Promise<Folder[]> => {
    return await _onTryFirebase(async () => {

        const folderDocRef   = doc(db, "base", "resources", "folders", parentId);
        const resourceDocRef = doc(db, "base", "resources");
        const folderSnapshot   = await getDoc(folderDocRef);
        const resourceSnapshot = await getDoc(resourceDocRef);
        
        if (!folderSnapshot.exists() || !resourceSnapshot.exists()) {
            // TODO : エラーハンドリングを適切に行う
            console.error(`ドキュメントが存在しません`);
            return [];
        }
        
        
        const folderIds = folderSnapshot.data().folders || []
        const id2name = resourceSnapshot.data().id2name || {};

        // フォルダIDと名前をマッピング
        const folders: Folder[] = folderIds.map((id: string) => {
            return {
                id:   id,
                name: id2name[id] || "Unknown Folder" // 名前がない場合はデフォルト名を設定
            };
        });

        return folders;
    });
}

export const getFilesByParentId = async (parentId: string): Promise<File[]> => {
    return await _onTryFirebase(async () => {

        // フォルダIDを取得
        const folderDocRef   = doc(db, "base", "resources", "folders", parentId);
        const resourceDocRef = doc(db, "base", "resources");
        const folderSnapshot   = await getDoc(folderDocRef);
        const resourceSnapshot = await getDoc(resourceDocRef);

        
        if (!folderSnapshot.exists() || !resourceSnapshot.exists()) {
            // TODO : エラーハンドリングを適切に行う
            console.error(`ドキュメントが存在しません`);
            return [];
        }

        
        const fileIds = folderSnapshot.data().files || [];        
        const id2name = resourceSnapshot.data().id2name || {};

        // ファイルIDと名前をマッピング
        const files: File[] = fileIds.map((id: string) => {
            return {
                id:   id,
                name: id2name[id] || "Unknown File" // 名前がない場合はデフォルト名を設定
            };
        });

        return files;
    });
}

export const getResourceById = async ({id}:{id:string}) : Promise<Resource | null> => {
    if(resourceCache.has(id)){
        return resourceCache.get(id) ?? null;
    }

    return _onTryFirebase(async () => {
        const fileDocRef = doc(db, "base", "resources", "files", id);
        const fileSnapshot = await getDoc(fileDocRef);
        
        if (!fileSnapshot.exists()) {
            // TODO : エラーハンドリングを適切に行う
            console.error(`フォルダが見つかりません: ${id}`);
            return null;
        }

        const fileData = fileSnapshot.data();
        console.log("File Data:", fileData);
        
        const resource = new Resource({
            id : id,
            title : fileData.title,
            genre : new ResourceGenre(fileData.genre),
            description :fileData.description,
            prompt : fileData.prompt,
        })
    
        // キャッシュに保存
        resourceCache.set(id, resource);
        
        return resource;
    });
}

// コマンド系
export const addResourceFolder = async ({folder, currentFolderId}:{folder: Folder, currentFolderId : string}): Promise<void> => {
    await _onTryFirebase(async ()=>{
        await runTransaction(db, async (transaction) => {
            
            // /base/resources/folders に新しいフォルダ情報をセット
            transaction.set(doc(db, "base", "resources", "folders", folder.id), {
                folders: [] as string[],
                files:   [] as string[],
            });

            // /base/resources の id2name にフォルダ名を追加
            transaction.update(doc(db, "base", "resources"), {
                [`id2name.${folder.id}`]: folder.name
            });

            // /base/resources/folders/{currentFolderId} にフォルダIDを登録  
            transaction.update(doc(db, "base", "resources", "folders", currentFolderId), {
                folders : arrayUnion(folder.id)
            })
        });
    });
};

export const addResource = async ({file, currentFolderId}:{file:File, currentFolderId:string}) => {
    await _onTryFirebase(async ()=>{
        await runTransaction(db, async (transaction) => {
            // /base/resources/file に新しいリソース情報をセット
            transaction.set(doc(db, "base", "resources", "files", file.id), {
                title :      "",
                genre:       "other", //TODO
                description: "",
                content:     "",
            });

            // /base/resources の id2name にリソース名を追加
            transaction.update(doc(db, "base", "resources"), {
                [`id2name.${file.id}`]: file.name
            });

            // /base/resources/folders/{currentFolderId} にフォルダIDを追加  
            transaction.update(doc(db, "base", "resources", "folders", currentFolderId), {
                files : arrayUnion(file.id)
            })

            //キャッシュを残す
            const resource = new Resource({
                id:    file.id,
                title: "", 
                genre: new ResourceGenre(ResourceGenreType.OTHER), 
                description: "",
                prompt: "",
            })
            resourceCache.set(file.id, resource);
        });
    })
}

export const updateName = async ({folderId, name}:{folderId : string, name : string}) => {
    await _onTryFirebase(async ()=>{

        const resourceDocRef = doc(db, "base", "resources");
        await updateDoc(resourceDocRef, {
            [`id2name.${folderId}`]: name
        });
    
    })
}

export const updateResource = async ({updatedResource}:{updatedResource: Resource}) => {
    await _onTryFirebase(async () => {
        const resourceDocRef = doc(db, "base", "resources", "files", updatedResource.id);
        await updateDoc(resourceDocRef, {
            title:       updatedResource.title,
            genre:       updatedResource.genre.genre,
            description: updatedResource.description,
            prompt:      updatedResource.prompt
        });
        // キャッシュを更新
        resourceCache.set(updatedResource.id, updatedResource);
    });
}

export const deleteFolder = async ({folderId, parentFolderId}:{folderId:string, parentFolderId:string}) => {
    await _onTryFirebase(async()=>{

        const folderDocRef       = doc(db, "base", "resources", "folders", folderId);
        const parentFolderDocRef = doc(db, "base", "resources", "folders", parentFolderId);
        const resourceDocRef     = doc(db, "base", "resources");
        
        await runTransaction(db, async (transaction) => {
            // フォルダを削除
            transaction.delete(folderDocRef);

            // 親フォルダからフォルダIDを削除
            transaction.update(parentFolderDocRef, {
                folders: arrayRemove(folderId)
            });

            // id2name からも削除
            transaction.update(resourceDocRef, {
                [`id2name.${folderId}`]: deleteField() 
            });
        });
    });
}

export const deleteResource = async ({fileId, parentFolderId}:{fileId:string, parentFolderId:string}) => {
    await _onTryFirebase(async ()=>{

        const fileDocRef         = doc(db, "base", "resources", "files", fileId);
        const parentFolderDocRef = doc(db, "base", "resources", "folders", parentFolderId);
        const resourceDocRef     = doc(db, "base", "resources");
        
        await runTransaction(db, async (transaction) => {
            // フォルダを削除
            transaction.delete(fileDocRef);

            // 親フォルダからフォルダIDを削除
            transaction.update(parentFolderDocRef, {
                files: arrayRemove(fileId)
            });

            // id2name からも削除
            transaction.update(resourceDocRef, {
                [`id2name.${fileId}`]: deleteField() 
            });
        });
    })
}


//　ヘルパー
const _onTryFirebase =  async <T>(method: () => Promise<T>): Promise<T> => {
    try {
        return await method()
    } catch (error) {

        //TODO: エラーハンドリングを適切に行う
        console.error("Firebaseの操作に失敗しました:", error);
        // 必要に応じて throw する
        throw new Error("Firebaseの操作に失敗しました");
    }
}

const _getFileData = async (fileId: string): Promise<DocumentData | null> => {
    const fileDocRef = doc(db, "base", "resources", "files", fileId);
    const fileSnapshot = await getDoc(fileDocRef);
    if (!fileSnapshot.exists()) {
        console.error(`ファイルが見つかりません: ${fileId}`);
        return null;
    }
    return fileSnapshot.data();
}

const _getFolderData = async (folderId: string): Promise<DocumentData | null> => {
    const folderDocRef = doc(db, "base", "resources", "folders", folderId);
    const folderSnapshot = await getDoc(folderDocRef);
    if (!folderSnapshot.exists()) {
        console.error(`フォルダが見つかりません: ${folderId}`);
        return null;
    }
    return folderSnapshot.data();
}

const _getResourceData = async (): Promise<DocumentData | null> => {
    const resourceDocRef = doc(db, "base", "resources");
    const resourceSnapshot = await getDoc(resourceDocRef);
    if (!resourceSnapshot.exists()) {
        console.error("リソース情報が見つかりません");
        return null;
    }
    return resourceSnapshot.data();
}