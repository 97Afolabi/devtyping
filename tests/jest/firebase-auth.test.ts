import {
  requireAdminUser,
  requireAuthenticatedUser,
} from "../../src/lib/server/firebase-auth";
import { adminAuth, adminDb } from "../../src/lib/server/firebase-admin";

jest.mock("../../src/lib/server/firebase-admin", () => ({
  adminAuth: {
    verifyIdToken: jest.fn(),
  },
  adminDb: {
    collection: jest.fn(),
  },
}));

describe("server firebase auth", () => {
  const mockDocGet = jest.fn();
  const mockDoc = jest.fn(() => ({ get: mockDocGet }));
  const mockCollection = jest.fn(() => ({ doc: mockDoc }));

  beforeEach(() => {
    (adminDb.collection as jest.Mock).mockImplementation(mockCollection);
    jest.clearAllMocks();
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
    (adminAuth.verifyIdToken as jest.Mock).mockRejectedValue(
      new Error("invalid token"),
    );

    const request = new Request("http://localhost", {
      headers: {
        authorization: "Bearer token",
      },
    });

    await expect(requireAuthenticatedUser(request)).rejects.toThrow(
      "Invalid authentication token",
    );
  });

  it("throws for invalid token lookup response", async () => {
    (adminAuth.verifyIdToken as jest.Mock).mockRejectedValue(
      new Error("invalid token"),
    );

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
    (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: "uid-1" });
    mockDocGet.mockResolvedValue({
      exists: true,
      data: () => ({
        slug: "uid-1",
        username: "sam",
        isActive: true,
        isAdmin: false,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      }),
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
    (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: "uid-1" });
    mockDocGet.mockResolvedValue({
      exists: true,
      data: () => ({
        slug: "uid-1",
        username: "sam",
        isActive: true,
        isAdmin: false,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      }),
    });

    const request = new Request("http://localhost", {
      headers: {
        authorization: "Bearer token",
      },
    });

    await expect(requireAdminUser(request)).rejects.toThrow("Forbidden");
  });

  it("returns admin user when permissions check passes", async () => {
    (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: "uid-1" });
    mockDocGet.mockResolvedValue({
      exists: true,
      data: () => ({
        slug: "uid-1",
        username: "admin",
        isActive: true,
        isAdmin: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      }),
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

  it("throws when user document does not exist", async () => {
    (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: "uid-1" });
    mockDocGet.mockResolvedValue({
      exists: false,
    });

    const request = new Request("http://localhost", {
      headers: {
        authorization: "Bearer token",
      },
    });

    await expect(requireAuthenticatedUser(request)).rejects.toThrow(
      "Unable to resolve authenticated user",
    );
  });
});
