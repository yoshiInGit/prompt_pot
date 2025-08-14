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