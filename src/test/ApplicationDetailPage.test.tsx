import { beforeEach, describe, expect, test, vi } from "vitest";
import { getApplicationById } from "../api/applicationsApi";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ApplicationDetailPage from "../pages/ApplicationDetailPage";
import type { ApplicationDetail } from "../types/application";
import userEvent from "@testing-library/user-event";

vi.mock("../api/applicationsApi", () => ({
  getApplicationById: vi.fn(),
}));

const mockedGetApplicationById = vi.mocked(getApplicationById);

describe("ApplicationDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderComponent(initialPath = "/applications/1") {
    render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/applications/:id" element={<ApplicationDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
  }

  test("初期表示時に読み込み中を表示すること", () => {
    mockedGetApplicationById.mockReturnValue(new Promise(() => {})); // 解決されないPromiseを返す

    renderComponent();

    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });

  test("申請詳細が正しく表示されること", async () => {
    const application: ApplicationDetail = {
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-02T00:00:00Z",
    };

    mockedGetApplicationById.mockResolvedValue(application);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("出張申請")).toBeInTheDocument();
      expect(screen.getByText("大阪出張")).toBeInTheDocument();
    });
  });

  test("API取得失敗時にエラーメッセージを表示すること", async () => {
    mockedGetApplicationById.mockRejectedValue(new Error("API error"));

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("申請の詳細を取得できませんでした。"),
      ).toBeInTheDocument();
    });
  });

  test("不正な申請IDの場合はエラーメッセージを表示すること", async () => {
    renderComponent("/applications/abc");

    await waitFor(() => {
      expect(screen.getByText("申請IDが不正です。")).toBeInTheDocument();
    });
  });

  test("一覧へ戻るボタンで一覧へ遷移すること", async () => {
    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-02T00:00:00Z",
    });

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/applications/1"]}>
        <Routes>
          <Route path="/applications/:id" element={<ApplicationDetailPage />} />
          <Route path="/applications" element={<div>一覧画面</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await screen.findByText("出張申請");
    await user.click(screen.getByText("一覧へ戻る"));

    expect(screen.getByText("一覧画面")).toBeInTheDocument();
  });

  test("編集ボタンで編集画面へ遷移すること", async () => {
    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-02T00:00:00Z",
    });

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/applications/1"]}>
        <Routes>
          <Route path="/applications/:id" element={<ApplicationDetailPage />} />
          <Route path="/applications/:id/edit" element={<div>編集画面</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await screen.findByText("出張申請");
    await user.click(screen.getByText("編集"));

    expect(screen.getByText("編集画面")).toBeInTheDocument();
  });
});
