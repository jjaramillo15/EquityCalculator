import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { RangeMatrix } from "./range-matrix";

function RangeMatrixHarness() {
  const [value, setValue] = useState(["AA"]);

  return <RangeMatrix value={value} onChange={setValue} />;
}

describe("RangeMatrix", () => {
  it("toggles a hand on click", async () => {
    const user = userEvent.setup();

    render(<RangeMatrixHarness />);

    await user.click(screen.getByRole("button", { name: "KK" }));

    expect(screen.getByRole("button", { name: "KK" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
