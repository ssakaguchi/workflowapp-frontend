import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";

import GlobalSnackbar from "../components/layout/GlobalSnackbar";
import {
  type AppNotification,
  useNotificationStore,
} from "../stores/notificationStore";

describe("GlobalSnackbar", () => {
  const updateNotification = (notification: AppNotification | undefined) => {
    const { result, unmount } = renderHook(() => useNotificationStore());

    act(() => {
      result.current.updateChanges(notification);
    });

    unmount();
  };

  beforeEach(() => {
    updateNotification(undefined);
  });

  test("通知ストアに通知が設定された場合、メッセージを表示すること", () => {
    // arrange
    render(<GlobalSnackbar />);

    // act
    updateNotification({
      message: "申請を作成しました。",
      severity: "success",
    });

    // assert
    expect(screen.getByText("申請を作成しました。")).toBeInTheDocument();
  });

  test("通知を閉じた場合、メッセージを非表示にすること", async () => {
    // arrange
    const user = userEvent.setup();

    render(<GlobalSnackbar />);

    updateNotification({
      message: "申請を作成しました。",
      severity: "success",
    });

    expect(screen.getByText("申請を作成しました。")).toBeInTheDocument();

    // act
    await user.click(
      screen.getByRole("button", {
        name: /close/i,
      }),
    );

    // assert
    expect(screen.queryByText("申請を作成しました。")).not.toBeInTheDocument();
  });
});
