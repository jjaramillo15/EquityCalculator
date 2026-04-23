import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProjectWorkspacePage from "./page";

vi.mock("@/lib/current-user", () => ({
  getCurrentUser: vi.fn().mockResolvedValue({
    id: "user-1",
    email: "hero@example.com",
    name: "hero",
  }),
}));

vi.mock("@/lib/workspace", () => ({
  getProjectWorkspace: vi.fn().mockResolvedValue({
    project: {
      id: "project-1",
      name: "Friday 3-Bet Pots",
    },
    ranges: [
      {
        id: "range-1",
        name: "CO Open",
        textValue: "22+,A2s+,K9s+,QTs+,JTs,ATo+,KJo+",
      },
    ],
    board: ["Ah", "Kd", "7c"],
    players: [
      { label: "Hero", equity: 52 },
      { label: "Villain", equity: 48 },
    ],
    recentScenarios: [
      {
        id: "scenario-1",
        name: "BTN vs BB single-raised pot",
        updatedLabel: "Updated 2026-04-23",
      },
    ],
  }),
}));

describe("ProjectWorkspacePage", () => {
  it("shows saved ranges and the equity workspace", async () => {
    render(
      await ProjectWorkspacePage({
        params: Promise.resolve({ projectId: "project-1" }),
      }),
    );

    expect(screen.getByText(/saved ranges/i)).toBeInTheDocument();
    expect(screen.getByText(/equity results/i)).toBeInTheDocument();
    expect(screen.getByText(/recent scenarios/i)).toBeInTheDocument();
  });
});
