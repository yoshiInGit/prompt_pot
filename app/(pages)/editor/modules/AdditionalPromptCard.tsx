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
        <div className="w-full text-white bg-white/10 backdrop-blur-lg border border-white/40 h-22 shadow-md py-2 px-2 rounded flex flex-col cursor-pointer"
            onClick={onClick}>
            <div className="flex justify-between items-center mb-1">
                {/* カラー表示 */}
                <div className={`w-16 h-2`}
                    style={{
                        backgroundColor:color,
                        boxShadow:`0 0 10px ${color}, 0 0 40px ${color},`
                    }}/>
                <div className="flex-grow"/>
                <IoIosRemoveCircle size={20} color="white" className="cursor-pointer"
                    onClick={(e)=>{e.stopPropagation();onRemove()}}/>
            </div>
            <div className="font-semibold text-white">{name}</div>
            <div className="w-full flex-grow text-sm text-white truncate ">
                {description}
            </div>
        </div>
    );
}
export default AdditionalPromptCard;