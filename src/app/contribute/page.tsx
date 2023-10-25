"use client";
import { useEffect, useState } from "react";
import { getAuthUser } from "../../lib/data/auth";
import { firestoreTopic } from "../../lib/data/firebase/firestore/topics";
import { exercise } from "../../lib/data/data";
import { TopicSummary } from "../../lib/interfaces/TopicSummary";
import SuccessMessage from "../../components/editor/SuccessMessage";
import ValidationError from "../../components/editor/ValidationError";
import { isAuth } from "../../components/IsAuth";

const Contribute = () => {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");
  const [topicSummaries, setTopicSummaries] = useState<TopicSummary[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string[]>([]);

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

  const handleFormSubmission = async (
    e: React.ChangeEvent<HTMLFormElement>
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

    await exercise.save({ title, topic, text, author: author!.username });

    setSuccess([
      "Thank you for contributing!",
      "Your submission will be reviewed as soon as possible",
    ]);
    setTitle("");
    setTopic("");
    setText("");
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
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
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
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Paste sample"
            rows={20}
            required={true}
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-slate-600 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default isAuth(Contribute);
