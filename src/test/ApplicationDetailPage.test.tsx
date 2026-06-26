import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

import {
  getApplicationById,
  updateApplicationStatus,
} from "../api/applicationsApi";
import ApplicationDetailPage from "../pages/ApplicationDetailPage";
import { getCurrentUser } from "../services/authService";
import type { ApplicationDetail } from "../types/application";
import type { CurrentUser } from "../types/auth";
import { roleStorage } from "../utils/roleStorage";
import { tokenStorage } from "../utils/tokenStorage";

vi.mock("../api/applicationsApi", () => ({
  getApplicationById: vi.fn(),
  updateApplicationStatus: vi.fn(),
}));

const mockedGetApplicationById = vi.mocked(getApplicationById);

const mockedUpdateApplicationStatus = vi.mocked(updateApplicationStatus);

vi.mock("../services/authService", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("../utils/roleStorage", () => ({
  roleStorage: {
    get: vi.fn(() => "Approver"),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock("../utils/tokenStorage", () => ({
  tokenStorage: {
    get: vi.fn(() => "mockedToken"),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

describe("ApplicationDetailPage", () => {
  const defaultCurrentUser: CurrentUser = {
    userId: 2,
    loginId: "approver01",
    displayName: "テスト承認者",
    role: "Approver",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // getCurrentUserのモックをデフォルトのユーザー情報で解決するように設定
    vi.mocked(getCurrentUser).mockResolvedValue(defaultCurrentUser);
    vi.mocked(roleStorage.get).mockReturnValue("Approver");
    vi.mocked(roleStorage.set).mockImplementation(() => {});
    vi.mocked(roleStorage.remove).mockImplementation(() => {});
    vi.mocked(tokenStorage.remove).mockImplementation(() => {});
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
    roleStorage.get = vi.fn().mockReturnValue("Applicant");
    const application: ApplicationDetail = {
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
      approvalSteps: [],
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
      approvalSteps: [],
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
    // Arrange
    vi.mocked(getCurrentUser).mockResolvedValue({
      userId: 1,
      loginId: "applicant01",
      displayName: "申請者ユーザー",
      role: "Applicant",
    });

    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
      approvalSteps: [],
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

  test("申請中以外は承認・却下ボタンが表示されないこと", async () => {
    roleStorage.get = vi.fn().mockReturnValue("Approver");
    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Approved", // 承認済み
      createdAt: "2026-01-01T00:00:00Z",
      approvalSteps: [],
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText("承認")).not.toBeInTheDocument();
      expect(screen.queryByText("却下")).not.toBeInTheDocument();
    });
  });

  test("承認ボタンを押すとステータス更新の確認ダイアログが表示されること", async () => {
    roleStorage.get = vi.fn().mockReturnValue("Approver");
    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
      approvalSteps: [
        {
          id: 1,
          stepOrder: 1,
          approverUserId: 2,
          status: "Pending",
        },
      ],
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
    roleStorage.get = vi.fn().mockReturnValue("Approver");
    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
      approvalSteps: [
        {
          id: 1,
          stepOrder: 1,
          approverUserId: 2,
          status: "Pending",
        },
      ],
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
    roleStorage.get = vi.fn().mockReturnValue("Approver");
    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
      approvalSteps: [
        {
          id: 1,
          stepOrder: 1,
          approverUserId: 2,
          status: "Pending",
        },
      ],
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
    roleStorage.get = vi.fn().mockReturnValue("Approver");
    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
      approvalSteps: [
        {
          id: 1,
          stepOrder: 1,
          approverUserId: 2,
          status: "Pending",
        },
      ],
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

  test("申請中かつApproverの場合はステータス更新ボタンが表示されること", async () => {
    // arrange
    // roleStorage.getをモックしてApproverを返すようにする
    roleStorage.get = vi.fn().mockReturnValue("Approver");
    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
      approvalSteps: [
        {
          id: 1,
          stepOrder: 1,
          approverUserId: 2,
          status: "Pending",
        },
      ],
    });

    // act
    renderComponent();

    // assert
    // ステータス更新ボタンが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText("承認")).toBeInTheDocument();
      expect(screen.getByText("却下")).toBeInTheDocument();
    });
  });

  test("申請中でもApplicantの場合はステータス更新ボタンが表示されないこと", async () => {
    // arrange
    roleStorage.get = vi.fn().mockReturnValue("Applicant");
    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
      approvalSteps: [
        {
          id: 1,
          stepOrder: 1,
          approverUserId: 2,
          status: "Pending",
        },
      ],
    });

    // act
    renderComponent();

    // assert
    await waitFor(() => {
      expect(screen.queryByText("承認")).not.toBeInTheDocument();
      expect(screen.queryByText("却下")).not.toBeInTheDocument();
    });
  });

  test("getCurrentUserから取得したユーザーが担当承認者ならステータス更新ボタンを表示すること", async () => {
    // arrange
    // getCurrentUserのモック実装を追加してApproverロールを返すようにする
    vi.mocked(getCurrentUser).mockResolvedValue({
      userId: 2,
      loginId: "approver01",
      displayName: "テスト承認者",
      role: "Approver",
    });

    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
      approvalSteps: [
        {
          id: 1,
          stepOrder: 1,
          approverUserId: 2,
          status: "Pending",
        },
      ],
    });

    // act
    renderComponent();

    // assert
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "承認" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "却下" })).toBeInTheDocument();
    });

    expect(vi.mocked(getCurrentUser)).toHaveBeenCalled();
    expect(roleStorage.set).toHaveBeenCalledWith("Approver");
  });

  test("role復元に失敗した場合_認証情報を削除してログイン画面へ遷移すること", async () => {
    // arrange
    vi.mocked(roleStorage.get).mockReturnValue(null); // roleが未保存の状態を再現
    vi.mocked(tokenStorage.remove).mockImplementation(() => {}); // tokenStorage.removeのモック実装
    vi.mocked(roleStorage.remove).mockImplementation(() => {}); // roleStorage.removeのモック実装
    vi.mocked(getCurrentUser).mockRejectedValue(new Error("API error")); // getCurrentUserが失敗するようにする

    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
      approvalSteps: [],
    });

    // act
    // ログイン画面への遷移を確認するために、MemoryRouterとRoutesでApplicationDetailPageをラップしてレンダリングする
    render(
      <MemoryRouter initialEntries={["/applications/1"]}>
        <Routes>
          <Route path="/applications/:id" element={<ApplicationDetailPage />} />
          <Route path="/login" element={<div>ログイン画面</div>} />
        </Routes>
      </MemoryRouter>,
    );

    // assert
    await waitFor(() => {
      expect(vi.mocked(getCurrentUser)).toHaveBeenCalled();
      expect(vi.mocked(tokenStorage.remove)).toHaveBeenCalled();
      expect(vi.mocked(roleStorage.remove)).toHaveBeenCalled();
      expect(screen.getByText("ログイン画面")).toBeInTheDocument();
    });
  });

  test("申請詳細取得後、承認ルートが表示されること", async () => {
    // arrange
    roleStorage.get = vi.fn().mockReturnValue("Approver");
    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
      // approvalStepsに1件の承認ステップを含める
      approvalSteps: [
        {
          id: 1,
          stepOrder: 1,
          approverUserId: 2,
          status: "Pending",
        },
      ],
    });

    // act
    renderComponent();

    // assert
    await waitFor(() => {
      expect(screen.getByText("承認ルート")).toBeInTheDocument();
      expect(screen.getByText("順番")).toBeInTheDocument();
      expect(screen.getByText("承認者")).toBeInTheDocument();
      expect(screen.getByText("ステータス")).toBeInTheDocument();
      expect(screen.getByText("申請中")).toBeInTheDocument();
      expect(screen.getByRole("cell", { name: "1" })).toBeInTheDocument();
      expect(screen.getByRole("cell", { name: "2" })).toBeInTheDocument();
    });
  });

  test("ApprovalStepsが空の場合、承認ルート未設定メッセージが表示されること", async () => {
    // arrange
    roleStorage.get = vi.fn().mockReturnValue("Approver");
    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
      approvalSteps: [], // approvalStepsが空のケース
    });

    // act
    renderComponent();

    // assert
    await waitFor(() => {
      expect(screen.getByText("承認ルート")).toBeInTheDocument();
      expect(screen.getByText("承認ルートは未設定です。")).toBeInTheDocument();
    });
  });

  test("Approverでも現在の承認待ちステップの担当者でない場合はステータス更新ボタンを表示しないこと", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      userId: 3,
      loginId: "approver02",
      displayName: "別の承認者",
      role: "Approver",
    });

    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
      approvalSteps: [
        {
          id: 1,
          stepOrder: 1,
          approverUserId: 2,
          status: "Pending",
        },
      ],
    });

    renderComponent();

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "承認" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "却下" }),
      ).not.toBeInTheDocument();
    });
  });

  test("Adminでは承認・却下ボタンが表示されないこと", async () => {
    // arrange - Adminユーザーとしてモックする
    vi.mocked(getCurrentUser).mockResolvedValue({
      userId: 1,
      loginId: "admin01",
      displayName: "管理者",
      role: "Admin",
    });

    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
      approvalSteps: [
        {
          id: 1,
          stepOrder: 1,
          approverUserId: 2,
          status: "Pending",
        },
      ],
    });

    // act
    renderComponent();

    // assert - Adminユーザーでは承認・却下ボタンが表示されないことを確認
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "承認" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "却下" }),
      ).not.toBeInTheDocument();
    });
  });

  test("Adminでは詳細画面の編集ボタンが表示されないこと", async () => {
    // arrange - Adminユーザーとしてモックする
    vi.mocked(getCurrentUser).mockResolvedValue({
      userId: 1,
      loginId: "admin01",
      displayName: "管理者",
      role: "Admin",
    });

    mockedGetApplicationById.mockResolvedValue({
      id: 1,
      title: "出張申請",
      content: "大阪出張",
      applicantUserId: 1,
      status: "Pending",
      createdAt: "2026-01-01T00:00:00Z",
      approvalSteps: [],
    });

    // act
    renderComponent();

    // assert - Adminユーザーでは編集ボタンが表示されないことを確認
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "編集" }),
      ).not.toBeInTheDocument();
    });
  });
});
