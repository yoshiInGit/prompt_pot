import { describe, it, expect, vi, beforeEach } from "vitest";

import * as contentRepo from "@/app/infra/repository/content";
import { Content } from "@/app/infra/models/contents";
import { createContent, deleteContent, renameContent, restoreContents } from "./content";

// === モック ===

// contentRepo 全体をモック
vi.mock("@/app/infra/repository/content", () => ({
  getAllContents: vi.fn(),
  addContent: vi.fn(),
  updateContent: vi.fn(),
  deleteContent: vi.fn(),
}));

// uuidモック（固定IDを返す）
vi.mock("uuid", () => ({
  v4: vi.fn(() => "mock-uuid"),
}));

// ContentStateモック
const mockNotify = vi.fn();
let mockContents: Content[] = [];
const mockContentState = {
  get contents() {
    return mockContents;
  },
  set contents(val) {
    mockContents = val;
  },
  notify: mockNotify,
};
vi.mock("../state/content_state", () => ({
  default: {
    getInstance: vi.fn(() => mockContentState),
  },
}));

// LoadingStateモック
const mockNotifyContentSub = vi.fn();
let isLoading = false;
const mockLoadingState = {
  get isContentLoading() {
    return isLoading;
  },
  set isContentLoading(val) {
    isLoading = val;
  },
  notifyContentSub: mockNotifyContentSub,
};
vi.mock("../state/loading_state", () => ({
  default: {
    getInstance: vi.fn(() => mockLoadingState),
  },
}));

// === テスト前準備 ===
beforeEach(() => {
  vi.clearAllMocks();
  mockContents = [];
  isLoading = false;
});

// === テスト開始 ===
describe("Content Actions", () => {
  // 1️⃣ restoreContents
  it("restoreContents: should restore contents and notify states", async () => {
    const fakeContents = [
      new Content({ id: "1", name: "Test1" }),
      new Content({ id: "2", name: "Test2" }),
    ];
    (contentRepo.getAllContents as any).mockResolvedValue(fakeContents);

    await restoreContents();

    expect(mockNotifyContentSub).toHaveBeenCalledTimes(2); // 開始と終了
    expect(mockContents).toEqual(fakeContents);
    expect(mockNotify).toHaveBeenCalledTimes(1);
    expect(contentRepo.getAllContents).toHaveBeenCalledTimes(1);
  });

  // 2️⃣ createContent
  it("createContent: should create and add new content", async () => {
    (contentRepo.addContent as any).mockResolvedValue(undefined);

    await createContent({ name: "New Task" });

    // ステート追加確認
    expect(mockContents.length).toBe(1);
    expect(mockContents[0]).toBeInstanceOf(Content);
    expect(mockContents[0].id).toBe("mock-uuid");
    expect(mockContents[0].name).toBe("New Task");

    // DB追加呼び出し
    expect(contentRepo.addContent).toHaveBeenCalledWith({
      content: expect.any(Content),
    });

    // 通知確認
    expect(mockNotify).toHaveBeenCalledTimes(1);
    expect(mockNotifyContentSub).toHaveBeenCalledTimes(2);
  });

  // 3️⃣ renameContent
  it("renameContent: should update content name and notify", async () => {
    const oldContent = new Content({ id: "1", name: "Old Name" });
    mockContents = [oldContent];

    (contentRepo.updateContent as any).mockResolvedValue(undefined);

    await renameContent({ contentId: "1", name: "New Name" });

    expect(contentRepo.updateContent).toHaveBeenCalledWith({
      content: expect.any(Content),
    });
    expect(mockContents[0].name).toBe("New Name");
    expect(mockNotifyContentSub).toHaveBeenCalledTimes(2);
  });


  // 4️⃣ deleteContent
  it("deleteContent: should delete content and notify", async () => {
    mockContents = [
      new Content({ id: "1", name: "Task 1" }),
      new Content({ id: "2", name: "Task 2" }),
    ];
    (contentRepo.deleteContent as any).mockResolvedValue(undefined);

    await deleteContent({ contentId: "1" });

    expect(contentRepo.deleteContent).toHaveBeenCalledWith({
      contentId: "1",
    });
    expect(mockContents.length).toBe(1);
    expect(mockContents[0].id).toBe("2");
    expect(mockNotifyContentSub).toHaveBeenCalledTimes(2);
  });
});
