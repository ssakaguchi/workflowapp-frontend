import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { authApi } from "../api/authApi";
import RegisterPage from "../pages/RegisterPage";
import { renderWithQueryClient } from "./renderWithQueryClient";

vi.mock("../api/authApi", () => ({
  authApi: {
    register: vi.fn(),
  },
}));

const mockedRegister = vi.mocked(authApi.register);

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderComponent() {
    return renderWithQueryClient(
      <MemoryRouter initialEntries={["/register"]}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<div>ログイン画面</div>} />
        </Routes>
      </MemoryRouter>,
    );
  }

  test("ユーザー登録に成功した場合、登録内容をAPIへ渡してログイン画面へ遷移すること", async () => {
    // arrange
    const user = userEvent.setup();

    mockedRegister.mockResolvedValue(undefined);

    renderComponent();

    // act
    await user.type(screen.getByLabelText(/ログインID/), "applicant01");
    await user.type(screen.getByLabelText(/表示名/), "テスト申請者");
    await user.type(screen.getByLabelText(/パスワード/), "password01");

    await user.click(screen.getByRole("button", { name: "登録" }));

    // assert
    await waitFor(() => {
      expect(mockedRegister).toHaveBeenCalledWith({
        loginId: "applicant01",
        displayName: "テスト申請者",
        password: "password01",
      });
    });

    expect(await screen.findByText("ログイン画面")).toBeInTheDocument();
  });

  test("ユーザー登録に失敗した場合、エラーメッセージを表示してログイン画面へ遷移しないこと", async () => {
    // arrange
    const user = userEvent.setup();

    mockedRegister.mockRejectedValue(new Error("登録失敗"));

    renderComponent();

    // act
    await user.type(screen.getByLabelText(/ログインID/), "applicant01");
    await user.type(screen.getByLabelText(/表示名/), "テスト申請者");
    await user.type(screen.getByLabelText(/パスワード/), "password01");

    await user.click(screen.getByRole("button", { name: "登録" }));

    // assert
    expect(
      await screen.findByText(
        "ユーザー登録に失敗しました。入力内容を確認してください。",
      ),
    ).toBeInTheDocument();

    expect(mockedRegister).toHaveBeenCalledWith({
      loginId: "applicant01",
      displayName: "テスト申請者",
      password: "password01",
    });

    expect(screen.queryByText("ログイン画面")).not.toBeInTheDocument();
  });

  test("ユーザー登録処理中は入力欄、登録ボタン、ログインリンクが無効になること", async () => {
    // arrange
    const user = userEvent.setup();

    mockedRegister.mockImplementation(
      () =>
        new Promise(() => {
          // 登録処理中の状態を維持する
        }),
    );

    renderComponent();

    const loginIdInput = screen.getByLabelText(/ログインID/);
    const displayNameInput = screen.getByLabelText(/表示名/);
    const passwordInput = screen.getByLabelText(/パスワード/);
    const registerButton = screen.getByRole("button", { name: "登録" });
    const loginLink = screen.getByRole("link", {
      name: "ログイン画面へ",
    });

    await user.type(loginIdInput, "applicant01");
    await user.type(displayNameInput, "テスト申請者");
    await user.type(passwordInput, "password01");

    // act
    await user.click(registerButton);

    // assert
    await waitFor(() => {
      expect(loginIdInput).toBeDisabled();
      expect(displayNameInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();

      expect(screen.getByRole("button", { name: "登録中..." })).toBeDisabled();

      expect(loginLink).toHaveAttribute("aria-disabled", "true");
      expect(loginLink).toHaveAttribute("tabindex", "-1");
    });

    expect(mockedRegister).toHaveBeenCalledTimes(1);
  });

  test("パスワードに数字が含まれていない場合、登録APIを呼び出さないこと", async () => {
    // arrange
    const user = userEvent.setup();

    renderComponent();

    await user.type(screen.getByLabelText(/ログインID/), "applicant01");
    await user.type(screen.getByLabelText(/表示名/), "テスト申請者");

    // 数字を含まないパスワード
    await user.type(screen.getByLabelText(/パスワード/), "password");

    // act
    await user.click(screen.getByRole("button", { name: "登録" }));

    // assert
    expect(mockedRegister).not.toHaveBeenCalled();
    expect(screen.queryByText("ログイン画面")).not.toBeInTheDocument();
  });

  test("登録失敗後に不正な入力で再送信した場合、以前の登録エラーを消去すること", async () => {
    const user = userEvent.setup();

    mockedRegister.mockRejectedValue(new Error("登録失敗"));

    renderComponent();

    const loginIdInput = screen.getByLabelText(/ログインID/);
    const displayNameInput = screen.getByLabelText(/表示名/);
    const passwordInput = screen.getByLabelText(/パスワード/);
    const registerButton = screen.getByRole("button", { name: "登録" });

    // 1回目は正常な入力でAPIを呼び出し、登録を失敗させる
    await user.type(loginIdInput, "applicant01");
    await user.type(displayNameInput, "テストユーザー");
    await user.type(passwordInput, "password123");
    await user.click(registerButton);

    // APIエラーが表示されたことを確認
    expect(
      await screen.findByText(
        "ユーザー登録に失敗しました。入力内容を確認してください。",
      ),
    ).toBeInTheDocument();

    // 2回目はバリデーションエラーになる状態で送信
    await user.clear(loginIdInput);
    await user.click(registerButton);

    // 以前のAPIエラーが消えることを確認
    await waitFor(() => {
      expect(
        screen.queryByText(
          "ユーザー登録に失敗しました。入力内容を確認してください。",
        ),
      ).not.toBeInTheDocument();
    });

    // 今回の入力内容に対応するエラーが表示されることを確認
    expect(
      await screen.findByText("ログインIDを入力してください。"),
    ).toBeInTheDocument();

    // 2回目はバリデーションエラーなのでAPIが再度呼ばれない
    expect(mockedRegister).toHaveBeenCalledTimes(1);
  });
});
