import { describe, it, expect, vi, beforeEach } from "vitest";
import * as resourceRepo from "@/app/infra/repository/resources";
import { addFile } from "./resource";
import { ResourceGenre } from "@/app/infra/models/resource";
import { File } from "@/app/infra/models/directory";

vi.mock("@/app/infra/repository/resources", () => ({
  addResource: vi.fn(),
}));

// 各Stateクラスをモック化
const mockNotify = vi.fn();

const mockResourceState = {
  currentFolderId: "base",
  folders: [],
  files: [] as File[],
  selectedResource: null,
  notify: mockNotify,
};

const mockLoadingState = {
  isResourceListLoading: false,
  notifyResourceListSub: vi.fn(),
};

const mockPromptState = {
  additionalPrompts: [],
  notify: vi.fn(),
};

vi.mock("../state/resource_state", () => ({
  default: {
    getInstance: vi.fn(() => mockResourceState),
  },
}));

vi.mock("../state/loading_state", () => ({
  default: {
    getInstance: vi.fn(() => mockLoadingState),
  },
}));

vi.mock("../state/prompt_state", () => ({
  default: {
    getInstance: vi.fn(() => mockPromptState),
  },
}));

describe("addFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockResourceState.files = [];
    mockResourceState.currentFolderId = "base";
  });

  it("should add a new file and update ResourceState", async () => {
    // 実行
    await addFile({ fileName: "NewFile", currentFolderId: "base" });

    // repository層の呼び出し確認
    expect(resourceRepo.addResource).toHaveBeenCalledTimes(1);
    expect(resourceRepo.addResource).toHaveBeenCalledWith(
      expect.objectContaining({
        file: expect.objectContaining({ name: "NewFile" }),
        currentFolderId: "base",
      })
    );

    // ステート更新確認
    expect(mockResourceState.files.length).toBe(1);
    expect(mockResourceState.files[0].name).toBe("NewFile");

    // 新しいResourceが選択状態になっていることを確認
    expect(mockResourceState.selectedResource).toMatchObject({
      title: "",
      genre: expect.any(ResourceGenre),
    });

    // notifyが呼ばれている
    expect(mockNotify).toHaveBeenCalled();
  });
});
