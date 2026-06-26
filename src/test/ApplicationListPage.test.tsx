import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  deleteApplication,
  getAdminApplications,
  getApplications,
  getMyApprovalRequests,
} from "../api/applicationsApi";
import { ApplicationListPage } from "../pages/ApplicationListPage";
import type { ApplicationListItem } from "../types/application";
import { roleStorage } from "../utils/roleStorage";

// applicationsApiをモックする
vi.mock("../api/applicationsApi", () => ({
  getApplications: vi.fn(),
  getMyApprovalRequests: vi.fn(),
  getAdminApplications: vi.fn(),
  deleteApplication: vi.fn(),
}));

vi.mock("../utils/roleStorage", () => ({
  roleStorage: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

const mockedGetApplications = vi.mocked(getApplications);
const mockedGetMyApprovalRequests = vi.mocked(getMyApprovalRequests);
const mockedGetAdminApplications = vi.mocked(getAdminApplications);
const mockedDeleteApplication = vi.mocked(deleteApplication);
const mockedRoleStorage = vi.mocked(roleStorage);

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
    mockedGetMyApprovalRequests.mockReturnValue(new Promise(() => {}));
    mockedRoleStorage.get.mockReturnValue("Approver");

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
        status: "Pending",
        createdAt: "2026-01-01T00:00:00Z",
      },
      {
        id: 2,
        title: "備品購入申請",
        status: "Approved",
        createdAt: "2026-01-01T00:00:00Z",
      },
    ];

    mockedGetApplications.mockResolvedValue({
      items: applications,
      totalCount: 2,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    });

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
    mockedGetApplications.mockResolvedValue({
      items: [],
      totalCount: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    });

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

  test("削除確認ダイアログでOKを選択すると、申請を削除して一覧から消すこと", async () => {
    const user = userEvent.setup();

    // 2件の申請を返すようにモックする
    mockedGetApplications.mockResolvedValue({
      items: [
        {
          id: 1,
          title: "削除対象の申請",
          status: "Pending",
          createdAt: "2026-01-01T00:00:00Z",
        },
        {
          id: 2,
          title: "削除対象外の申請",
          status: "Approved",
          createdAt: "2026-01-01T00:00:00Z",
        },
      ],
      totalCount: 2,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    });

    // deleteApplicationが成功するようにモックする
    mockedDeleteApplication.mockResolvedValueOnce();

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

    expect(
      screen.getByRole("dialog", { name: "申請を削除しますか？" }),
    ).toBeInTheDocument();

    // ダイアログに申請タイトルが表示されていることを確認する
    expect(
      screen.getByText("「削除対象の申請」を削除してもよろしいですか？"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "削除する" }));

    // deleteApplicationが正しいID(1)で呼び出されたことを確認する
    expect(mockedDeleteApplication).toHaveBeenCalledWith(1);

    // 削除後、削除対象の申請が表示されなくなり、削除対象外の申請は表示されたままであることを確認する
    await waitFor(() => {
      expect(screen.queryByText("削除対象の申請")).not.toBeInTheDocument();
    });

    expect(screen.getByText("削除対象外の申請")).toBeInTheDocument();
  });

  test("削除確認ダイアログでキャンセルを選択すると、申請が削除されないこと", async () => {
    const user = userEvent.setup();

    mockedGetApplications.mockResolvedValue({
      items: [
        {
          id: 1,
          title: "削除対象の申請",
          status: "Pending",
          createdAt: "2026-01-01T00:00:00Z",
        },
      ],
      totalCount: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    });

    render(
      <MemoryRouter>
        <ApplicationListPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("削除対象の申請")).toBeInTheDocument();

    // 最初の削除ボタンをクリックする
    const deleteButtons = screen.getAllByRole("button", { name: "削除" });
    await user.click(deleteButtons[0]);

    // 削除確認ダイアログが表示されることを確認する
    expect(
      screen.getByRole("dialog", { name: "申請を削除しますか？" }),
    ).toBeInTheDocument();

    // ダイアログに申請タイトルが表示されていることを確認する
    expect(
      screen.getByText("「削除対象の申請」を削除してもよろしいですか？"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "キャンセル" }));

    // deleteApplicationが呼び出されないことを確認する
    expect(mockedDeleteApplication).not.toHaveBeenCalled();

    // 削除対象の申請が表示されたままであることを確認する
    expect(screen.getByText("削除対象の申請")).toBeInTheDocument();
  });

  test("削除APIが失敗した場合にエラーメッセージを表示すること", async () => {
    const user = userEvent.setup();

    mockedGetApplications.mockResolvedValue({
      items: [
        {
          id: 1,
          title: "削除対象の申請",
          status: "Pending",
          createdAt: "2026-01-01T00:00:00Z",
        },
      ],
      totalCount: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    });

    mockedDeleteApplication.mockRejectedValue(new Error("API error"));

    render(
      <MemoryRouter>
        <ApplicationListPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("削除対象の申請")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "削除" }));

    // 削除確認ダイアログが表示されることを確認する
    expect(
      screen.getByRole("dialog", { name: "申請を削除しますか？" }),
    ).toBeInTheDocument();

    // ダイアログに申請タイトルが表示されていることを確認する
    expect(
      screen.getByText("「削除対象の申請」を削除してもよろしいですか？"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "削除する" }));

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
    mockedGetApplications.mockResolvedValue({
      items: [],
      totalCount: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    });

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

  test("ステータスで絞り込むと、指定したステータスで申請一覧を再取得すること", async () => {
    mockedGetApplications
      .mockResolvedValueOnce({
        items: [
          {
            id: 1,
            title: "申請中の申請",
            status: "Pending",
            createdAt: "2026-01-01T00:00:00Z",
          },
          {
            id: 2,
            title: "承認済みの申請",
            status: "Approved",
            createdAt: "2026-01-02T00:00:00Z",
          },
        ],
        totalCount: 2,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      })
      .mockResolvedValueOnce({
        items: [
          {
            id: 1,
            title: "申請中の申請",
            status: "Pending",
            createdAt: "2026-01-01T00:00:00Z",
          },
        ],
        totalCount: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      });

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ApplicationListPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("combobox", { name: "ステータス" }));
    await user.click(screen.getByRole("option", { name: "申請中" }));

    // 「申請中」の申請のみが表示されることを確認する
    expect(screen.getByText("申請中の申請")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("承認済みの申請")).not.toBeInTheDocument();
    });

    expect(mockedGetApplications).toHaveBeenLastCalledWith(1, 10, "Pending");
  });

  test("ステータス絞り込み結果が0件の場合に該当する申請データがありませんを表示すること", async () => {
    mockedGetApplications
      .mockResolvedValueOnce({
        items: [
          {
            id: 1,
            title: "申請中の申請",
            status: "Pending",
            createdAt: "2026-01-01T00:00:00Z",
          },
        ],
        totalCount: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      })
      .mockResolvedValueOnce({
        items: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      });

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ApplicationListPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("combobox", { name: "ステータス" }));
    await user.click(screen.getByRole("option", { name: "承認済み" }));

    // 該当する申請データがありませんメッセージが表示されることを確認する
    expect(
      screen.getByText("該当する申請データがありません。"),
    ).toBeInTheDocument();

    expect(mockedGetApplications).toHaveBeenLastCalledWith(1, 10, "Approved");
  });

  test("すべてのステータスを選択した場合に全件が表示されること", async () => {
    mockedGetApplications.mockResolvedValue({
      items: [
        {
          id: 1,
          title: "申請中の申請",
          status: "Pending",
          createdAt: "2026-01-01T00:00:00Z",
        },
        {
          id: 2,
          title: "承認済みの申請",
          status: "Approved",
          createdAt: "2026-01-02T00:00:00Z",
        },
      ],
      totalCount: 2,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    });

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ApplicationListPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("combobox", { name: "ステータス" }));
    await user.click(screen.getByRole("option", { name: "すべて" }));

    // 全件が表示されることを確認する
    expect(screen.getByText("申請中の申請")).toBeInTheDocument();
    expect(screen.getByText("承認済みの申請")).toBeInTheDocument();
  });

  test("Approverの場合、「承認待ち」タブが表示されること", async () => {
    // Arrange: モックの戻り値を設定する
    mockedGetApplications.mockResolvedValue({
      items: [],
      totalCount: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    });

    mockedRoleStorage.get.mockReturnValue("Approver");

    render(
      <MemoryRouter>
        <ApplicationListPage />
      </MemoryRouter>,
    );

    // Act: 「承認待ち」タブが表示されているか確認する
    const approvalRequestsTab = screen.getByRole("tab", {
      name: "承認待ち",
    });

    // Assert: 「承認待ち」タブが表示されていることを確認する
    expect(approvalRequestsTab).toBeInTheDocument();
  });

  test("Applicant の場合、「承認待ち」タブが表示されないこと", async () => {
    // Arrange: モックの戻り値を設定する
    mockedGetApplications.mockResolvedValue({
      items: [],
      totalCount: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    });

    mockedRoleStorage.get.mockReturnValue("Applicant");

    render(
      <MemoryRouter>
        <ApplicationListPage />
      </MemoryRouter>,
    );

    // Act: 「承認待ち」タブが表示されていないか確認する
    const approvalRequestsTab = screen.queryByRole("tab", {
      name: "承認待ち",
    });

    // Assert: 「承認待ち」タブが表示されていないことを確認する
    expect(approvalRequestsTab).not.toBeInTheDocument();
  });

  test("Approverの場合、「承認待ち」タブを押すと getMyApprovalRequests が呼ばれること", async () => {
    // Arrange: モックの戻り値を設定する
    mockedGetApplications.mockResolvedValue({
      items: [],
      totalCount: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    });

    mockedGetMyApprovalRequests.mockResolvedValue({
      items: [
        {
          id: 1,
          title: "承認待ちの申請",
          status: "Pending",
          createdAt: "2026-01-01T00:00:00Z",
        },
      ],
      totalCount: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    });

    mockedRoleStorage.get.mockReturnValue("Approver");

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ApplicationListPage />
      </MemoryRouter>,
    );

    // 初期表示では「自分の申請」なので getApplications が呼ばれる
    await waitFor(() => {
      expect(mockedGetApplications).toHaveBeenCalledWith(1, 10, "All");
    });

    // Act
    await user.click(screen.getByRole("tab", { name: "承認待ち" }));

    // Assert - getMyApprovalRequests が呼ばれ、承認待ちの申請が表示されることを確認する
    await waitFor(() => {
      expect(mockedGetMyApprovalRequests).toHaveBeenCalledWith(1, 10);
      expect(
        screen.queryByRole("link", { name: "新規作成" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: "編集" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "削除" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("combobox", { name: "ステータス" }),
      ).not.toBeInTheDocument();
    });
  });

  test("承認待ち一覧の取得に失敗した場合、エラーメッセージを表示し古い一覧を表示しないこと", async () => {
    // 自分の申請一覧を一度表示
    mockedGetApplications.mockResolvedValue({
      items: [
        {
          id: 1,
          title: "古い申請データ",
          status: "Pending",
          createdAt: "2026-01-01T00:00:00Z",
        },
      ],
      totalCount: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    });

    // 承認待ち一覧の取得に失敗するようにモックする
    mockedGetMyApprovalRequests.mockRejectedValue(new Error("API error"));

    mockedRoleStorage.get.mockReturnValue("Approver");

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ApplicationListPage />
      </MemoryRouter>,
    );

    // 初期表示では「自分の申請」なので getApplications が呼ばれる
    await waitFor(() => {
      expect(mockedGetApplications).toHaveBeenCalledWith(1, 10, "All");
    });

    // 承認待ちタブでAPI失敗
    await user.click(screen.getByRole("tab", { name: "承認待ち" }));

    // エラーメッセージが表示されるのを待つ
    await waitFor(() => {
      expect(
        screen.getByText("申請一覧の取得に失敗しました。"),
      ).toBeInTheDocument();
    });

    // 古い申請データが表示されないことを確認する
    expect(screen.queryByText("古い申請データ")).not.toBeInTheDocument();
  });

  test("Adminの場合、「管理者用」タブが表示されること", async () => {
    // Arrange: モックの戻り値を設定する
    mockedGetAdminApplications.mockResolvedValue({
      items: [],
      totalCount: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    });

    mockedRoleStorage.get.mockReturnValue("Admin");

    render(
      <MemoryRouter>
        <ApplicationListPage />
      </MemoryRouter>,
    );

    // Act: 「管理者用」タブが表示されているか確認する
    const adminTab = screen.getByRole("tab", {
      name: "管理者用",
    });

    // Assert: 「管理者用」タブが表示されていることを確認する
    expect(adminTab).toBeInTheDocument();
  });

  test("Adminログイン時に管理者用一覧が表示されること", async () => {
    // Arrange - モックの戻り値を設定する
    mockedGetAdminApplications.mockResolvedValue({
      items: [
        {
          id: 1,
          title: "管理者用の申請",
          status: "Pending",
          createdAt: "2026-01-01T00:00:00Z",
        },
      ],
      totalCount: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    });

    mockedRoleStorage.get.mockReturnValue("Admin");

    // Act
    render(
      <MemoryRouter>
        <ApplicationListPage />
      </MemoryRouter>,
    );

    // Assert - 管理者用の申請が表示されることを確認する
    expect(await screen.findByText("管理者用の申請")).toBeInTheDocument();
  });

  test.each(["Applicant", "Approver"] as const)(
    "%sでは管理者用タブや一覧が表示されないこと",
    async (role) => {
      // Arrange - モックの戻り値を設定する
      mockedGetAdminApplications.mockResolvedValue({
        items: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      });

      mockedRoleStorage.get.mockReturnValue(role);

      // Act
      render(
        <MemoryRouter>
          <ApplicationListPage />
        </MemoryRouter>,
      );

      // Assert - 管理者用タブや一覧が表示されないことを確認する
      expect(
        screen.queryByRole("tab", { name: "管理者用" }),
      ).not.toBeInTheDocument();

      expect(screen.queryByText("管理者用の申請")).not.toBeInTheDocument();
    },
  );

  test("Admin一覧では新規作成・編集・削除ボタンが表示されないこと", async () => {
    // Arrange - モックの戻り値を設定する
    mockedGetAdminApplications.mockResolvedValue({
      items: [
        {
          id: 1,
          title: "管理者用の申請",
          status: "Pending",
          createdAt: "2026-01-01T00:00:00Z",
        },
      ],
      totalCount: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    });

    mockedRoleStorage.get.mockReturnValue("Admin");

    // Act
    render(
      <MemoryRouter>
        <ApplicationListPage />
      </MemoryRouter>,
    );

    // Assert - 新規作成・編集・削除ボタンが表示されないことを確認する
    expect(
      screen.queryByRole("link", { name: "新規作成" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "編集" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "削除" }),
    ).not.toBeInTheDocument();
  });
});
