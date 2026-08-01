const mockCollection = jest.fn();

jest.mock("../../src/lib/server/firebase-admin", () => ({
  adminDb: {
    collection: (...args: unknown[]) => mockCollection(...args),
  },
}));

import {
  getActiveExerciseData,
  getTopicSampleData,
} from "../../src/lib/server/firestore-read";

describe("firestore-read", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  describe("getTopicSampleData", () => {
    it("returns null instead of throwing when Firestore is unreachable", async () => {
      mockCollection.mockReturnValue({
        doc: () => ({
          get: () => Promise.reject(new Error("Unable to detect a Project Id")),
        }),
      });

      const result = await getTopicSampleData("html");

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it("returns null when the topic doesn't exist", async () => {
      mockCollection.mockReturnValue({
        doc: () => ({ get: () => Promise.resolve({ exists: false }) }),
      });

      const result = await getTopicSampleData("nonexistent");

      expect(result).toBeNull();
    });

    it("returns the topic with its active exercises on success", async () => {
      mockCollection.mockImplementation((name: string) => {
        if (name === "topics") {
          return {
            doc: () => ({
              get: () =>
                Promise.resolve({
                  exists: true,
                  data: () => ({ title: "HTML", description: "Learn HTML" }),
                }),
            }),
          };
        }

        const chain: {
          where: () => typeof chain;
          get: () => Promise<{ docs: unknown[] }>;
        } = {
          where: () => chain,
          get: () =>
            Promise.resolve({
              docs: [
                {
                  id: "ex-1",
                  data: () => ({
                    title: "Ex 1",
                    topicSlug: "html",
                    author: "a",
                    downVotes: 0,
                    upVotes: 0,
                    isActive: true,
                  }),
                },
              ],
            }),
        };
        return chain;
      });

      const result = await getTopicSampleData("html");

      expect(result).toEqual({
        title: "HTML",
        slug: "html",
        description: "Learn HTML",
        samples: [
          expect.objectContaining({
            id: "ex-1",
            title: "Ex 1",
            topicSlug: "html",
          }),
        ],
      });
    });
  });

  describe("getActiveExerciseData", () => {
    it("returns null instead of throwing when Firestore is unreachable", async () => {
      mockCollection.mockReturnValue({
        doc: () => ({ get: () => Promise.reject(new Error("boom")) }),
      });

      const result = await getActiveExerciseData("some-slug");

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it("returns null when the exercise isn't active", async () => {
      mockCollection.mockReturnValue({
        doc: () => ({
          get: () =>
            Promise.resolve({
              exists: true,
              id: "ex-1",
              data: () => ({ isActive: false }),
            }),
        }),
      });

      const result = await getActiveExerciseData("some-slug");

      expect(result).toBeNull();
    });

    it("returns the merged summary and details on success", async () => {
      mockCollection.mockImplementation((name: string) => {
        if (name === "exercises") {
          return {
            doc: () => ({
              get: () =>
                Promise.resolve({
                  exists: true,
                  id: "ex-1",
                  data: () => ({
                    title: "Ex 1",
                    topicSlug: "html",
                    author: "a",
                    downVotes: 0,
                    upVotes: 0,
                    isActive: true,
                  }),
                }),
            }),
          };
        }

        return {
          doc: () => ({
            get: () =>
              Promise.resolve({
                exists: true,
                data: () => ({ slug: "ex-1", text: "<div></div>" }),
              }),
          }),
        };
      });

      const result = await getActiveExerciseData("ex-1");

      expect(result).toEqual(
        expect.objectContaining({
          id: "ex-1",
          title: "Ex 1",
          topicSlug: "html",
          text: "<div></div>",
        }),
      );
    });
  });
});
