import { v4 as uuidv4 } from 'uuid';
import ResourceState from '../_state/resouce_state';
import { addResourceFolder } from '@/app/repository/resources';

export const addFolder = async ({currentFolderId, name}:{currentFolderId:string, name:string}) =>{
    const newFolder = {
        id: uuidv4(),
        name: name 
    };

    //　ステート更新
    const resourceState = ResourceState.getInstance();
    if(currentFolderId == resourceState.currentFolderId){
        resourceState.folders.push(newFolder);
        resourceState.notify();
    }

    // データベース更新 
    await addResourceFolder(newFolder);

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
