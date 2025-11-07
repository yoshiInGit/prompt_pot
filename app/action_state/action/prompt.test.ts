import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  executePrompt,
  restorePrompts,
  addPrompt,
  removePrompt,
  saveBasePrompt,
  downloadResultMD
} from "./prompt"; // ← あなたの実際のファイルパスに合わせて
import * as promptRepo from "@/app/infra/repository/prompt";
import * as resourcesRepo from "@/app/infra/repository/resources";
import { invokeGemini25Flash } from "@/app/infra/ai/firebaseLogicAi";
import LoadingState from "../state/loading_state";
import PromptState from "../state/prompt_state";
import ResultState from "../state/result_state";
import ContentState from "../state/content_state";
import { Resource, ResourceGenre, ResourceGenreType } from "@/app/infra/models/resource";

// ---- モック設定 ----

// 各Stateはシングルトンなので getInstance をモック
let mockLoadingState: any;
let mockPromptState: any;
let mockResultState: any;
let mockContentState: any;

beforeEach(() => {
  vi.restoreAllMocks();

  mockLoadingState = {
    isResultLoading: false,
    notifyResultSub: vi.fn(),
  };
  mockPromptState = {
    additionalPrompts: [],
    notify: vi.fn(),
  };
  mockResultState = {
    result: "",
    notify: vi.fn(),
  };
  mockContentState = {
    editingContentId: "test-content-id",
  };

  vi.mocked(LoadingState.getInstance as any).mockReturnValue(mockLoadingState);
  vi.mocked(PromptState.getInstance as any).mockReturnValue(mockPromptState);
  vi.mocked(ResultState.getInstance as any).mockReturnValue(mockResultState);
  vi.mocked(ContentState.getInstance as any).mockReturnValue(mockContentState);
});

// ---- AI呼び出し・リポジトリをモック ----
vi.mock("@/app/infra/repository/prompt", () => ({
  setResult: vi.fn(),
  getAdditionalPromptIds: vi.fn(),
  getBasePrompt: vi.fn(),
  getResult: vi.fn(),
  registerAdditionalPrompt: vi.fn(),
  unregisterAdditionalPrompt: vi.fn(),
  setBasePrompt: vi.fn(),
}));
vi.mock("@/app/infra/repository/resources", () => ({
  getResourceById: vi.fn(),
}));
vi.mock("@/app/infra/ai/firebaseLogicAi", () => ({
  invokeGemini25Flash: vi.fn(),
}));

// ---- 各StateクラスのgetInstanceをモック可能にする ----
vi.mock("../state/loading_state", () => ({
  default: { getInstance: vi.fn() },
}));
vi.mock("../state/prompt_state", () => ({
  default: { getInstance: vi.fn() },
}));
vi.mock("../state/result_state", () => ({
  default: { getInstance: vi.fn() },
}));
vi.mock("../state/content_state", () => ({
  default: { getInstance: vi.fn() },
}));

// ---------------------------
// executePrompt のテスト
// ---------------------------
describe("executePrompt", () => {
  it("AI呼び出しと結果保存が正しく行われる", async () => {
    vi.mocked(invokeGemini25Flash).mockResolvedValue("AI Response");
    vi.mocked(promptRepo.setResult).mockResolvedValue();

    mockPromptState.additionalPrompts = [
      new Resource({ 
        id:          "r1", 
        title:       "Title", 
        description: "Description", 
        genre:       new ResourceGenre(ResourceGenreType.CONTEXT), 
        prompt:      "Use markdown" 
    }),
    ];

    await executePrompt({ basePrompt: "Hello" });

    expect(invokeGemini25Flash).toHaveBeenCalled();
    expect(mockResultState.result).toBe("AI Response");
    expect(mockResultState.notify).toHaveBeenCalled();
    expect(promptRepo.setResult).toHaveBeenCalledWith({
      result: "AI Response",
      contentId: "test-content-id",
    });
  });
});

// ---------------------------
// restorePrompts のテスト
// ---------------------------
describe("restorePrompts", () => {
  it("プロンプトと結果が正しく復元される", async () => {
    vi.mocked(promptRepo.getAdditionalPromptIds).mockResolvedValue(["r1", "r2"]);
    vi.mocked(resourcesRepo.getResourceById).mockImplementation(async ({ id }) => 
      new Resource({ 
        id:          "r1", 
        title:       "Title", 
        description: "Description", 
        genre:       new ResourceGenre(ResourceGenreType.CONTEXT), 
        prompt:      "Use markdown" 
       })
    );
    vi.mocked(promptRepo.getBasePrompt).mockResolvedValue("BasePrompt");
    vi.mocked(promptRepo.getResult).mockResolvedValue("ResultText");

    const setBasePrompt = vi.fn();

    await restorePrompts({ setBasePrompt, contentID: "content1" });

    expect(setBasePrompt).toHaveBeenCalledWith("BasePrompt");
    expect(mockPromptState.additionalPrompts.length).toBe(2);
    expect(mockResultState.result).toBe("ResultText");
    expect(mockResultState.notify).toHaveBeenCalled();
    expect(mockPromptState.notify).toHaveBeenCalled();
  });
});

// ---------------------------
// addPrompt のテスト
// ---------------------------
describe("addPrompt", () => {
  it("新しいプロンプトを追加し、DB更新される", async () => {
    const resource = new Resource({ 
        id:          "r1", 
        title:       "Title", 
        description: "Description", 
        genre:       new ResourceGenre(ResourceGenreType.CONTEXT), 
        prompt:      "Use markdown" 
     });
    await addPrompt(resource);

    expect(mockPromptState.additionalPrompts.length).toBe(1);
    expect(mockPromptState.notify).toHaveBeenCalled();
    expect(promptRepo.registerAdditionalPrompt).toHaveBeenCalledWith({
      resourceId: "r1",
      contentId: "test-content-id",
    });
  });

  it("同じプロンプトは追加されない", async () => {
    const resource = new Resource({ 
        id:          "r1", 
        title:       "Title", 
        description: "Description", 
        genre:       new ResourceGenre(ResourceGenreType.CONTEXT), 
        prompt:      "Use markdown" 
     });
    mockPromptState.additionalPrompts = [resource];

    await addPrompt(resource);
    
    expect(mockPromptState.additionalPrompts.length).toBe(1);

  });
});

// ---------------------------
// removePrompt のテスト
// ---------------------------
describe("removePrompt", () => {
  it("指定したプロンプトを削除し、DB更新される", async () => {
    mockPromptState.additionalPrompts = [
      new Resource({ id: "r1", title: "Title r1", description: "Description r1", genre: new ResourceGenre(ResourceGenreType.CONTEXT), prompt: "Old" }),
      new Resource({ id: "r2", title: "Title r2", description: "Description r2", genre: new ResourceGenre(ResourceGenreType.CONSTRAINT), prompt: "Another" }),
    ];

    await removePrompt({ resourceId: "r1" });

    expect(mockPromptState.additionalPrompts.length).toBe(1);
    expect(mockPromptState.additionalPrompts[0].id).toBe("r2");
    expect(promptRepo.unregisterAdditionalPrompt).toHaveBeenCalledWith({
      resourceId: "r1",
      contentID: "test-content-id",
    });
  });
});

// ---------------------------
// saveBasePrompt のテスト
// ---------------------------
describe("saveBasePrompt", () => {
  it("ベースプロンプトがDBに保存される", async () => {
    await saveBasePrompt({ prompt: "This is base" });
    expect(promptRepo.setBasePrompt).toHaveBeenCalledWith({
      contentId: "test-content-id",
      prompt: "This is base",
    });
  });
});

