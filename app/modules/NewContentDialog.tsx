
import React from 'react';

interface NewContentProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (folderName: string) => void;
}

const NewContentDialog: React.FC<NewContentProps> = ({ isOpen, onClose, onCreate }) => {
  const [contentName, setContentName] = React.useState<string>('');

  const handleCreate = () => {
    onCreate(contentName);
    setContentName('');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">新しいコンテンツを作成</h2>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <label htmlFor="folderName" className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              id="folderName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="新しいコンテンツ名"
              value={contentName}
              onChange={(e) => setContentName(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2 cursor-pointer"
              onClick={()=>{onClose(); setContentName('');}}
            >
              キャンセル
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
              onClick={handleCreate}
              disabled={!contentName}
            >
              作成
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewContentDialog;