import { render, screen, waitFor } from "@testing-library/react";
import { deleteApplication, getApplications } from "../api/applicationsApi";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { ApplicationListPage } from "../pages/ApplicationListPage";
import type { ApplicationListItem } from "../types/application";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

// applicationsApiをモックする
vi.mock("../api/applicationsApi", () => ({
  getApplications: vi.fn(),
  deleteApplication: vi.fn(),
}));

const mockedGetApplications = vi.mocked(getApplications);
const mockedDeleteApplication = vi.mocked(deleteApplication);

describe("ApplicationListPage", () => {
  // 各テスト前にモックの状態をリセットして、テスト間の干渉を防止する
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 各テスト後にモックを完全にリセットして、次のテストに影響を与えないようにする
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("初期表示時に読み込み中を表示すること", () => {
    mockedGetApplications.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <ApplicationListPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });

  test("アプリケーションのリストが正しく表示されること", async () => {
    const applications: ApplicationListItem[] = [
      {
        id: 1,
        title: "出張申請",
        status: "申請中",
        createdAt: "2026-01-01T00:00:00Z",
      },
      {
        id: 2,
        title: "備品購入申請",
        status: "承認済み",
        createdAt: "2026-01-01T00:00:00Z",
      },
    ];

    mockedGetApplications.mockResolvedValue(applications);

    render(
      <MemoryRouter>
        <ApplicationListPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("読み込み中...")).toBeInTheDocument();

    // データが表示されるのを待つ
    await waitFor(() => {
      expect(screen.getByText("出張申請")).toBeInTheDocument();
      expect(screen.getByText("備品購入申請")).toBeInTheDocument();
      expect(screen.getByText("申請中")).toBeInTheDocument();
      expect(screen.getByText("承認済み")).toBeInTheDocument();
    });

    expect(screen.queryByText("読み込み中...")).not.toBeInTheDocument();
  });

  test("APIが空配列を返した場合は申請データがありませんを表示すること", async () => {
    mockedGetApplications.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <ApplicationListPage />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText("申請データがありません。"),
    ).toBeInTheDocument();
  });

  test("API取得失敗時にエラーメッセージを表示すること", async () => {
    mockedGetApplications.mockRejectedValue(new Error("API error"));

    render(
      <MemoryRouter>
        <ApplicationListPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("申請一覧の取得に失敗しました。"),
      ).toBeInTheDocument();
    });
  });

  test("削除確認でOKを選択すると、申請を削除して一覧を消すこと", async () => {
    const user = userEvent.setup();

    // 2件の申請を返すようにモックする
    mockedGetApplications.mockResolvedValue([
      {
        id: 1,
        title: "削除対象の申請",
        status: "申請中",
        createdAt: "2026-01-01T00:00:00Z",
      },
      {
        id: 2,
        title: "削除対象外の申請",
        status: "申請中",
        createdAt: "2026-01-01T00:00:00Z",
      },
    ]);

    // deleteApplicationが成功するようにモックする
    mockedDeleteApplication.mockResolvedValueOnce();

    // window.confirmをモックして常にtrueを返すようにする
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(
      <MemoryRouter>
        <ApplicationListPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("削除対象の申請")).toBeInTheDocument();
    expect(screen.getByText("削除対象外の申請")).toBeInTheDocument();

    // 最初の削除ボタンをクリックする
    const deleteButtons = screen.getAllByRole("button", { name: "削除" });
    await user.click(deleteButtons[0]);

    // deleteApplicationが正しいID(1)で呼び出されたことを確認する
    expect(mockedDeleteApplication).toHaveBeenCalledWith(1);

    // 削除後、削除対象の申請が表示されなくなり、削除対象外の申請は表示されたままであることを確認する
    await waitFor(() => {
      expect(screen.queryByText("削除対象の申請")).not.toBeInTheDocument();
    });

    expect(screen.getByText("削除対象外の申請")).toBeInTheDocument();
  });

  test("削除確認でキャンセルを選択すると、申請が削除されないこと", async () => {
    const user = userEvent.setup();

    mockedGetApplications.mockResolvedValue([
      {
        id: 1,
        title: "削除対象の申請",
        status: "申請中",
        createdAt: "2026-01-01T00:00:00Z",
      },
    ]);

    // window.confirmをモックして常にfalseを返すようにする
    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(
      <MemoryRouter>
        <ApplicationListPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("削除対象の申請")).toBeInTheDocument();

    // 最初の削除ボタンをクリックする
    const deleteButtons = screen.getAllByRole("button", { name: "削除" });
    await user.click(deleteButtons[0]);

    // deleteApplicationが呼び出されないことを確認する
    expect(mockedDeleteApplication).not.toHaveBeenCalled();

    // 削除対象の申請が表示されたままであることを確認する
    expect(screen.getByText("削除対象の申請")).toBeInTheDocument();
  });

  test("削除APIが失敗した場合にエラーメッセージを表示すること", async () => {
    const user = userEvent.setup();

    mockedGetApplications.mockResolvedValue([
      {
        id: 1,
        title: "削除対象の申請",
        status: "申請中",
        createdAt: "2026-01-01T00:00:00Z",
      },
    ]);

    mockedDeleteApplication.mockRejectedValue(new Error("API error"));

    // window.confirmをモックして常にtrueを返すようにする
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(
      <MemoryRouter>
        <ApplicationListPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("削除対象の申請")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "削除" }));

    // deleteApplicationが正しいID(1)で呼び出されたことを確認する
    expect(mockedDeleteApplication).toHaveBeenCalledWith(1);

    // エラーメッセージが表示されるのを待つ
    expect(
      await screen.findByText("申請の削除に失敗しました。"),
    ).toBeInTheDocument();

    // 削除対象の申請が表示されたままであることを確認する
    expect(screen.getByText("削除対象の申請")).toBeInTheDocument();
  });

  test("申請作成画面へのリンクが表示され、正しい遷移先が設定されていること", () => {
    // arrange/act
    render(
      <MemoryRouter>
        <ApplicationListPage />
      </MemoryRouter>,
    );

    const createLink = screen.getByRole("link", { name: "新規作成" });

    // assert
    // リンクが表示されていることを確認する
    expect(createLink).toBeInTheDocument();

    // リンクの遷移先が正しいことを確認する
    expect(createLink).toHaveAttribute("href", "/applications/new");
  });
});
