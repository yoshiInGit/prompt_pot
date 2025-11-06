import { getGenerativeModel } from "firebase/ai";
import { ai } from "../../firebase";


// Create a `GenerativeModel` instance with a model that supports your use case
const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

export const invokeGemini25Flash = async (prompt: string): Promise<string> => {
    // To generate text output, call generateContent with the text input
  const result = await model.generateContent(prompt);

  const response = result.response;
  return response.text();
}