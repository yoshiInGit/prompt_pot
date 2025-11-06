/*
    コンテンツ（各タスクの存在を定義するもの）を管理するアクション群
    コンテンツ自体はIDと名前のみを持ち、各タスクの詳細な情報（所有しているプロンプトなど）は別途管理さているので注意。
*/



import * as contentRepo from "@/app/infra/repository/content";
import ContentState from "../state/content_state";
import LoadingState from "../state/loading_state";
import { addContent} from "@/app/infra/repository/content";
import { Content } from "@/app/infra/models/contents";
import { v4 as uuidv4 } from 'uuid';

// サービス起動時にコンテンツの復元を行うためのアクション
export const restoreContents = async () => {
    const loadingState = LoadingState.getInstance();
    const contentState = ContentState.getInstance();

    loadingState.isContentLoading = true;
    loadingState.notifyContentSub();

    const contents = await contentRepo.getAllContents();
    
    contentState.contents = contents;
    contentState.notify();

    loadingState.isContentLoading = false;
    loadingState.notifyContentSub();
} 

// 新規にコンテンツを作成するアクション
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

// コンテンツの名前を変更するアクション
export const renameContent = async ({contentId, name}:{contentId:string, name:string}) => {
    const loadingState = LoadingState.getInstance();
    const contentState = ContentState.getInstance();

    loadingState.isContentLoading = true;
    loadingState.notifyContentSub();

    // DBの更新
    await contentRepo.updateContent({content: new Content({id: contentId, name: name})});

    // コンテンツの名前を更新
    const contentIndex = contentState.contents.findIndex(content => content.id === contentId);
    if (contentIndex !== -1) {
        contentState.contents[contentIndex].name = name;
        contentState.notify();
    } else {
        console.error(`Content with id ${contentId} not found`);
    }
    contentState.notify();


    loadingState.isContentLoading = false;
    loadingState.notifyContentSub();
}

// コンテンツを削除するアクション
export const deleteContent = async ({contentId}:{contentId:string}) => {
    const loadingState = LoadingState.getInstance();
    const contentState = ContentState.getInstance();

    loadingState.isContentLoading = true;
    loadingState.notifyContentSub();

    // DBから削除
    await contentRepo.deleteContent({contentId: contentId});

    // ステートから削除
    const contentIndex = contentState.contents.findIndex(content => content.id === contentId);
    if (contentIndex !== -1) {
        contentState.contents.splice(contentIndex, 1);
        contentState.notify();
    } else {
        console.error(`Content with id ${contentId} not found`);
    }
    contentState.notify();

    loadingState.isContentLoading = false;
    loadingState.notifyContentSub();
} 