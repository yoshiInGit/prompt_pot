import { Resource, ResourceGenre } from "@/app/models/resource";
import React from "react";

interface ResourceDialogProps {
  isOpen: boolean;
  toUpdateResource? : Resource;
  onClose: () => void;
  onUpdate: ({title, genre, description, prompt}:{title:string, genre:ResourceGenre, description:string, prompt:string}) => void;
}

const EditResourceDialog : React.FC<ResourceDialogProps> = ({
    isOpen,
    toUpdateResource,
    onClose,
    onUpdate
}) => {
    const [title, setTitle] = React.useState(toUpdateResource?.title ?? "");
    const [genre, setGenre] = React.useState(toUpdateResource?.genre ?? ResourceGenre.getAllGenres()[0]);
    const [description, setDescription] = React.useState(toUpdateResource?.description ?? "");
    const [prompt, setPrompt] = React.useState(toUpdateResource?.prompt ?? "");

    if (!isOpen) {
        return null;
    }

    return(
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[70%] h-[90%] p-4 flex gap-2">

                <div className="flex flex-col w-1/2">
                    <div className="text-sm font-bold text-gray-600">タイトル</div>
                    <input
                      type="text"
                      className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                      placeholder="タイトルを入力"
                      defaultValue={toUpdateResource?.title ?? ""}
                      onChange={(e) => setTitle(e.target.value)}
                    />

                    <div className="text-sm font-bold text-gray-600">分類</div>
                    <select id="dropdown" className="block w-full pl-3 pr-10 py-2 text-gray-700 leading-tight border border-gray-400 focus:outline-none rounded-md cursor-pointer mb-2"
                        onChange={(e) => {
                            const selectedGenre = ResourceGenre.getAllGenres().find(g => g.genre === e.target.value);
                            if (selectedGenre) {
                                setGenre(selectedGenre);
                            }
                        }}>

                        <option value="" hidden>{toUpdateResource?.genre.name()}</option>   
                        { ResourceGenre.getAllGenres().map((genre) => (
                            <option key={genre.genre} value={genre.genre}>{genre.name()}</option>
                        ))}
                    </select>

                    <div className="text-sm font-bold text-gray-600">説明</div>
                    <textarea 
                        rows={8}
                        className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none mb-4"
                        placeholder="プロンプトの説明..."
                        defaultValue={toUpdateResource?.description ?? ""}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="flex flex-col w-1/2">
                    <div className="text-sm font-bold text-gray-600">プロンプト</div>
                    <textarea 
                        className="grow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none mb-4"
                        placeholder="プロンプト..."
                        defaultValue={toUpdateResource?.prompt ?? ""}
                        onChange={(e) => setPrompt(e.target.value)}
                    ></textarea>

                    <div className="w-full flex justify-end gap-2">
                        <button
                          className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
                          onClick={onClose}>
                          キャンセル
                        </button>
                        <button
                          className="px-4 py-2 text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                          onClick={() => {
                            onUpdate({
                                title: title,
                                genre: genre,
                                description: description,
                                prompt: prompt
                            });
                          }}>
                          更新
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default EditResourceDialog