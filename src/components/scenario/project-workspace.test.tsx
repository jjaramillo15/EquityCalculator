import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProjectWorkspace } from "./project-workspace";

const fetchMock = vi.fn();

describe("ProjectWorkspace", () => {
  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  it("calculates equity and saves a scenario into recent history", async () => {
    const user = userEvent.setup();

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          players: [
            { label: "Hero", equity: 61 },
            { label: "Villain", equity: 39 },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "scenario-99",
          name: "River Jam Spot",
          updatedAt: "2026-04-23T12:00:00.000Z",
        }),
      });

    vi.stubGlobal("fetch", fetchMock);

    render(
      <ProjectWorkspace
        projectId="project-1"
        projectName="Friday 3-Bet Pots"
        ranges={[
          {
            id: "range-1",
            name: "CO Open",
            textValue: "QQ+,AKs",
          },
        ]}
        board={["Ah", "Kd", "7c"]}
        players={[
          { label: "Hero", equity: 52 },
          { label: "Villain", equity: 48 },
        ]}
        recentScenarios={[]}
      />,
    );

    await user.clear(screen.getByLabelText(/scenario name/i));
    await user.type(screen.getByLabelText(/scenario name/i), "River Jam Spot");
    await user.type(screen.getByLabelText(/hero range text/i), "QQ+,AKs");
    await user.type(screen.getByLabelText(/villain range text/i), "JJ+,AQs");

    await user.click(screen.getByRole("button", { name: /calculate equity/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/scenarios/calculate",
        expect.objectContaining({
          method: "POST",
        }),
      );
    });

    expect(await screen.findByText("61%")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /save scenario/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/scenarios",
        expect.objectContaining({
          method: "POST",
        }),
      );
    });

    expect(await screen.findByText(/scenario saved/i)).toBeInTheDocument();
    expect(screen.getByText("River Jam Spot")).toBeInTheDocument();
  });
});
