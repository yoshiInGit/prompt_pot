import { v4 as uuidv4 } from 'uuid';
import { addResourceFolder, getFoldersByParentId } from '@/app/repository/resources';
import { Folder } from '@/app/models/directory';
import LoadingState from '../_state/loading_state';
import ResourceState from '../_state/resouce_state';

export const restoreFolder = async () => {
    LoadingState.getInstance().isResourceListLoading = true;
    LoadingState.getInstance().notifyResourceListSub();

    const folders = await getFoldersByParentId("base");
    // TODO ファイルも取得する

    const resourceState = ResourceState.getInstance();
    resourceState.currentFolderId = "base"; // フォルダを復元する場合は、ベースフォルダに戻す
    resourceState.folders = folders;
    resourceState.notify();

    LoadingState.getInstance().isResourceListLoading = false;
    LoadingState.getInstance().notifyResourceListSub();
}

export const openFolder = async ({folderId}:{folderId:string}) => {
    const resourceState = ResourceState.getInstance();

    resourceState.folders = [];
    resourceState.files = [];
    resourceState.notify();

    LoadingState.getInstance().isResourceListLoading = true;
    LoadingState.getInstance().notifyResourceListSub();

    const folders = await getFoldersByParentId(folderId);
    // TODO ファイルも取得する

    resourceState.currentFolderId = folderId; // フォルダを復元する場合は、ベースフォルダに戻す
    resourceState.folders = folders;
    resourceState.notify();
    

    LoadingState.getInstance().isResourceListLoading = false;
    LoadingState.getInstance().notifyResourceListSub();

}

export const addFolder = async ({currentFolderId, name}:{currentFolderId:string, name:string}) =>{
    LoadingState.getInstance().isResourceListLoading = true;
    LoadingState.getInstance().notifyResourceListSub();
    
    const newFolder : Folder = {
        id: uuidv4(),
        name: name 
    };

    // データベース更新 
    await addResourceFolder({folder: newFolder, currentFolderId: currentFolderId});

    //　ステート更新
    const resourceState = ResourceState.getInstance();
    if(currentFolderId == resourceState.currentFolderId){ // 現在のフォルダに追加してるか確認
        resourceState.folders.push(newFolder);
        resourceState.notify();
    }

    LoadingState.getInstance().isResourceListLoading = false;
    LoadingState.getInstance().notifyResourceListSub();

}

export const changeFolderName = () =>{
}

export const removeFolder = () =>{
}

export const addFile = () =>{
}

export const changeFileName = () =>{
}

export const removeFile = () =>{
}
