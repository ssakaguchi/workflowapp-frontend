import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import ApplicationEditPage from "../pages/ApplicationEditPage";
import type { ApplicationDetail } from "../types/application";
import userEvent from "@testing-library/user-event";
import { getApplicationById, updateApplication } from "../api/applicationsApi";

// applicationsApiをモックする
vi.mock("../api/applicationsApi", () => ({
  getApplicationById: vi.fn(),
  updateApplication: vi.fn(),
}));

const mockedGetApplicationById = vi.mocked(getApplicationById);
const mockedUpdateApplication = vi.mocked(updateApplication);

// 申請編集ページに関するテスト
describe("ApplicationEditPage", () => {
  // 各テスト前にモックの状態をリセットして、テスト間の干渉を防止する
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 各テスト後にモックを完全にリセットして、次のテストに影響を与えないようにする
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // テストで使用する共通のレンダリング関数
  function renderComponent(initialPath = "/applications/1/edit") {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route
            path="/applications/:id/edit"
            element={<ApplicationEditPage />}
          />
          // 申請詳細画面への遷移を確認するためのダミールート
          <Route
            path="/applications/:id"
            element={<div>申請詳細画面</div>}
          />{" "}
        </Routes>
      </MemoryRouter>,
    );
  }

  test("取得した申請内容をフォームに表示すること", async () => {
    const application: ApplicationDetail = {
      id: 1,
      title: "取得したタイトル",
      content: "取得した内容",
      applicantUserId: 1,
      status: "申請中",
      createdAt: "2026-01-01T00:00:00Z",
    };

    mockedGetApplicationById.mockResolvedValue(application);

    renderComponent();

    expect(
      await screen.findByDisplayValue("取得したタイトル"),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("取得した内容")).toBeInTheDocument();
  });

  test("タイトルが未入力の場合、エラーメッセージを表示して更新APIを呼び出さないこと", async () => {
    const user = userEvent.setup();

    const application: ApplicationDetail = {
      id: 1,
      title: "更新前のタイトル",
      content: "更新前の内容",
      applicantUserId: 1,
      status: "申請中",
      createdAt: "2026-01-01T00:00:00Z",
    };

    mockedGetApplicationById.mockResolvedValue(application);

    renderComponent();

    const titleInput = await screen.findByLabelText("タイトル");
    const submitButton = screen.getByRole("button", { name: "保存" });

    await user.clear(titleInput);
    await user.click(submitButton);

    expect(
      await screen.findByText("タイトルを入力してください。"),
    ).toBeInTheDocument();
    expect(mockedUpdateApplication).not.toHaveBeenCalled();
  });

  test("内容が未入力の場合、エラーメッセージを表示して更新APIを呼び出さないこと", async () => {
    const user = userEvent.setup();

    const application: ApplicationDetail = {
      id: 1,
      title: "更新前のタイトル",
      content: "更新前の内容",
      applicantUserId: 1,
      status: "申請中",
      createdAt: "2026-01-01T00:00:00Z",
    };

    mockedGetApplicationById.mockResolvedValue(application);

    renderComponent();

    const contentInput = await screen.findByLabelText("内容");
    const submitButton = screen.getByRole("button", { name: "保存" });

    await user.clear(contentInput);
    await user.click(submitButton);

    expect(
      await screen.findByText("内容を入力してください。"),
    ).toBeInTheDocument();
    expect(mockedUpdateApplication).not.toHaveBeenCalled();
  });

  test("申請の更新に成功すること", async () => {
    // arrange
    const user = userEvent.setup();

    const application: ApplicationDetail = {
      id: 1,
      title: "更新前のタイトル",
      content: "更新前の内容",
      applicantUserId: 1,
      status: "申請中",
      createdAt: "2026-01-01T00:00:00Z",
    };

    mockedGetApplicationById.mockResolvedValue(application);
    mockedUpdateApplication.mockResolvedValue();

    // 申請編集ページを表示する
    renderComponent();

    const titileInput = await screen.findByLabelText("タイトル");
    const contentInput = await screen.findByLabelText("内容");

    await user.clear(titileInput);
    await user.type(titileInput, "更新後のタイトル");

    await user.clear(contentInput);
    await user.type(contentInput, "更新後の内容");

    const submitButton = await screen.findByRole("button", { name: "保存" });

    // act
    await user.click(submitButton);

    // assert
    expect(mockedUpdateApplication).toHaveBeenCalledWith(1, {
      title: "更新後のタイトル",
      content: "更新後の内容",
    });

    expect(await screen.findByText("申請詳細画面")).toBeInTheDocument();
  });

  test("申請の更新に失敗した場合、エラーメッセージを表示して編集画面に留まること", async () => {
    const user = userEvent.setup();

    const application: ApplicationDetail = {
      id: 1,
      title: "更新前のタイトル",
      content: "更新前の内容",
      applicantUserId: 1,
      status: "申請中",
      createdAt: "2026-01-01T00:00:00Z",
    };

    mockedGetApplicationById.mockResolvedValue(application);
    mockedUpdateApplication.mockRejectedValue(new Error("更新に失敗しました"));

    // 申請編集ページを表示する
    renderComponent();

    const submitButton = await screen.findByRole("button", { name: "保存" });

    // act
    await user.click(submitButton);

    // assert
    // updateApplicationが正しい引数で呼び出されていることを確認
    expect(mockedUpdateApplication).toHaveBeenCalledWith(1, {
      title: "更新前のタイトル",
      content: "更新前の内容",
    });

    // エラーメッセージが表示されることを確認
    expect(
      await screen.findByText("申請の更新に失敗しました。"),
    ).toBeInTheDocument();

    // 申請詳細画面に遷移しないことを確認
    expect(await screen.findByText("申請編集画面")).toBeInTheDocument();
    expect(screen.queryByText("申請詳細画面")).not.toBeInTheDocument();
  });

  test("申請の詳細を取得できなかった場合、エラーメッセージを表示すること", async () => {
    mockedGetApplicationById.mockRejectedValue(new Error("API error"));

    renderComponent();

    expect(
      await screen.findByText("申請の詳細を取得できませんでした。"),
    ).toBeInTheDocument();
  });

  test("不正な申請IDの場合はエラーメッセージを表示すること", async () => {
    renderComponent("/applications/abc/edit");

    expect(await screen.findByText("申請IDが不正です。")).toBeInTheDocument();
    expect(mockedGetApplicationById).not.toHaveBeenCalled();
    expect(mockedUpdateApplication).not.toHaveBeenCalled();
  });
});
