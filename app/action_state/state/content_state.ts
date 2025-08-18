import { Content } from "@/app/models/contents";

type OnChange  = ({contents}:{contents:Content[]})=>void

class ContentState {
    private static instance: ContentState;
  
    // プライベートコンストラクタ - 外部からのインスタンス化を防ぐ
    private constructor() {
        // 初期化処理をここに記述
        this.initialize();
    }
  
    // シングルトンインスタンスを取得するメソッド
    public static getInstance(): ContentState {
        if (!ContentState.instance) {
        ContentState.instance = new ContentState();
        }
        return ContentState.instance;
    }
  
    // 初期化処理
    private initialize(): void {
        // リソースの初期化処理をここに実装
        console.log('ContentState initialized');
    }
  
    // シングルトンのクローンを防ぐ
    public clone(): never {
        throw new Error('Cannot clone singleton instance');
    }
  
    private subscribers: OnChange[] = [];

    public contents: Content[] = []; // 結果の状態

    public subscribe = (onChange: OnChange) => {
        this.subscribers.push(onChange);
    }
    
    public unsubscribe = (onChange: OnChange) => {
        this.subscribers = this.subscribers.filter(sub => sub !== onChange);
    }

    public notify = () => {
        this.subscribers.forEach(sub => sub({contents: this.contents}));
    }


    public editingContentId: string | null = null; // 編集中のコンテンツID
}

export default ContentState;