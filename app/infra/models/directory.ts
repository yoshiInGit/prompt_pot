/*
    ディレクトリ（フォルダ・ファイル）のモデルを定義する
    フォルダとファイルの基本的な情報を保持するための型定義
*/

export type Folder = {
    id   : string,
    name : string,
}

export type File = {
    id   : string,
    name : string
}
