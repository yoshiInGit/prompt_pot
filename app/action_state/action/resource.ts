/*
    リソース（コンテンツに追加できるプロンプトのテンプレート）の管理を行うアクション群
    リソースはフォルダとファイルで管理され、フォルダの中にファイルやさらにフォルダを入れ子にできる構造を持つ
    フォルダ、ファイルはIDと名前のみを持つシンプルな構造であり、
    ファイルごとに具体的なリソース情報と紐づいており、選択されたファイルIDをもとにリソース情報を取得する
    リソースの状態はResourceStateに保存されている
*/


import { v4 as uuidv4 } from 'uuid';
import * as resourceRepo from '@/app/infra/repository/resources';
import { File, Folder } from '@/app/infra/models/directory';
import LoadingState from '../state/loading_state';
import ResourceState from '../state/resource_state';
import { Resource, ResourceGenre, ResourceGenreType, sortResourcesByGenre } from '@/app/infra/models/resource';
import PromptState from '../state/prompt_state';

// リソースの名前を変更するアクション
export const changeResourceName = async ({resourceId: resource, name}:{resourceId : string, name : string}) =>{   
    await _onResourceLoading(async ()=>{
        // DB更新
        await resourceRepo.updateName({folderId: resource, name: name});

        const resourceState = ResourceState.getInstance();
        
        const folderIndex = resourceState.folders.findIndex(folder => folder.id === resource);
        if (folderIndex !== -1) {
            resourceState.folders[folderIndex].name = name; // フォルダ名を更新
            resourceState.notify();
        }
    });
}

// サービス起動時にフォルダの内容を復元するアクション
// 一番上の階層（ベースフォルダ）を開く
export const restoreFolder = async () => {
    await _onResourceLoading(async ()=>{
        const folders = await resourceRepo.getFoldersByParentId("base");
        const files   = await resourceRepo.getFilesByParentId("base"); 

        const resourceState = ResourceState.getInstance();
        resourceState.currentFolderId = "base"; // フォルダを復元する場合は、現在のフォルダをベースフォルダに戻す
        resourceState.folders = folders;
        resourceState.files   = files;
        resourceState.notify();
    })
}

// 指定したフォルダの情報を新規に開くアクション
export const openFolder = async ({folderId}:{folderId:string}) => {
    const resourceState = ResourceState.getInstance();

    // 誤操作を防ぐために、読み込み中は表示を空にする
    resourceState.folders = [];
    resourceState.files   = [];
    resourceState.notify();

    await _onResourceLoading(async()=>{
        const folders = await resourceRepo.getFoldersByParentId(folderId);
        const files   = await resourceRepo.getFilesByParentId(folderId); 

        resourceState.currentFolderId = folderId; 
        resourceState.folders = folders;
        resourceState.files   = files;
        resourceState.notify();
    })
}

// フォルダを新規に追加するアクション
export const addFolder = async ({currentFolderId, name}:{currentFolderId:string, name:string}) =>{
    await _onResourceLoading(async ()=>{
        const newFolder : Folder = {
            id:   uuidv4(),
            name: name 
        };

        // データベース更新 
        await resourceRepo.addResourceFolder({folder: newFolder, currentFolderId: currentFolderId});

        //　ステート更新
        const resourceState = ResourceState.getInstance();
        if(currentFolderId == resourceState.currentFolderId){ // 現在のフォルダに追加してるか確認
            resourceState.folders.push(newFolder);
            resourceState.notify();
        }
    });

}

// フォルダを削除するアクション
export const removeFolder = async ({folderId, parentFolderId}:{folderId:string, parentFolderId:string}) =>{
    await _onResourceLoading(async()=>{
        //DB処理
        await resourceRepo.deleteFolder({folderId:folderId, parentFolderId:parentFolderId});

        //ステート更新
        const resourceState = ResourceState.getInstance();
        resourceState.folders = resourceState.folders.filter(folder => folder.id !== folderId);
        resourceState.notify();
    })
}

// ファイルを新規に追加するアクション
// それに紐づくリソースも同時に作成する
export const addFile = async({fileName, currentFolderId}:{fileName:string, currentFolderId:string}) =>{
    await _onResourceLoading(async()=>{
        const newFile : File = {
            id:   uuidv4(),
            name: fileName
        }

        const newResource = new Resource({
            id:    newFile.id,
            title: "", 
            genre: new ResourceGenre(ResourceGenreType.OTHER), 
            description: "",
            prompt: "",
        });

        //DB処理
        await resourceRepo.addResource({file: newFile, currentFolderId: currentFolderId});

        //ステート更新
        const resourceState = ResourceState.getInstance();
        if(currentFolderId == resourceState.currentFolderId){ // 現在のフォルダに追加してるか確認
            resourceState.files.push(newFile);
            resourceState.notify();
        }
        resourceState.selectedResource = newResource; // 新しく追加したリソースを選択状態にする
        resourceState.notify();
    });
}

// ファイルを削除するアクション
export const removeFile = async ({fileId, parentFolderId}:{fileId : string, parentFolderId:string}) =>{
    await _onResourceLoading(async ()=>{
        //DB処理
        await resourceRepo.deleteResource({fileId:fileId, parentFolderId:parentFolderId});
        
        //ステート更新
        const resourceState = ResourceState.getInstance();
        ResourceState.getInstance().files = resourceState.files.filter(file => file.id !== fileId);
        resourceState.notify();
    })
}

// ファイルを選択状態にするアクション
export const selectFile = async ({file}:{file:File}) => {
    const resource = await resourceRepo.getResourceById({id : file.id});

    const resourceState = ResourceState.getInstance();
    resourceState.selectedResource = resource;
    console.log("Selected Resource:", resource);
    resourceState.notify();
}

// リソースを編集するアクション
export const editResource = async ({id, title, genre, description, prompt }:{id:string, title: string; genre: ResourceGenre; description: string; prompt: string;}) => {
    const updatedResource =  new Resource({ 
        id: id,
        title: title,
        genre: genre,
        description: description,
        prompt: prompt
    });

    // DB更新
    await resourceRepo.updateResource({updatedResource: updatedResource});

    // ステート更新
    const resourceState = ResourceState.getInstance();
    if (resourceState.selectedResource && resourceState.selectedResource.id === id) {
        resourceState.selectedResource = updatedResource; // 選択中のリソースを更新
        resourceState.notify();
    }

    // 追加プロンプトステートも必要なら更新
    const promptState = PromptState.getInstance();
    const targetIndex = promptState.additionalPrompts.findIndex(prompt => prompt.id === id);
    if (targetIndex !== -1) {
        promptState.additionalPrompts[targetIndex] = updatedResource; // 既存のプロンプトを更新
    }
    promptState.additionalPrompts = sortResourcesByGenre(promptState.additionalPrompts);
    promptState.notify();
}


// ヘルパー
// リソース操作時の読み込み状態を実行する
const _onResourceLoading = async(method:()=>Promise<void>) => {
    LoadingState.getInstance().isResourceListLoading = true;
    LoadingState.getInstance().notifyResourceListSub();

    await method();

    LoadingState.getInstance().isResourceListLoading = false;
    LoadingState.getInstance().notifyResourceListSub();
}