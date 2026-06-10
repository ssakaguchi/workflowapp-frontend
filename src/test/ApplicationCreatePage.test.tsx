import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { createApplication } from "../api/applicationsApi";
import ApplicationCreatePage from "../pages/ApplicationCreatePage";

// applicationsApiをモックする
vi.mock("../api/applicationsApi", () => ({
  createApplication: vi.fn(),
}));

const mockedCreateApplication = vi.mocked(createApplication);

// 申請作成ページに関するテスト
describe("ApplicationCreatePage", () => {
  // 各テスト前にモックの状態をリセットして、テスト間の干渉を防止する
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 各テスト後にモックを完全にリセットして、次のテストに影響を与えないようにする
  afterEach(() => {
    vi.resetAllMocks();
  });

  // テストで使用する共通のレンダリング関数
  function renderComponent(initialPath = "/applications/new") {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/applications/new" element={<ApplicationCreatePage />} />
          <Route path="/applications" element={<div>申請一覧</div>} />
        </Routes>
      </MemoryRouter>,
    );
  }

  test("タイトル・内容入力欄が表示されていること", () => {
    const { getByLabelText } = renderComponent();
    expect(getByLabelText("タイトル")).toBeInTheDocument();
    expect(getByLabelText("内容")).toBeInTheDocument();
  });

  test("タイトルが未入力の場合、エラーメッセージを表示して作成APIを呼び出さないこと", async () => {
    // arrange
    const user = userEvent.setup();

    renderComponent();

    const titleInput = await screen.findByLabelText("タイトル");
    const submitButton = screen.getByRole("button", { name: "申請" });
    await user.clear(titleInput);

    // act
    await user.click(submitButton);

    // assert
    expect(
      await screen.findByText("タイトルを入力してください。"),
    ).toBeInTheDocument();
    expect(mockedCreateApplication).not.toHaveBeenCalled();
  });

  test("内容が未入力の場合、エラーメッセージを表示して作成APIを呼び出さないこと", async () => {
    // arrange
    const user = userEvent.setup();

    renderComponent();

    const titleInput = await screen.findByLabelText("タイトル");
    const contentInput = await screen.findByLabelText("内容");
    const submitButton = screen.getByRole("button", { name: "申請" });

    await user.type(titleInput, "新規申請タイトル");
    await user.clear(contentInput);

    // act
    await user.click(submitButton);

    // assert
    expect(
      await screen.findByText("内容を入力してください。"),
    ).toBeInTheDocument();
    expect(mockedCreateApplication).not.toHaveBeenCalled();
  });

  test("申請の作成に成功すること", async () => {
    // arrange
    const user = userEvent.setup();

    // createApplicationのモックが成功するように設定する
    mockedCreateApplication.mockResolvedValue(undefined);

    // 申請作成ページを表示する
    renderComponent("/applications/new");

    const titleInput = await screen.findByLabelText("タイトル");
    const contentInput = await screen.findByLabelText("内容");

    await user.clear(titleInput);
    await user.type(titleInput, "新規申請タイトル");

    await user.clear(contentInput);
    await user.type(contentInput, "新規申請内容");

    const submitButton = await screen.findByRole("button", { name: "申請" });

    // act
    await user.click(submitButton);

    // assert
    expect(mockedCreateApplication).toHaveBeenCalledWith({
      title: "新規申請タイトル",
      content: "新規申請内容",
    });

    expect(await screen.findByText("申請一覧")).toBeInTheDocument();
  });

  test("申請の作成に失敗した場合、エラーメッセージを表示して作成画面に留まること", async () => {
    const user = userEvent.setup();

    mockedCreateApplication.mockRejectedValue(new Error("作成に失敗しました"));

    // 申請作成ページを表示する
    renderComponent();

    const titleInput = await screen.findByLabelText("タイトル");
    const contentInput = await screen.findByLabelText("内容");

    await user.clear(titleInput);
    await user.type(titleInput, "新規申請タイトル");

    await user.clear(contentInput);
    await user.type(contentInput, "新規申請内容");

    const submitButton = await screen.findByRole("button", { name: "申請" });

    // act
    await user.click(submitButton);

    // assert
    // createApplicationが正しい引数で呼び出されていることを確認
    expect(mockedCreateApplication).toHaveBeenCalledWith({
      title: "新規申請タイトル",
      content: "新規申請内容",
    });

    // エラーメッセージが表示されることを確認
    expect(
      await screen.findByText("申請の作成に失敗しました。"),
    ).toBeInTheDocument();

    // 申請作成画面に留まることを確認
    expect(await screen.findByText("申請作成画面")).toBeInTheDocument();
    expect(screen.queryByText("申請一覧")).not.toBeInTheDocument();
  });

  test("一覧へ戻るボタンで一覧へ遷移すること", async () => {
    const user = userEvent.setup();

    renderComponent();

    await screen.findByText("申請作成画面");
    await user.click(screen.getByRole("button", { name: "一覧へ戻る" }));

    expect(screen.getByText("申請一覧")).toBeInTheDocument();
  });

  test("申請中は一覧へ戻るボタンが無効になること", async () => {
    // arrange
    const user = userEvent.setup();

    // createApplicationのモックが完了しないPromiseを返すように設定する
    mockedCreateApplication.mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <ApplicationCreatePage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText("タイトル"), "新規申請タイトル");
    await user.type(screen.getByLabelText("内容"), "新規申請内容");

    // act
    await user.click(screen.getByRole("button", { name: "申請" }));

    // assert
    expect(screen.getByRole("button", { name: "一覧へ戻る" })).toBeDisabled();
  });
});
