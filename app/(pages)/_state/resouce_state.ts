import { Folder, File } from "@/app/models/directory";

// 現在表紙しているリソース欄の状態を管理するシングルトン
type OnChange  = ({isNested, folders, files}:{isNested:boolean, folders:Folder[], files:File[]})=>void

class ResourceState {
  private static instance: ResourceState;
  
  // プライベートコンストラクタ - 外部からのインスタンス化を防ぐ
  private constructor() {
    // 初期化処理をここに記述
    this.initialize();
  }
  
  // シングルトンインスタンスを取得するメソッド
  public static getInstance(): ResourceState {
    if (!ResourceState.instance) {
      ResourceState.instance = new ResourceState();
    }
    return ResourceState.instance;
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
  
  private isNested : boolean = false; // 現在表示しているリソース欄が何かのフォルダの中にあるかどうか。（上位のフォルダに戻れるか）
  private folders: Folder[] = [];
  private files : File[] = [];

  private subscribers : OnChange[] = []

  public subscribe = (onChange : OnChange) => {
    this.subscribers.push(onChange);
  } 

  public unsubscribe = (onChange : OnChange) => {
    this.subscribers.filter(sub => sub !== onChange);
  }

  public notify = () => {
    this.subscribers.forEach(sub => sub({isNested:this.isNested, folders:this.folders, files:this.files}));
  }

}

export default ResourceState;