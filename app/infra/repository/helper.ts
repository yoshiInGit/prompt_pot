/*
    Firebase操作時の共通ヘルパー
*/

// Firebase操作時のエラーハンドリングを行う共通関数
export const onTryFirebase =  async <T>(method: () => Promise<T>): Promise<T> => {
    try {
        return await method()
    } catch (error) {

        //TODO: エラーハンドリングを適切に行う
        console.error("Firebaseの操作に失敗しました:", error);
        // 必要に応じて throw する
        throw new Error("Firebaseの操作に失敗しました");
    }
}