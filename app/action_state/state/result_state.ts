
type OnChange  = ({result}:{result:string})=>void

class ResultState {
    private static instance: ResultState;
  
    // プライベートコンストラクタ - 外部からのインスタンス化を防ぐ
    private constructor() {
        // 初期化処理をここに記述
        this.initialize();
    }
  
    // シングルトンインスタンスを取得するメソッド
    public static getInstance(): ResultState {
        if (!ResultState.instance) {
        ResultState.instance = new ResultState();
        }
        return ResultState.instance;
    }
  
    // 初期化処理
    private initialize(): void {
        // リソースの初期化処理をここに実装
        console.log('ResourceState initialized');
    }
  
    // シングルトンのクローンを防ぐ
    public clone(): never {
        throw new Error('Cannot clone singleton instance');
    }
  
    private subscribers: OnChange[] = [];

    public result: string = ""; // 結果の状態

    public subscribe = (onChange: OnChange) => {
        this.subscribers.push(onChange);
    }
    
    public unsubscribe = (onChange: OnChange) => {
        this.subscribers = this.subscribers.filter(sub => sub !== onChange);
    }

    public notify = () => {
        this.subscribers.forEach(sub => sub({result: this.result}));
    }

}

export default ResultState;