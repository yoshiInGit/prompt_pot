import { v4 as uuidv4 } from 'uuid';
import ResourceState from '../_state/resouce_state';
import { addResourceFolder } from '@/app/repository/resources';
import LoadingState from '../_state/loading_state';

export const addFolder = async ({currentFolderId, name}:{currentFolderId:string, name:string}) =>{
    LoadingState.getInstance().isResourceListLoading = true;
    LoadingState.getInstance().notifyResourceListSub();
    
    const newFolder = {
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
