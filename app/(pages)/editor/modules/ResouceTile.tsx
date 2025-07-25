import { FaFolder } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import { MdEdit } from "react-icons/md";


interface ResourceTileCardProps {
  type?: "folder" | "file";
  onClick?: () => void;
  name?: string;
  onEdit?: () => void;
}

const ResourceTile : React.FC<ResourceTileCardProps> = ({
    type = "folder",
    onClick = () => {},
    name = "Resource Name",
    onEdit = () => {}
}) => {
    return (
        <div className="w-full flex items-center border-b-gray-400 border-b-1 px-2 py-3 cursor-pointer hover:bg-gray-100"
            onClick={onClick}>
            {type === "file" ? (
                <FaFile size={24} color="gray" className="mr-2"/>
            ) : (
                <FaFolder size={24} color="gray" className="mr-2"/>
            )}

            <div className="flex-grow text-gray-600 font-semibold">{name}</div>
            <MdEdit size={20} color="gray" className="cursor-pointer"
                onClick={(e)=>{e.stopPropagation();onEdit()}}/>
        </div>
    );
}

export default ResourceTile;