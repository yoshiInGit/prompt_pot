/*
    コンテンツのモデルを定義する
    コンテンツとは、各タスクを定義するための基本的な単位
    実体としてはＩＤと名前のみを持つ
    将来的にメタデータなどを追加する可能性あり
*/

export class Content {
    id: string;
    name: string;
    constructor({id,name}:{id: string, name: string}) {
        this.id = id;
        this.name = name;
    }
}