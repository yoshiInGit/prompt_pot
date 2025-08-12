import { Resource } from "@/app/models/resource";

// 現在表紙しているリソース欄の状態を管理するシングルトン
type OnChange  = ({additionalPrompts}:{additionalPrompts:Resource[]})=>void

class PromptState {
    private static instance: PromptState;
  
    // プライベートコンストラクタ - 外部からのインスタンス化を防ぐ
    private constructor() {
        this.initialize();
    }
  
    // シングルトンインスタンスを取得するメソッド
    public static getInstance(): PromptState {
        if (!PromptState.instance) {
        PromptState.instance = new PromptState();
        }
        return PromptState.instance;
    }
  
    // 初期化処理
    private initialize(): void {
        console.log('PromptState initialized');
    } 
  
    // シングルトンのクローンを防ぐ
    public clone(): never {
        throw new Error('Cannot clone singleton instance');
    }
  
    private subscribers : OnChange[] = []

    public additionalPrompts : Resource[] = []; // 追加のプロンプトリソース

    public subscribe = (onChange : OnChange) => {
        this.subscribers.push(onChange);
    }
    
    public unsubscribe = (onChange : OnChange) => {
        this.subscribers = this.subscribers.filter(sub => sub !== onChange);
    }

    public notify = () => {
        this.subscribers.forEach(sub => sub({additionalPrompts: this.additionalPrompts}));
    }

}

export default PromptState;