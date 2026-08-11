import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { authApi } from "../api/authApi";
import { LoginPage } from "../pages/LoginPage";
import { roleStorage } from "../utils/roleStorage";
import { tokenStorage } from "../utils/tokenStorage";
import { renderWithQueryClient } from "./renderWithQueryClient";

vi.mock("../api/authApi", () => ({
  authApi: {
    login: vi.fn(),
  },
}));

vi.mock("../utils/tokenStorage", () => ({
  tokenStorage: {
    set: vi.fn(),
  },
}));

vi.mock("../utils/roleStorage", () => ({
  roleStorage: {
    set: vi.fn(),
  },
}));

const mockedLogin = vi.mocked(authApi.login);

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderComponent() {
    return renderWithQueryClient(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/applications" element={<div>申請一覧</div>} />
        </Routes>
      </MemoryRouter>,
    );
  }

  test("ログインに成功した場合、認証情報を保存して申請一覧へ遷移すること", async () => {
    // arrange
    const user = userEvent.setup();

    mockedLogin.mockResolvedValue({
      token: "test-token",
      role: "Applicant",
    });

    renderComponent();

    // act
    await user.type(screen.getByLabelText("ログインID"), "applicant01");
    await user.type(screen.getByLabelText("パスワード"), "password");
    await user.click(screen.getByRole("button", { name: "ログイン" }));

    // assert - ログイン処理が呼ばれること、認証情報が保存されること、申請一覧へ遷移すること
    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith({
        loginId: "applicant01",
        password: "password",
      });
    });

    expect(tokenStorage.set).toHaveBeenCalledWith("test-token");
    expect(roleStorage.set).toHaveBeenCalledWith("Applicant");

    expect(await screen.findByText("申請一覧")).toBeInTheDocument();
  });

  test("ログインに失敗した場合、エラーメッセージを表示すること", async () => {
    // arrange
    const user = userEvent.setup();

    mockedLogin.mockRejectedValue(new Error("ログイン失敗"));

    renderComponent();

    // act
    await user.type(screen.getByLabelText("ログインID"), "applicant01");
    await user.type(screen.getByLabelText("パスワード"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "ログイン" }));

    // assert
    expect(
      await screen.findByText("ログインに失敗しました。"),
    ).toBeInTheDocument();

    expect(mockedLogin).toHaveBeenCalledWith({
      loginId: "applicant01",
      password: "wrong-password",
    });

    expect(tokenStorage.set).not.toHaveBeenCalled();
    expect(roleStorage.set).not.toHaveBeenCalled();
    expect(screen.queryByText("申請一覧")).not.toBeInTheDocument();
  });

  test("ログイン処理中は入力欄、ログインボタン、ユーザー登録リンクが無効になること", async () => {
    // arrange
    const user = userEvent.setup();

    mockedLogin.mockImplementation(
      () =>
        new Promise(() => {
          // ログイン処理中の状態を維持する
        }),
    );

    renderComponent();

    const loginIdInput = screen.getByLabelText("ログインID");
    const passwordInput = screen.getByLabelText("パスワード");
    const loginButton = screen.getByRole("button", { name: "ログイン" });
    const registerLink = screen.getByRole("link", {
      name: "ユーザー登録はこちら",
    });

    await user.type(loginIdInput, "applicant01");
    await user.type(passwordInput, "password");

    // act
    await user.click(loginButton);

    // assert
    await waitFor(() => {
      expect(loginIdInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(screen.getByRole("button", { name: "ログイン" })).toBeDisabled();
      expect(registerLink).toHaveAttribute("aria-disabled", "true");
      expect(registerLink).toHaveAttribute("tabindex", "-1");
    });

    expect(mockedLogin).toHaveBeenCalledTimes(1);
  });
});
