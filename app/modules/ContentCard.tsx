'use client';
import React, { useRef } from "react";
import { RiAiGenerateText } from "react-icons/ri";

interface ContentCardProps {
  onClick?: () => void;
  onDoubleClick?: () => void;
  isSelected?: boolean;
  name?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({
  onClick,
  onDoubleClick,
  isSelected = false,
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
        <div className={`bg-white/10 backdrop-blur-lg border border-white/40 rounded-2xl shadow-lg w-1/8 relative cursor-pointer flex flex-col justify-center items-center p-2 transition duration-300`}
             onClick={handleClick}
             style={{backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.3)' : ''}}>
            <RiAiGenerateText color="#FFFFFF" size={58}/>
            <div className="text-white font-bold mt-2">{name}</div>
        </div>
    )
}

export default ContentCard;