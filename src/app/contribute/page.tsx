"use client";
import { useEffect, useState } from "react";
import { getAuthUser } from "../../lib/data/auth";
import { firestoreTopic } from "../../lib/data/firebase/firestore/topics";
import { postWithAuth } from "../../lib/data/firebase/auth/request";
import { TopicSummary } from "../../lib/interfaces/TopicSummary";
import { ExercisePracticeLink } from "../../lib/interfaces/Exercise";
import SuccessMessage from "../../components/editor/SuccessMessage";
import ValidationError from "../../components/editor/ValidationError";
import { isAuth } from "../../components/IsAuth";

const PRACTICE_LINK_PROVIDERS: ExercisePracticeLink["provider"][] = [
  "leetcode",
  "hackerrank",
  "codewars",
  "other",
];

const emptyPracticeLink = (): ExercisePracticeLink => ({
  label: "",
  url: "",
  provider: "leetcode",
  free: true,
});

const DIFFICULTIES = [1, 2, 3] as const;

const Contribute = () => {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<"" | 1 | 2 | 3>("");
  const [practiceLinks, setPracticeLinks] = useState<ExercisePracticeLink[]>(
    [],
  );
  const [topicSummaries, setTopicSummaries] = useState<TopicSummary[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string[]>([]);

  const addPracticeLink = () => {
    setPracticeLinks((links) => [...links, emptyPracticeLink()]);
  };

  const updatePracticeLink = (
    index: number,
    patch: Partial<ExercisePracticeLink>,
  ) => {
    setPracticeLinks((links) =>
      links.map((link, i) => (i === index ? { ...link, ...patch } : link)),
    );
  };

  const removePracticeLink = (index: number) => {
    setPracticeLinks((links) => links.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const getTopics = async () => {
      const summaries = await firestoreTopic.findAll();
      setTopicSummaries(summaries);
    };

    getTopics();
  }, []);

  const handleTitleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTopicUpdate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTopic(e.target.value);
  };

  const handleTextUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleCategoryUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };

  const handleDifficultyUpdate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(e.target.value === "" ? "" : (Number(e.target.value) as 1 | 2 | 3));
  };

  const handleFormSubmission = async (
    e: React.ChangeEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const newErrors = [];
    if (topic === "") {
      newErrors.push("Topic is required");
    }

    const author = getAuthUser();
    if (!author) {
      newErrors.push("Please log in");
    }
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return null;
    }

    const filledPracticeLinks = practiceLinks.filter(
      (link) => link.label.trim() && link.url.trim(),
    );

    const response = await postWithAuth("/api/exercises", {
      title,
      topic,
      text,
      practiceLinks: filledPracticeLinks.length
        ? filledPracticeLinks
        : undefined,
      category: category.trim() || undefined,
      difficulty: difficulty === "" ? undefined : difficulty,
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setErrors([data.error ?? "Unable to save exercise"]);
      return;
    }

    setSuccess([
      "Thank you for contributing!",
      "Your submission will be reviewed as soon as possible",
    ]);
    setTitle("");
    setTopic("");
    setText("");
    setCategory("");
    setDifficulty("");
    setPracticeLinks([]);
  };

  return (
    <div className="flex justify-center items-center min-h-screen mx-3">
      <form onSubmit={handleFormSubmission} className="w-full max-w-lg">
        {errors.length > 0 && <ValidationError errors={errors} />}
        {success.length > 0 && <SuccessMessage messages={success} />}
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-3/4 mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleTitleUpdate}
              className="appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:shadow-outline"
              placeholder="Enter title"
              required={true}
            />
          </div>

          <div className="w-full md:w-1/4 md:pl-2 mb-4">
            <label
              htmlFor="topic"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Topic
            </label>
            <select
              id="topic"
              name="topic"
              value={topic}
              onChange={handleTopicUpdate}
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-sm leading-tight focus:outline-hidden focus:shadow-outline"
            >
              <option>Choose</option>
              {topicSummaries &&
                topicSummaries.map((topic: TopicSummary) => (
                  <option value={topic.slug} key={topic.slug}>
                    {topic.title}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-3/4 mb-4">
            <label
              htmlFor="category"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Category (optional)
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={category}
              onChange={handleCategoryUpdate}
              className="appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:shadow-outline"
              placeholder="e.g. linked-lists, graphs"
            />
          </div>

          <div className="w-full md:w-1/4 md:pl-2 mb-4">
            <label
              htmlFor="difficulty"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Difficulty (optional)
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={difficulty}
              onChange={handleDifficultyUpdate}
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-sm leading-tight focus:outline-hidden focus:shadow-outline"
            >
              <option value="">Unset</option>
              {DIFFICULTIES.map((level) => (
                <option value={level} key={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="text"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Text
          </label>
          <textarea
            id="text"
            name="text"
            value={text}
            onChange={handleTextUpdate}
            className="appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:shadow-outline"
            placeholder="Paste sample"
            rows={20}
            required={true}
          />
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="block text-gray-700 text-sm font-bold">
              Practice links (optional)
            </span>
            <button
              type="button"
              onClick={addPracticeLink}
              className="text-sm text-slate-600 hover:text-slate-900 font-bold"
            >
              + Add link
            </button>
          </div>
          {practiceLinks.map((link, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-2 mb-2 items-start md:items-center"
            >
              <input
                type="text"
                value={link.label}
                onChange={(e) =>
                  updatePracticeLink(index, { label: e.target.value })
                }
                placeholder="Problem title, e.g. Linked List Cycle"
                className="appearance-none border rounded-sm w-full md:w-2/5 py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:shadow-outline"
              />
              <input
                type="url"
                value={link.url}
                onChange={(e) =>
                  updatePracticeLink(index, { url: e.target.value })
                }
                placeholder="https://..."
                className="appearance-none border rounded-sm w-full md:w-2/5 py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:shadow-outline"
              />
              <select
                value={link.provider}
                onChange={(e) =>
                  updatePracticeLink(index, {
                    provider: e.target
                      .value as ExercisePracticeLink["provider"],
                  })
                }
                className="border rounded-sm py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:shadow-outline"
              >
                {PRACTICE_LINK_PROVIDERS.map((provider) => (
                  <option value={provider} key={provider}>
                    {provider}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-1 text-sm text-gray-700 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={link.free}
                  onChange={(e) =>
                    updatePracticeLink(index, { free: e.target.checked })
                  }
                />
                Free
              </label>
              <button
                type="button"
                onClick={() => removePracticeLink(index)}
                className="text-sm text-red-600 hover:text-red-900"
                aria-label="Remove practice link"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-slate-600 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded-sm focus:outline-hidden focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default isAuth(Contribute);
