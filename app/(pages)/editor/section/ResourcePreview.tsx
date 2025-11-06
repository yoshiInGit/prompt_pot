import ResourceState from "@/app/action_state/state/resource_state";
import { Folder, File } from "@/app/infra/models/directory";
import { Resource } from "@/app/infra/models/resource";
import { useEffect, useState } from "react";
import { MdClass } from "react-icons/md";
import { VscPreview } from "react-icons/vsc";

const ResourcePreview = () => {
    const [selectedResource, setSelectedResource] = useState<Resource|null>(null);

    // selectedResourceのをstateと同期
    useEffect(() => {
        const updateResource = ({currentFolderId, folders, files, selectedResource}: {currentFolderId: string, folders: Folder[], files: File[], selectedResource:Resource|null}) => {
                    setSelectedResource(selectedResource)
        }

        // ResourceStateのインスタンスを取得
        const resourceState = ResourceState.getInstance();
        resourceState.subscribe(updateResource);

        return () => {
            resourceState.unsubscribe(updateResource);
        }
    }, []);
    
    return(
        <div className="no-scrollbar w-3/5 h-full text-white bg-white/10 backdrop-blur-lg border border-white/40 shadow flex flex-col rounded p-2 overflow-scroll overflow-x-hidden">
            <div className="flex items-center mb-1">
                <VscPreview size={16}/>
                <div className="text-white ml-1">Resource Preview</div>
            </div>
            {selectedResource && 
            (<>
                <div className="text-sm font-bold mb-1">{selectedResource.title}</div>
                <div className="flex items-center mb-2">
                    <MdClass/>
                    <div className="text-xs font-bold">{selectedResource.genre.name()}</div>
                </div>
                
                <div className="text-sm mb-2 border-y-1 border-white py-2">
                     {selectedResource.description}
                </div>
                
                <div className="text-sm whitespace-pre-wrap">
                    {selectedResource.prompt}
                </div>
            </>)}
        
        </div>
    )
}

export default ResourcePreview;