import { getAllContents } from "@/app/repository/content";
import ContentState from "../state/content_state";
import LoadingState from "../state/loading_state";
import { addContent} from "@/app/repository/content";
import { Content } from "@/app/models/contents";
import { v4 as uuidv4 } from 'uuid';


export const restoreContents = async () => {
    const loadingState = LoadingState.getInstance();
    const contentState = ContentState.getInstance();

    loadingState.isContentLoading = true;
    loadingState.notifyContentSub();

    const contents = await getAllContents();
    
    contentState.contents = contents;
    contentState.notify();

    loadingState.isContentLoading = false;
    loadingState.notifyContentSub();
} 

export const createContent = async ({name}:{name:string}) => {
    const loadingState = LoadingState.getInstance();
    const contentState = ContentState.getInstance();

    loadingState.isContentLoading = true;
    loadingState.notifyContentSub();

    // 新しいコンテンツを作成
    const content = new Content({id: uuidv4(), name: name});

    // データベースに追加
    await addContent({content: content});

    // ステートに追加
    contentState.contents.push(content);
    contentState.notify();

    loadingState.isContentLoading = false;
    loadingState.notifyContentSub();
}