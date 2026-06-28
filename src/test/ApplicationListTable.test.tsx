import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

import { ApplicationListTable } from "../components/applications/ApplicationListTable";
import type { ApplicationListItem } from "../types/application";

// 申請一覧のテーブル表示に関するテスト
describe("ApplicationListTable", () => {
  const applications: ApplicationListItem[] = [
    {
      id: 1,
      title: "出張申請",
      applicantDisplayName: "山田太郎",
      status: "Pending",
      createdAt: "2026-01-01T12:00:00Z",
    },
    {
      id: 2,
      title: "備品購入申請",
      applicantDisplayName: "佐藤花子",
      status: "Approved",
      createdAt: "2026-01-03T12:00:00Z",
    },
  ];

  function renderComponent(
    onDelete?: (application: ApplicationListItem) => void,
  ) {
    render(
      <MemoryRouter>
        <ApplicationListTable
          applications={applications}
          onDelete={onDelete}
          showEdit={true}
          showDelete={true}
        />
      </MemoryRouter>,
    );
  }

  test("各行に詳細リンク・編集リンク・削除ボタンが表示されること", () => {
    const onDelete = vi.fn();

    renderComponent(onDelete);

    expect(screen.getAllByRole("link", { name: "詳細" })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "編集" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "削除" })).toHaveLength(2);
  });

  test("詳細リンクに正しい遷移先が設定されていること", () => {
    renderComponent();

    const detailLinks = screen.getAllByRole("link", { name: "詳細" });

    expect(detailLinks[0]).toHaveAttribute("href", "/applications/1");
    expect(detailLinks[1]).toHaveAttribute("href", "/applications/2");
  });

  test("編集リンクに正しい遷移先が設定されていること", () => {
    renderComponent();

    const editLinks = screen.getAllByRole("link", { name: "編集" });

    expect(editLinks[0]).toHaveAttribute("href", "/applications/1/edit");
    expect(editLinks[1]).toHaveAttribute("href", "/applications/2/edit");
  });

  test("削除ボタンを押すとonDeleteが申請ID付きで呼ばれること", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <MemoryRouter>
        <ApplicationListTable
          applications={[
            {
              id: 1,
              title: "出張申請",
              status: "Pending",
              applicantDisplayName: "山田太郎",
              createdAt: "2026-01-01T12:00:00Z",
            },
          ]}
          onDelete={onDelete}
          showEdit={true}
          showDelete={true}
        />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "削除" }));

    expect(onDelete).toHaveBeenCalledWith(applications[0]);
  });
});
