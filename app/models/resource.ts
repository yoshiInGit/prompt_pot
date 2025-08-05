export enum ResourceGenreType {
    INSTRUCTION = "instruction",
    CONTEXT     = "context",
    FORMAT      = "format",
    CONSTRAINT  = "constraint",
    OTHER       = "other"
}

export class ResourceGenre {
    genre : ResourceGenreType = ResourceGenreType.OTHER;

    constructor(genre: ResourceGenreType){
        this.genre = genre;
    }

    name(){
        switch(this.genre){
            case ResourceGenreType.INSTRUCTION: return "指示";
            case ResourceGenreType.CONTEXT:     return "コンテキスト";
            case ResourceGenreType.FORMAT:      return "フォーマット";
            case ResourceGenreType.CONSTRAINT:  return "制約条件";
            case ResourceGenreType.OTHER:       return "その他";
        }
        return "その他";
    }
}

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
}