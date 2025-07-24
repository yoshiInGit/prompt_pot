'use client';
import React, { useRef } from "react";
import { FaFile } from "react-icons/fa";

interface FileProps {
  onClick?: () => void;
  onDoubleClick?: () => void;
  name?: string;
}

const File: React.FC<FileProps> = ({
  onClick,
  onDoubleClick,
  name = "File Name",
}) => {

  // クリックタイマーのIDを保持するref。nullまたはnumber型。
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  // クリック回数を保持するref。number型。
  const clickCount = useRef<number>(0);

    //   ダブルクリックの判定を行うための関数
  const handleClick = () => {
    clickCount.current += 1;

    if (clickCount.current === 1) {
      // 最初のクリックの場合、ダブルクリックの可能性を考慮してタイマーを設定
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
        <div className="relative m-4 cursor-pointer flex flex-col justify-center items-center"
             onClick={handleClick}>
            <FaFile color="white" size={72}/>
            <div className="text-white mt-2">{name}</div>
        </div>
    )
}

export default File;