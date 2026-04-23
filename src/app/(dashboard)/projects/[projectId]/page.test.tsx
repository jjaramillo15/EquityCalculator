import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { act, Suspense } from "react";
import { describe, expect, it } from "vitest";
import ProjectWorkspacePage from "./page";

describe("ProjectWorkspacePage", () => {
  it("shows saved ranges and the equity workspace", async () => {
    await act(async () => {
      render(
        <Suspense fallback={null}>
          <ProjectWorkspacePage
            params={Promise.resolve({ projectId: "project-1" })}
          />
        </Suspense>,
      );
    });

    expect(await screen.findByText(/saved ranges/i)).toBeInTheDocument();
    expect(await screen.findByText(/equity results/i)).toBeInTheDocument();
  });
});
