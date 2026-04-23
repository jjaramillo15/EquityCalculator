import { beforeEach, describe, expect, it, vi } from "vitest";

const getCurrentUserMock = vi.hoisted(() => vi.fn());
const createProjectMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/current-user", () => ({
  getCurrentUser: getCurrentUserMock,
}));

vi.mock("@/lib/projects", () => ({
  createProject: createProjectMock,
}));

import { POST } from "./route";

describe("POST /api/projects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when the request is unauthenticated", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const response = await POST(
      new Request("http://localhost/api/projects", {
        method: "POST",
        body: JSON.stringify({ name: "Study Pack" }),
      }),
    );

    expect(response.status).toBe(401);
  });

  it("creates the project for the authenticated user", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "user-1" });
    createProjectMock.mockResolvedValue({ id: "project-1", name: "Study Pack" });

    const response = await POST(
      new Request("http://localhost/api/projects", {
        method: "POST",
        body: JSON.stringify({ name: "Study Pack" }),
      }),
    );

    expect(createProjectMock).toHaveBeenCalledWith("user-1", "Study Pack");
    expect(response.status).toBe(201);
  });
});
