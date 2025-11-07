/*
    リソースのモデルを定義する
    リソースとは、タスクごとに利用可能なプロンプトのテンプレートなどを指す
    それぞれジャンル分けがされており、ジャンルごとに色分けなどがされる
*/


// リソースのジャンルタイプ定義
export enum ResourceGenreType {
    INSTRUCTION = "instruction",
    CONTEXT     = "context",
    FORMAT      = "format",
    CONSTRAINT  = "constraint",
    OTHER       = "other"
}

// リソースのジャンルモデル
// ジャンルタイプに応じた名称や色を取得するメソッドを持つ
export class ResourceGenre {
    genre : ResourceGenreType = ResourceGenreType.OTHER;

    constructor(genre: ResourceGenreType){
        this.genre = genre;
    }

    static getAllGenres(): ResourceGenre[] {
        return [
            new ResourceGenre(ResourceGenreType.INSTRUCTION),
            new ResourceGenre(ResourceGenreType.CONTEXT),
            new ResourceGenre(ResourceGenreType.FORMAT),
            new ResourceGenre(ResourceGenreType.CONSTRAINT),
            new ResourceGenre(ResourceGenreType.OTHER)
        ];
    }

    name(){
        switch(this.genre){
            case ResourceGenreType.INSTRUCTION: return "指示";
            case ResourceGenreType.CONTEXT:     return "コンテキスト";
            case ResourceGenreType.FORMAT:      return "フォーマット";
            case ResourceGenreType.CONSTRAINT:  return "制約条件";
            case ResourceGenreType.OTHER:       return "その他";
        }
    }

    color(): string {
        switch(this.genre){
            case ResourceGenreType.INSTRUCTION: return "#ff6373";
            case ResourceGenreType.CONTEXT:     return "#83ff63";
            case ResourceGenreType.FORMAT:      return "#5e66ff";
            case ResourceGenreType.CONSTRAINT:  return "#ffe44d";
            case ResourceGenreType.OTHER:       return "#fc63ff";
        }
    }
}


// リソースモデル
// 各リソースの基本的な情報を保持する
export class Resource  {
    id: string
    title : string
    genre : ResourceGenre
    description : string
    prompt : string

    constructor({id, title, genre, description, prompt}:{id:string, title:string, genre:ResourceGenre, description:string, prompt:string}){
        this.id = id
        this.title = title
        this.genre = genre
        this.description = description
        this.prompt = prompt
    }

    static createEmpty(id?: string): Resource {
        return new Resource({
            id: id ?? "",
            title: "",
            genre: new ResourceGenre(ResourceGenreType.OTHER),
            description: "",
            prompt: ""
        });
    }
}


// リソース固有のメソッド
// ジャンルごとにソートやグループ化を行う
export const sortResourcesByGenre = (resources: Resource[]): Resource[] => {
    const genreOrder = [
        ResourceGenreType.INSTRUCTION,
        ResourceGenreType.CONTEXT,  
        ResourceGenreType.FORMAT,
        ResourceGenreType.CONSTRAINT,
        ResourceGenreType.OTHER
    ];
    return resources.sort((a, b) => {
        const genreIndexA = genreOrder.indexOf(a.genre.genre);
        const genreIndexB = genreOrder.indexOf(b.genre.genre);
        return genreIndexA - genreIndexB;
    });
} 

export const groupResourcesByGenre = (
  resources: Resource[]
): Record<ResourceGenreType, Resource[]> => {
  return resources.reduce<Record<ResourceGenreType, Resource[]>>((acc, resource) => {
    const key = resource.genre.genre; // ResourceGenreType
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(resource);
    return acc;
  }, {
    [ResourceGenreType.INSTRUCTION]: [],
    [ResourceGenreType.CONTEXT]: [],
    [ResourceGenreType.FORMAT]: [],
    [ResourceGenreType.CONSTRAINT]: [],
    [ResourceGenreType.OTHER]: []
  });
};
