import {
  adjustSpaces,
  generateExerciseSlug,
  generateSlug,
  replaceHTMLChar,
  truncateDescription,
} from "../../src/lib/constants/strings";

describe("strings utilities", () => {
  it("escapes html brackets", () => {
    expect(replaceHTMLChar("<div>Hi</div>")).toContain(
      "&lt;div&gt;Hi&lt;/div&gt;",
    );
  });

  it("converts whitespace and new lines for html rendering", () => {
    expect(replaceHTMLChar("A B\nC")).toBe("A&nbsp;B<br>C");
  });

  it("generates lowercase slug with hyphens", () => {
    expect(generateSlug("React Fundamentals Intro")).toBe(
      "react-fundamentals-intro",
    );
  });

  it("removes non-ascii and punctuation when generating slug", () => {
    expect(generateSlug("Café, C# & TypeScript!")).toBe("caf-c-typescript");
  });

  it("truncates slug to provided max length", () => {
    expect(generateSlug("one two three four", 7)).toBe("one-two");
  });

  it("creates exercise slug with 10-digit suffix", () => {
    const slug = generateExerciseSlug("Sample Exercise");
    expect(slug).toMatch(/^sample-exercise-\d{10}$/);
  });

  it("normalizes spaces and line breaks", () => {
    expect(adjustSpaces("a\n\n\n b\t    c")).toBe("a\n\n b    c");
  });

  it("leaves short descriptions untouched", () => {
    expect(truncateDescription("Short description")).toBe(
      "Short description",
    );
  });

  it("truncates long descriptions at a word boundary with an ellipsis", () => {
    const long = "word ".repeat(50).trim();
    const result = truncateDescription(long, 20);

    expect(result.length).toBeLessThanOrEqual(20);
    expect(result.endsWith("…")).toBe(true);
    expect(result).not.toMatch(/\s…$/);
  });

  it("hard-truncates when there's no word boundary to break on", () => {
    const result = truncateDescription("a".repeat(30), 10);

    expect(result).toBe("aaaaaaaaa…");
  });
});
