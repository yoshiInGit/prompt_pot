import { MdOutlineDocumentScanner } from "react-icons/md";

const PrevHighlightCard = () => {
    return (
        <div className="bg-gray-100 :hover:bg-gray-300 h-12 w-54 border-2 border-gray-700 p-4 rounded flex items-center  cursor-pointer gap-4">
                <MdOutlineDocumentScanner />
                <div className="text-gray-600 font-bold">Highlight</div>
        </div>
    );
}

export default PrevHighlightCard;