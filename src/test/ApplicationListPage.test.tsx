import { render, screen, waitFor } from "@testing-library/react";
import { getApplications } from "../api/applicationsApi";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { ApplicationListPage } from "../pages/ApplicationListPage";
import type { ApplicationListItem } from "../types/application";
import { MemoryRouter } from "react-router-dom";

// applicationsApiをモックする
vi.mock("../api/applicationsApi", () => ({
  getApplications: vi.fn(),
}));

const mockedGetApplications = vi.mocked(getApplications);

describe("ApplicationListPage", () => {
  beforeEach(() => {
    // モックの状態をリセット
    vi.clearAllMocks();
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
        content: "大阪出張",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
      {
        id: 2,
        title: "備品購入申請",
        content: "キーボード購入",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
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

    await waitFor(() => {
      screen.findByText("申請データがありません。");
    });
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
});
