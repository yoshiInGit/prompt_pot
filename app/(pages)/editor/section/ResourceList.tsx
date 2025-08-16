import { addFile, addFolder, changeResourceName, editResource, openFolder, removeFile, removeFolder, selectFile } from "@/app/action_state/action/resource";
import LoadingState from "@/app/action_state/state/loading_state";
import ResourceState from "@/app/action_state/state/resource_state";
import { Folder, File } from "@/app/models/directory";
import { Resource, ResourceGenre } from "@/app/models/resource";
import { useEffect, useState } from "react";
import { AiFillFileAdd, AiFillFolderAdd } from "react-icons/ai";
import { BiSolidRename } from "react-icons/bi";
import { FaAngleDoubleUp } from "react-icons/fa";
import { IoReturnUpBack } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md";
import ResourceTile from "../modules/ResourceTile";
import NewFolderDialog from "../modules/NewFolderDialog";
import NewFileDialog from "../modules/NewFileDialog";
import RenameDialog from "../modules/RenameFolderDialog";
import ConfirmDialog from "../modules/ConfirmDialog";
import EditResourceDialog from "../modules/EditResourceDialog";
import LoadingSpinner from "../../_common/Loading_spinner";
import { addPrompt } from "@/app/action_state/action/prompt";

const ResourceList = () => {
    // リソースリスト
    const [currentFolderId, setCurrentFolderId] = useState<string>("base");
    const [resourceFolders, setResourceFolders] = useState<Folder[]>([]);
    const [resourceFiles, setResourceFiles] = useState<File[]>([])

    const [newFolderDialogOpen, setNewFolderDialogOpen] = useState<boolean>(false);
    const [newFileDialog, setNewFileDialogOpen] = useState<boolean>(false);
    const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [editResourceDialogOpen, setEditResourceDialogOpen] = useState<boolean>(false);
    const [isResourceListLoading, setIsResourceListLoading] = useState<boolean>(false);
    
    const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null); 
    const [selectedResourceType, setSelectedResourceType] = useState<"folder" | "file" | null>(null);
    const [selectedResource, setSelectedResource] = useState<Resource|null>(null);
    const [resourceFolderHistory, setResourceFolderHistory] = useState<string[]>(["base"]);
    const selectResource = ({id, type}:{id:string|null, type:"folder" | "file" | null}) => {
        setSelectedResourceId(id);
        setSelectedResourceType(type);
    }

    useEffect(() => {
        const updateResource = ({currentFolderId, folders, files, selectedResource}: {currentFolderId: string, folders: Folder[], files: File[], selectedResource:Resource|null}) => {
            setCurrentFolderId(currentFolderId);
            setResourceFolders(folders);
            setResourceFiles(files);
            setSelectedResource(selectedResource)
        }

        const updateResourceListLoading = ({isLoading}: {isLoading: boolean}) => {
            setIsResourceListLoading(isLoading);
        }

        // ResourceStateのインスタンスを取得
        const resourceState = ResourceState.getInstance();
        resourceState.subscribe(updateResource);

        // LoadingStateのインスタンスを取得
        const loadingState = LoadingState.getInstance();
        loadingState.subscribeResourceList(updateResourceListLoading);

        return () => {
            // クリーンアップ時にサブスクライブを解除
            resourceState.unsubscribe(updateResource);
            loadingState.unsubscribeResourceList(updateResourceListLoading);
        } 
    }, []);

    return(
        <div className="relative w-2/3 flex flex-col pr-2">
            {/* ヘッダー */}
            <div className="w-full flex">
                {currentFolderId!="base" && 
                    <IoReturnUpBack size={32}  className="text-gray-600 cursor-pointer hover:text-gray-800 p-1"
                    onClick={()=>{
                        const prevFolderId = resourceFolderHistory[resourceFolderHistory.length - 2];
                        openFolder({folderId: prevFolderId});
                        setResourceFolderHistory(resourceFolderHistory.slice(0, -1));
                    }}/>}
                <div className="grow"/>
                {selectedResourceType=="file" && (
                    <>
                    <MdEdit size={32} className="text-gray-600 cursor-pointer hover:text-gray-800 p-1"
                        onClick={()=>{setEditResourceDialogOpen(true)}}/>
                    <FaAngleDoubleUp size={32} className="text-gray-600 cursor-pointer hover:text-gray-800 p-1"
                        onClick={()=>{addPrompt(selectedResource ?? Resource.createEmpty())}}/>
                    </>
                )}
                {selectedResourceId && (
                    <>
                    <BiSolidRename size={32} className="text-gray-600 cursor-pointer hover:text-gray-800 p-1"
                        onClick={()=>{setRenameDialogOpen(true)}}/>
                    <MdDelete size={32} className="text-gray-600 cursor-pointer hover:text-gray-800 p-1"
                        onClick={()=>{setDeleteDialogOpen(true)}}/>
                    </>
                )}
                <AiFillFileAdd size={32} className="text-gray-600 cursor-pointer hover:text-gray-800 p-1"
                    onClick={()=>{setNewFileDialogOpen(true)}}/>
                <AiFillFolderAdd size={32} className="text-gray-600 cursor-pointer hover:text-gray-800 p-1"
                    onClick={()=>{setNewFolderDialogOpen(true)}}/>
            </div>
            
            {/* フォルダーリスト */}
            { resourceFolders.map((folder) => (
                <ResourceTile
                    key={folder.id}
                    type="folder"
                    name={folder.name}
                    isSelected={selectedResourceId === folder.id}
                    onClick={() => {
                        selectResource({id: folder.id, type: "folder"});
                    }}
                    onDoubleClick={()=>{
                        openFolder({folderId : folder.id});
                        setResourceFolderHistory([...resourceFolderHistory, folder.id]);
                        selectResource({id: null, type: null})
                    }}
                    />
                ))
            }

            {/* ファイルリスト */}
            {resourceFiles.map((file) => (
               <ResourceTile
                   key={file.id}
                   type="file"
                   name={file.name}
                   isSelected={selectedResourceId === file.id}
                   onClick={()=>{
                       selectResource({id:file.id, type: "file"});
                       selectFile({file:file})
                   }}
                   />
               ))
            }

            <NewFolderDialog 
               isOpen={newFolderDialogOpen} 
               onClose={()=>{setNewFolderDialogOpen(false)} } 
               onCreate={(folderName)=>{
                   addFolder({currentFolderId:currentFolderId, name:folderName});
                   setNewFolderDialogOpen(false)}}/>
                        
            <NewFileDialog 
                isOpen={newFileDialog} 
                onClose={()=>{setNewFileDialogOpen(false)}} 
                onCreate={async (fileName)=>{
                    setNewFileDialogOpen(false);
                    await addFile({fileName: fileName, currentFolderId: currentFolderId});
                    setEditResourceDialogOpen(true);
            }}/>

            <RenameDialog 
                isOpen={renameDialogOpen}
                onClose={()=>{setRenameDialogOpen(false)}}
                onRename={(name)=>{
                    changeResourceName({resourceId:selectedResourceId ?? "", name:name});
                    setRenameDialogOpen(false);
                    selectResource({id: null, type: null})
            }}/>

            <ConfirmDialog 
                isOpen={deleteDialogOpen} 
                title={"削除しますか？"} 
                message={"一度削除したら元に戻せません。"} 
                onConfirm={function (): void {
                    if(selectedResourceType=="file"){
                        removeFile({fileId:selectedResourceId ?? "", parentFolderId:currentFolderId})
                    }else{
                        removeFolder({folderId:selectedResourceId ?? "", parentFolderId:currentFolderId});
                    }

                    selectResource({id: null, type: null});
                    setDeleteDialogOpen(false);
                }} 
                onCancel={function (): void {
                    setDeleteDialogOpen(false);
                }}/>

                <EditResourceDialog 
                    isOpen={editResourceDialogOpen}
                    onClose={function (): void {
                        setEditResourceDialogOpen(false);
                    } }
                    onUpdate={function ({ title, genre, description, prompt }: { title: string; genre: ResourceGenre; description: string; prompt: string; }): void {
                        if (selectedResource) {
                            editResource({
                                id:          selectedResource.id,
                                title:       title,
                                genre:       genre,
                                description: description,
                                prompt:      prompt
                            });

                            setEditResourceDialogOpen(false);
                        }
                    } } 
                    toUpdateResource={selectedResource ?? undefined}                        
                />

                { isResourceListLoading && <LoadingSpinner />}
        </div>

    );
}

export default ResourceList;