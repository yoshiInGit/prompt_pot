import { v4 as uuidv4 } from 'uuid';
import { addResourceFolder, getFoldersByParentId, updateResourceName, deleteFolder, addResource, getFilesByParentId, deleteFile, getResourceById} from '@/app/repository/resources';
import { File, Folder } from '@/app/models/directory';
import LoadingState from '../_state/loading_state';
import ResourceState from '../_state/resouce_state';

export const changeResourceName = async ({resourceId: resource, name}:{resourceId : string, name : string}) =>{   
    LoadingState.getInstance().isResourceListLoading = true;
    LoadingState.getInstance().notifyResourceListSub();

    await updateResourceName({folderId: resource, name: name});

    // ステート更新
    const resourceState = ResourceState.getInstance();
    const folderIndex = resourceState.folders.findIndex(folder => folder.id === resource);
    if (folderIndex !== -1) {
        resourceState.folders[folderIndex].name = name; // フォルダ名を更新
        resourceState.notify();
    }
    
    LoadingState.getInstance().isResourceListLoading = false;
    LoadingState.getInstance().notifyResourceListSub();    
}

export const restoreFolder = async () => {
    LoadingState.getInstance().isResourceListLoading = true;
    LoadingState.getInstance().notifyResourceListSub();

    const folders = await getFoldersByParentId("base");
    const files   = await getFilesByParentId("base"); 

    const resourceState = ResourceState.getInstance();
    resourceState.currentFolderId = "base"; // フォルダを復元する場合は、ベースフォルダに戻す
    resourceState.folders = folders;
    resourceState.files = files;
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
    const files   = await getFilesByParentId(folderId); 


    resourceState.currentFolderId = folderId; // フォルダを復元する場合は、ベースフォルダに戻す
    resourceState.folders = folders;
    resourceState.files = files;
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

export const removeFolder = async ({folderId, parentFolderId}:{folderId:string, parentFolderId:string}) =>{
    LoadingState.getInstance().isResourceListLoading = true;
    LoadingState.getInstance().notifyResourceListSub();

    //DB処理
    await deleteFolder({folderId:folderId, parentFolderId:parentFolderId});

    //ステート更新
    const resourceState = ResourceState.getInstance();
    resourceState.folders = resourceState.folders.filter(folder => folder.id !== folderId);
    resourceState.notify();

    LoadingState.getInstance().isResourceListLoading = false;
    LoadingState.getInstance().notifyResourceListSub();
}

export const addFile = async({fileName, currentFolderId}:{fileName:string, currentFolderId:string}) =>{
    const newFile : File = {
        id: uuidv4(),
        name: fileName
    }

    LoadingState.getInstance().isResourceListLoading = true;
    LoadingState.getInstance().notifyResourceListSub();

    //DB処理
    await addResource({file: newFile, currentFolderId: currentFolderId});

    //ステート更新
    const resourceState = ResourceState.getInstance();
    if(currentFolderId == resourceState.currentFolderId){ // 現在のフォルダに追加してるか確認
        resourceState.files.push(newFile);
        resourceState.notify();
    }

    LoadingState.getInstance().isResourceListLoading = false;
    LoadingState.getInstance().notifyResourceListSub();
}

export const changeFileName = () =>{
}

export const removeFile = async ({fileId, parentFolderId}:{fileId : string, parentFolderId:string}) =>{
    LoadingState.getInstance().isResourceListLoading = true;
    LoadingState.getInstance().notifyResourceListSub();

    //DB処理
    await deleteFile({fileId:fileId, parentFolderId:parentFolderId});

    //ステート更新
    const resourceState = ResourceState.getInstance();
    resourceState.files = resourceState.files.filter(file => file.id !== fileId);
    resourceState.notify();

    LoadingState.getInstance().isResourceListLoading = false;
    LoadingState.getInstance().notifyResourceListSub();
}

export const selectFile = async ({file}:{file:File}) => {
    const resource = await getResourceById({id : file.id});

    const resourceState = ResourceState.getInstance();
    resourceState.selectedResource = resource;
    resourceState.notify();
}