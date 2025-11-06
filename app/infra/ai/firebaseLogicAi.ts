/*
  FirebaseのGenerative AIを操作するロジック群
*/

import { getGenerativeModel } from "firebase/ai";
import { ai } from "../../firebase";


// gemnini-2.5-flashモデルの取得
const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

// Gemini 2.5 Flashモデルを呼び出して、プロンプトに対する応答を取得する関数
export const invokeGemini25Flash = async (prompt: string): Promise<string> => {
    // To generate text output, call generateContent with the text input
  const result = await model.generateContent(prompt);

  const response = result.response;
  return response.text();
}