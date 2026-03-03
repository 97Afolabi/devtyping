import {
  requireAdminUser,
  requireAuthenticatedUser,
} from "../../src/lib/server/firebase-auth";
import { firestoreUser } from "../../src/lib/data/firebase/firestore/users";

jest.mock("../../src/lib/data/firebase/firestore/users", () => ({
  firestoreUser: {
    findById: jest.fn(),
  },
}));

describe("server firebase auth", () => {
  const originalApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const originalFetch = global.fetch;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "test-api-key";
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = originalApiKey;
    global.fetch = originalFetch;
  });

  it("throws when authorization header is missing", async () => {
    await expect(
      requireAuthenticatedUser(new Request("http://localhost")),
    ).rejects.toThrow("Missing authorization header");
  });

  it("throws when authorization header format is invalid", async () => {
    const request = new Request("http://localhost", {
      headers: {
        authorization: "Basic abc",
      },
    });

    await expect(requireAuthenticatedUser(request)).rejects.toThrow(
      "Invalid authorization header format",
    );
  });

  it("throws when firebase api key is missing", async () => {
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    const request = new Request("http://localhost", {
      headers: {
        authorization: "Bearer token",
      },
    });

    await expect(requireAuthenticatedUser(request)).rejects.toThrow(
      "Missing Firebase API key configuration",
    );
  });

  it("throws for invalid token lookup response", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
    });

    const request = new Request("http://localhost", {
      headers: {
        authorization: "Bearer token",
      },
    });

    await expect(requireAuthenticatedUser(request)).rejects.toThrow(
      "Invalid authentication token",
    );
  });

  it("returns authenticated user payload when token and firestore lookup succeed", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        users: [{ localId: "uid-1" }],
      }),
    });

    (firestoreUser.findById as jest.Mock).mockResolvedValue({
      slug: "uid-1",
      username: "sam",
      isActive: true,
      isAdmin: false,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    });

    const request = new Request("http://localhost", {
      headers: {
        authorization: "Bearer token",
      },
    });

    await expect(requireAuthenticatedUser(request)).resolves.toMatchObject({
      uid: "uid-1",
      username: "sam",
      isAdmin: false,
    });
  });

  it("throws forbidden when authenticated user is not admin", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        users: [{ localId: "uid-1" }],
      }),
    });

    (firestoreUser.findById as jest.Mock).mockResolvedValue({
      slug: "uid-1",
      username: "sam",
      isActive: true,
      isAdmin: false,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    });

    const request = new Request("http://localhost", {
      headers: {
        authorization: "Bearer token",
      },
    });

    await expect(requireAdminUser(request)).rejects.toThrow("Forbidden");
  });

  it("returns admin user when permissions check passes", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        users: [{ localId: "uid-1" }],
      }),
    });

    (firestoreUser.findById as jest.Mock).mockResolvedValue({
      slug: "uid-1",
      username: "admin",
      isActive: true,
      isAdmin: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    });

    const request = new Request("http://localhost", {
      headers: {
        authorization: "Bearer token",
      },
    });

    await expect(requireAdminUser(request)).resolves.toMatchObject({
      uid: "uid-1",
      username: "admin",
      isAdmin: true,
    });
  });
});
