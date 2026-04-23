import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BoardPicker } from "./board-picker";

describe("BoardPicker", () => {
  it("disables unavailable cards", () => {
    render(
      <BoardPicker value={["Ah"]} unavailable={["Ah", "Kd"]} onChange={() => undefined} />,
    );

    expect(screen.getByRole("button", { name: "Ah" })).toBeDisabled();
  });
});
