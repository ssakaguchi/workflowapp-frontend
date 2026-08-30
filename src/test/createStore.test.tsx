import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import { createStore } from "../stores/createStore";

describe("createStore", () => {
  test("ストアの更新内容が別のコンポーネントにも反映されること", async () => {
    // arrange
    const user = userEvent.setup();
    const useTestStore = createStore<string>("初期値");

    function UpdateComponent() {
      const { updateChanges } = useTestStore();

      return (
        <button type="button" onClick={() => updateChanges("更新後")}>
          更新
        </button>
      );
    }

    function DisplayComponent() {
      const { store } = useTestStore();

      return <p>{store.data}</p>;
    }

    render(
      <>
        <UpdateComponent />
        <DisplayComponent />
      </>,
    );

    expect(screen.getByText("初期値")).toBeInTheDocument();

    // act
    await user.click(screen.getByRole("button", { name: "更新" }));

    // assert
    expect(screen.getByText("更新後")).toBeInTheDocument();
    expect(screen.queryByText("初期値")).not.toBeInTheDocument();
  });
});
