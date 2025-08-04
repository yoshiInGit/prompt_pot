export type ResourceGenre = "a"| "b"

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