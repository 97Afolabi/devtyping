/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import SummaryCard from "../../src/components/homepage/SummaryCard";
import { TopicSummary } from "../../src/lib/interfaces/TopicSummary";

const baseTopic: TopicSummary = {
  title: "Python",
  slug: "python",
  summary: "Practice Python snippets",
  countActive: 0,
  countInactive: 0,
};

describe("SummaryCard", () => {
  it("renders an active Start link and the exercise count for a populated topic", () => {
    render(
      <SummaryCard prefix="" data={{ ...baseTopic, countActive: 3 }} />,
    );

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.queryByText("Coming soon")).not.toBeInTheDocument();

    const startLink = screen.getByRole("link", { name: "Start" });
    expect(startLink).toHaveAttribute("href", "/python");
  });

  it("shows a Coming soon badge and no Start link for an empty topic", () => {
    render(<SummaryCard prefix="" data={{ ...baseTopic, countActive: 0 }} />);

    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Start" }),
    ).not.toBeInTheDocument();
  });

  it("does not apply the empty state in review mode, even with zero inactive exercises", () => {
    render(
      <SummaryCard
        prefix="review"
        data={{ ...baseTopic, countActive: 0, countInactive: 0 }}
      />,
    );

    expect(screen.queryByText("Coming soon")).not.toBeInTheDocument();
    const startLink = screen.getByRole("link", { name: "Start" });
    expect(startLink).toHaveAttribute("href", "review/python");
  });

  it("shows the inactive count and Start link in review mode when submissions exist", () => {
    render(
      <SummaryCard
        prefix="review"
        data={{ ...baseTopic, countActive: 0, countInactive: 2 }}
      />,
    );

    expect(screen.getByText("2")).toBeInTheDocument();
    const startLink = screen.getByRole("link", { name: "Start" });
    expect(startLink).toHaveAttribute("href", "review/python");
  });
});
