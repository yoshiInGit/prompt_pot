/*
    プロンプトの実行や管理を行うアクション群。生成結果の管理も含む。
    プロンプトの情報はコンテンツごとに管理されるため、コンテンツIDの情報を元に取得操作を行っている
    プロンプトの状態はPromptStateに保存されている。実行ごとに取得しているわけではないので注意。
*/

import { groupResourcesByGenre, Resource, sortResourcesByGenre } from "@/app/infra/models/resource";
import PromptState from "../state/prompt_state";
import { getAdditionalPromptIds, getBasePrompt, getResult, registerAdditionalPrompt, setBasePrompt, setResult, unregisterAdditionalPrompt } from "@/app/infra/repository/prompt";
import { getResourceById } from "@/app/infra/repository/resources";
import { invokeGemini25Flash } from "@/app/infra/ai/firebaseLogicAi";
import LoadingState from "../state/loading_state";
import ResultState from "../state/result_state";
import ContentState from "../state/content_state";

// プロンプトの実行を行う。
// ベースプロンプトと追加プロンプトをもとに組み立ててAIに送信し、結果を取得する。
// プロンプトはPromptStateから取得する。
export const executePrompt = async ({basePrompt}:{basePrompt:string}) => {

    console.log("Executing prompt with base:", basePrompt);

    const loadingState = LoadingState.getInstance();
    const resultState  = ResultState.getInstance();
    const promptState  = PromptState.getInstance();
    const contentState = ContentState.getInstance();

    
    loadingState.isResultLoading = true;
    loadingState.notifyResultSub();

    // プロンプトの組み立て
    const additionalPrompts = promptState.additionalPrompts;
    const prompt = _buildPrompt(basePrompt, additionalPrompts);
    console.log("Constructed prompt:", prompt);

    // AIにプロンプトを送信して結果を取得
    const result = await invokeGemini25Flash(prompt);

    console.log("Received result:", result);

    // 結果をステートに保存
    resultState.result = result;
    resultState.notify();

    // ローディング状態を更新
    loadingState.isResultLoading = false;
    loadingState.notifyResultSub();

    // DBに結果を保存
    await setResult({result: result, contentId: contentState.editingContentId || ""});

}

// プロンプトを実行する際に、ベースプロンプトと追加プロンプトを組み立てる関数
// ジャンルごとにタグで囲むなどの処理を行う+マークダウン形式での出力指示を追加
const _buildPrompt = (basePrompt: string, additionalPrompts: Resource[]): string => {    
    let prompt = "";

    //　基本の命令を追加。マークダウン形式での出力を指示
    prompt += "Execute the 'Base Prompt' but also follow the instructions specified in the 'Additional Conditions'."
    prompt += "Please output the result in **Markdown format** with the following guidelines:\n\n- Use **headings** (\\`#\\`, \\`##\\`, \\`###\\`) to organize sections clearly.\n- Use **bullet points** or **numbered lists** for step-by-step explanations or grouped items.\n- Apply **bold** or *italic* text to highlight important points.\n- Insert proper **line breaks** and spacing for better readability.\n- Use **code blocks** (\\`\\`\\`) when showing code or commands.\n- Add **blockquotes** (>) when emphasizing key notes or tips.\n\nMake sure the final output looks **structured, visually clear, and easy to read**.";

    // ベースプロンプトを追加
    prompt += "<Base Prompt>" + basePrompt + "</Base Prompt>";

    // 追加プロンプトを追加していく
    const groupedResources = groupResourcesByGenre(additionalPrompts);

    prompt += "<Additional Condition>" 
        
    // 各ジャンルごとにプロンプトを追加
    // ここでは、ジャンルごとにタグを付けてプロンプトをまとめる
    prompt += Object.entries(groupedResources)
        .filter(([, resources]) => resources.length > 0) // 空ジャンルはスキップ
        .map(([genreKey, resources]) => {
          const tagName = genreKey // タグ名
          const inner = resources.map(r => `<>${r.prompt}</>`).join("");
          return `<${tagName}>${inner}<${tagName}/>`;
        })
        .join("");
    
    prompt += "</Additional Condition>"

    return prompt;

} 

// コンテンツに紐づくプロンプト情報を復元するアクション
// ベースプロンプト、追加プロンプト、結果をそれぞれ取得し、PromptStateおよびResultStateに保存する
export const restorePrompts = async ({setBasePrompt, contentID}:{setBasePrompt:(prompt:string)=>void, contentID:string}) => {
    // 追加プロンプトのIDを取得
    // IDを取得
    const contentState = ContentState.getInstance();
    contentState.editingContentId = contentID;

    const promptIds = await getAdditionalPromptIds({contentId: contentID});

    const resources: Resource[] = [];
    for(const id of promptIds){
        const resource = await getResourceById({id:id});
        if(resource){
            resources.push(resource);
        }
    }

    // ベースプロンプトを設定
    const basePrompt = await getBasePrompt({contentId: contentID});
    setBasePrompt(basePrompt);

    // 結果を復元
    const result = await getResult({contentId: contentID});
    const resultState = ResultState.getInstance();
    resultState.result = result;
    resultState.notify();

    // ステート更新
    const promptState = PromptState.getInstance();
    promptState.additionalPrompts = resources;
    promptState.additionalPrompts = sortResourcesByGenre(promptState.additionalPrompts);
    promptState.notify();
}   

// 追加プロンプトを追加するアクション
// 具体的にはリソースから指定したプロンプトをContentに紐づける
export const addPrompt = async (resource : Resource) => {
    const promptState = PromptState.getInstance();
    const contentState = ContentState.getInstance();

    const currentPrompts = promptState.additionalPrompts;
    if(currentPrompts.some(prompt => prompt.id === resource.id)) {
        // 既に存在するプロンプトを追加しようとする場合は何もしない
        return;
    }

    promptState.additionalPrompts.push(resource);
    promptState.additionalPrompts = sortResourcesByGenre(promptState.additionalPrompts);
    promptState.notify();

    // データベース更新
    await registerAdditionalPrompt({resourceId : resource.id, contentId: contentState.editingContentId || ""});
}


// 追加プロンプトを削除するアクション
export const removePrompt = async ({resourceId}:{resourceId:string}) => {
    const promptState = PromptState.getInstance();  
    const contentState = ContentState.getInstance();
    
    const currentPrompts = promptState.additionalPrompts;
    
    // 指定されたIDのプロンプトを削除
    promptState.additionalPrompts = currentPrompts.filter(prompt => prompt.id !== resourceId);
    promptState.notify();

    // データベース更新
    await unregisterAdditionalPrompt({resourceId : resourceId, contentID: contentState.editingContentId || ""});
}

// ベースプロンプトをDBに保存するアクション
export const saveBasePrompt = async ({prompt}: {prompt:string}) => {
    const contentState = ContentState.getInstance();

    await setBasePrompt({contentId: contentState.editingContentId || "", prompt: prompt});
}

// 生成結果をMDファイルとしてダウンロードするアクション
export const downloadResultMD = async () => {
    const resultState = ResultState.getInstance();
    const result = resultState.result;

    const blob = new Blob([result], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'result.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // revoke は少し遅らせて実行（1秒後）
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);

}
