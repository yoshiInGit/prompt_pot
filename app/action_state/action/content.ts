import { getAllContents } from "@/app/repository/content";
import ContentState from "../state/content_state";
import LoadingState from "../state/loading_state";

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