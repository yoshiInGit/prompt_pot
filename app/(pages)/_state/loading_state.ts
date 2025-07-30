// 現在表紙しているリソース欄の状態を管理するシングルトン
type OnChange  = ({isLoading}:{isLoading:boolean})=>void

class LoadingState {
  private static instance: LoadingState;
  
  // プライベートコンストラクタ - 外部からのインスタンス化を防ぐ
  private constructor() {
    // 初期化処理をここに記述
    this.initialize();
  }
  
  // シングルトンインスタンスを取得するメソッド
  public static getInstance(): LoadingState {
    if (!LoadingState.instance) {
      LoadingState.instance = new LoadingState();
    }
    return LoadingState.instance;
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
  

  // リソース一覧のロード中かどうか
  public isResourceListLoading : boolean = false; // リソース一覧のロード中かどうか

  private resourceListSubscribers : OnChange[] = []

  public subscribeResourceList = (onChange : OnChange) => {
    this.resourceListSubscribers.push(onChange);
  } 

  public unsubscribeResourceList = (onChange : OnChange) => {
    this.resourceListSubscribers.filter(sub => sub !== onChange);
  }

  public notifyResourceListSub = () => {
    this.resourceListSubscribers.forEach(sub => sub({isLoading:this.isResourceListLoading}));
  }

}

export default LoadingState;