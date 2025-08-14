import { IoIosRemoveCircle } from "react-icons/io";
import React from "react";

interface AdditionalPromptCardProps {
  onClick?: () => void;
  name?: string;
  description?: string;
  color?: string;
  onRemove?: () => void;
}

const AdditionalPromptCard: React.FC<AdditionalPromptCardProps> = ({
    onClick = () => {},
    name = "Resource Name",
    description = "This is a description of the additional prompt.",
    color = "#fc63ff",
    onRemove = () => {}
}) => {
    return (
        <div className="w-full bg-white h-20 shadow-md py-2 px-2 rounded flex flex-col cursor-pointer">
            <div className="flex justify-between items-center mb-1">
                {/* カラー表示 */}
                <div className={`w-16 h-2`}
                    style={{backgroundColor:color}}/>
                <div className="flex-grow"/>
                <IoIosRemoveCircle size={20} color="gray" className="cursor-pointer"
                    onClick={(e)=>{e.stopPropagation();onRemove()}}/>
            </div>
            <div className="font-semibold text-gray-800">{name}</div>
            <div className="w-full flex-grow text-sm text-gray-600 truncate ">
                {description}
            </div>
        </div>
    );
}
export default AdditionalPromptCard;