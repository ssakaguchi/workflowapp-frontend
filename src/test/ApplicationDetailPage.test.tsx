import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  getApplicationById,
  updateApplicationStatus,
} from "../api/applicationsApi";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ApplicationDetailPage from "../pages/ApplicationDetailPage";
import type { ApplicationDetail } from "../types/application";
import userEvent from "@testing-library/user-event";

vi.mock("../api/applicationsApi", () => ({
  getApplicationById: vi.fn(),
  updateApplicationStatus: vi.fn(),
}));

const mockedGetApplicationById = vi.mocked(getApplicationById);

const mockedUpdateApplicationStatus = vi.mocked(updateApplicationStatus);

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
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
    };

    mockedGetApplicationById.mockResolvedValue(application);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("タイトル: 出張申請")).toBeInTheDocument();
      expect(screen.getByText("内容: 大阪出張")).toBeInTheDocument();
      expect(screen.getByText("ステータス: 申請中")).toBeInTheDocument();
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
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
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

    await screen.findByText("タイトル: 出張申請");
    await user.click(screen.getByText("一覧へ戻る"));

    expect(screen.getByText("一覧画面")).toBeInTheDocument();
  });

  test("編集ボタンで編集画面へ遷移すること", async () => {
    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
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

    await screen.findByText("タイトル: 出張申請");
    await user.click(screen.getByText("編集"));

    expect(screen.getByText("編集画面")).toBeInTheDocument();
  });

  test("申請中のみ承認・却下ボタンが表示されること", async () => {
    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("承認")).toBeInTheDocument();
      expect(screen.getByText("却下")).toBeInTheDocument();
    });
  });

  test("申請中以外は承認・却下ボタンが表示されないこと", async () => {
    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Approved", // 承認済み
      createdAt: "2026-01-01T00:00:00Z",
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText("承認")).not.toBeInTheDocument();
      expect(screen.queryByText("却下")).not.toBeInTheDocument();
    });
  });

  test("承認ボタンを押すとステータス更新の確認ダイアログが表示されること", async () => {
    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
    });

    const user = userEvent.setup();

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("承認")).toBeInTheDocument();
    });

    await user.click(screen.getByText("承認"));

    expect(screen.getByText("申請を承認しますか？")).toBeInTheDocument();
  });

  test("却下ボタンを押すとステータス更新の確認ダイアログが表示されること", async () => {
    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
    });

    const user = userEvent.setup();

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("却下")).toBeInTheDocument();
    });

    await user.click(screen.getByText("却下"));

    expect(screen.getByText("申請を却下しますか？")).toBeInTheDocument();
  });

  test("ステータス更新の確認ダイアログで承認を選択するとステータスが更新されること", async () => {
    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
    });

    mockedUpdateApplicationStatus.mockResolvedValue(undefined);

    const user = userEvent.setup();

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("承認")).toBeInTheDocument();
    });

    await user.click(screen.getByText("承認"));

    expect(
      screen.getByText("この申請を承認済みに変更します。よろしいですか？"),
    ).toBeInTheDocument();

    await user.click(screen.getByText("実行する"));

    // updateApplicationStatusが正しい引数で呼ばれることを確認
    await waitFor(() => {
      expect(mockedUpdateApplicationStatus).toHaveBeenCalledWith(1, "Approved");
    });

    // ステータス更新後のメッセージとステータス表示の確認
    await waitFor(() => {
      expect(
        screen.getByText("ステータスを更新しました。"),
      ).toBeInTheDocument();
      expect(screen.getByText("ステータス: 承認済み")).toBeInTheDocument();
    });
  });

  test("ステータス更新失敗時にエラーメッセージが表示されること", async () => {
    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
    });

    mockedUpdateApplicationStatus.mockRejectedValue(new Error("API error"));

    const user = userEvent.setup();

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("承認")).toBeInTheDocument();
    });

    await user.click(screen.getByText("承認"));

    expect(
      screen.getByText("この申請を承認済みに変更します。よろしいですか？"),
    ).toBeInTheDocument();

    await user.click(screen.getByText("実行する"));

    await waitFor(() => {
      expect(
        screen.getByText("ステータスの更新に失敗しました。"),
      ).toBeInTheDocument();
    });
  });
});
