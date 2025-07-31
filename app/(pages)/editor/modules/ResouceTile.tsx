'use client';
import { useRef } from "react";
import { FaFolder } from "react-icons/fa";
import { FaFile } from "react-icons/fa";


interface ResourceTileCardProps {
  type?: "folder" | "file";
  onClick?: () => void;
  onDoubleClick?: ()=>void;
  name?: string;
  isSelected?: boolean;
}

const ResourceTile : React.FC<ResourceTileCardProps> = ({
    type = "folder",
    onClick = () => {},
    name = "Resource Name",
    isSelected = false,
    onDoubleClick = () => {}
}) => {


    // ダブルクリックの判定を行うための関数
    const clickTimer = useRef<NodeJS.Timeout | null>(null);
    const clickCount = useRef<number>(0);
    const handleClick = () => {
      clickCount.current += 1;

      if (clickCount.current === 1) {
        clickTimer.current = setTimeout(() => {
          if (onClick) {
            onClick(); // シングルクリックイベントを発火
          }
          clickCount.current = 0; // カウントをリセット
        }, 300); // 300ms 以内の2回目のクリックをダブルクリックと判定

      } else if (clickCount.current === 2) {
        // 2回目のクリックの場合（ダブルクリック）
        if (clickTimer.current) {
          clearTimeout(clickTimer.current); // シングルクリックのタイマーをクリア
        }
        if (onDoubleClick) {
          onDoubleClick(); // ダブルクリックイベントを発火
        }
        clickCount.current = 0; // カウントをリセット
      }
    };


    return (
        <div className={`"w-full flex items-center border-b-gray-400 border-b-1 px-2 py-3 cursor-pointer hover:bg-gray-100" ${isSelected ? "bg-gray-100" : ""}`}
            onClick={handleClick}>
            {type === "file" ? (
                <FaFile size={24} color="gray" className="mr-2"/>
            ) : (
                <FaFolder size={24} color="gray" className="mr-2"/>
            )}

            <div className="flex-grow text-gray-600 font-semibold">{name}</div>
        </div>
    );
}

export default ResourceTile;