import { doc, runTransaction} from "firebase/firestore";
import { Folder } from "../models/directory";
import { db } from "../firebase";

export const addResourceFolder = async (folder: Folder): Promise<void> => {
    try {
        await runTransaction(db, async (transaction) => {
            // /base/resources/folders に新しいフォルダ情報をセット
            transaction.set(doc(db, "base", "resources", "folders", folder.id), {
                folders: [] as string[],
                files: [] as string[],
            });

            // /base/resources の id2name にフォルダ名を追加
            transaction.update(doc(db, "base", "resources"), {
                [`id2name.${folder.id}`]: folder.name
            });
        });
        console.log("フォルダの追加に成功しました:", folder.id);
    } catch (error) {
        
        //TODO: エラーハンドリングを適切に行う
        console.error("フォルダの追加に失敗しました:", error);
        // 必要に応じて throw する
        throw new Error("フォルダの追加に失敗しました。もう一度お試しください。");
    }
};