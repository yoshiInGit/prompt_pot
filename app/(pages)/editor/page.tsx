'use client';

import { MdDelete, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { IoReturnUpBack } from "react-icons/io5";
import { VscPreview } from "react-icons/vsc";
import { GoCpu } from "react-icons/go";
import { FaAngleDoubleUp, FaCopy } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { BiSolidRename } from "react-icons/bi";
import AdditionalPromptCard from "./modules/AdditionalPromptCard";
import ResourceTile from "./modules/ResouceTile";
import PrevHighlightCard from "./modules/PrevHighlightCard";
import { useEffect, useRef, useState } from "react";
import { File, Folder } from "@/app/models/directory";
import ResourceState from "../../action_state/_state/resouce_state";
import { AiFillFileAdd } from "react-icons/ai";
import { AiFillFolderAdd } from "react-icons/ai";
import NewFolderDialog from "./modules/NewFolderDialog";
import LoadingSpinner from "../_common/Loading_spinner";
import LoadingState from "../../action_state/_state/loading_state";
import { addFile, addFolder, changeResourceName, openFolder, removeFile, removeFolder, restoreFolder, selectFile } from "../../action_state/_action/resouce";
import RenameDialog from "./modules/RenameFolderDialog";
import ConfirmDialog from "./modules/ConifrmDialog";
import NewFileDialog from "./modules/NewFileDialog";
import EditResourceDialog from "./modules/EditResourceDialog";
import { Resource, ResourceGenre } from "@/app/models/resource";

const Editor = () => {
    // データの復元
    const initFlag = useRef<boolean>(true);
    useEffect(() => {
        if(initFlag.current){
            // リソースの復元
            restoreFolder();
            initFlag.current = false;
        }
    }, []);

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
        <div className="absolute top-0 left-0 bottom-0 right-0 overflow-hidden flex bg-gray-200 p-4">
            
            {/* エディター画面 */}
            <div className="w-6/10 h-full overflow-hidden flex flex-col">
                {/* プロンプトエリア */}
                <div className="w-full h-1/2 overflow-hidden flex">
                    {/* ベースプロンプト */}
                    <div className="w-5/10 h-full bg-white shadow-md p-4 rounded flex flex-col">
                        <div className="flex items-center mb-2">
                            <GoCpu size={16}/>
                            <div className="text-gray-600 ml-2">Base Prompt</div>
                        </div>

                        <textarea 
                                className="flex-1 bg-white border text-sm border-white focus:border-white focus:outline-none resize-none rounded"
                                placeholder="このTextAreaはflexコンテナ内で最大限大きくなります..."
                        ></textarea>

                    </div>
                    {/* アディクションプロンプロ */}
                    <div className="relative flex-grow h-full">
                        <div className="absolute w-full h-full flex flex-col gap-2 px-2">
                                <AdditionalPromptCard />
                                <AdditionalPromptCard />
                                <AdditionalPromptCard />
                        </div>

                    </div>
                    {/* 実行ボタン */}
                    <div className="w-1/25 h-full flex items-center justify-center bg-white shadow-md mr-2 rounded-r-lg cursor-pointer">
                        <MdKeyboardDoubleArrowRight size={28} color="gray"/>
                    </div>
                </div>

                {/* リソースエリア */}
                <div className="w-full h-1/2 overflow-hidden flex pr-2 pt-2">
                    {/* リソースリスト */}
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
                                <FaAngleDoubleUp size={32} className="text-gray-600 cursor-pointer hover:text-gray-800 p-1"/>
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
                         { resourceFiles.map((file) => (
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
                            onCreate={(fileName)=>{
                                addFile({fileName: fileName, currentFolderId: currentFolderId});
                                setNewFileDialogOpen(false);
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
                                throw new Error("Function not implemented.");
                            } } 
                            toUpdateResource={undefined}                        
                            />

                        { isResourceListLoading && <LoadingSpinner />}

                    </div>

                    {/* リソースプレビュー */}
                    <div className="w-3/5 h-full bg-white shadow flex flex-col rounded">
                        <div className="flex items-center mb-2">
                            <VscPreview size={16}/>
                            <div className="text-gray-600 ml-2">Resource Preview</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* プレビュー画面 */}
            <div className="w-4/10 h-full overflow-hidden flex flex-col">
                <div className="flex-grow bg-white shadow-md p-4 rounded flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <div className="text-gray-600 font-bold">Preview</div>
                            <div className="grow"/>
                            <FaCopy size={20} className="text-gray-600 cursor-pointer hover:text-gray-800"/>
                            <IoMdDownload size={20} className="text-gray-600 cursor-pointer hover:text-gray-800"/>
                        </div>

                        <PrevHighlightCard />

                        <div className="grow w-full">
                            
                        </div>
                </div>
            </div>
        </div>
    )
}

export default Editor