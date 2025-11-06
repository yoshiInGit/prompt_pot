import { Folder, File } from "@/app/infra/models/directory";
import { Resource } from "@/app/infra/models/resource";

// 現在表紙しているリソース欄の状態を管理するシングルトン
type OnChange  = ({currentFolderId, folders, files, selectedResource}:{currentFolderId:string, folders:Folder[], files:File[], selectedResource:Resource|null})=>void

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
  
  public currentFolderId : string = "base"; // 現在表示しているリソース欄が何かのフォルダの中にあるかどうか。（上位のフォルダに戻れるか）
  public folders: Folder[] = [];
  public files : File[] = [];
  public selectedResource : Resource | null = null

  private subscribers : OnChange[] = []

  public subscribe = (onChange : OnChange) => {
    this.subscribers.push(onChange);
  } 

  public unsubscribe = (onChange : OnChange) => {
    this.subscribers.filter(sub => sub !== onChange);
  }

  public notify = () => {
    this.subscribers.forEach(sub => sub({currentFolderId:this.currentFolderId, folders:this.folders, files:this.files, selectedResource:this.selectedResource}));
  }

}

export default ResourceState;