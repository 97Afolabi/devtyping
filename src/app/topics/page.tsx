"use client";
import { useState } from "react";
import { getAuthUser } from "../../lib/data/auth";
import { firestoreTopic } from "../../lib/data/firebase/firestore/topics";
import SuccessMessage from "../../components/editor/SuccessMessage";
import ValidationError from "../../components/editor/ValidationError";
import { isAdmin } from "../../components/IsAuth";

const Topics = () => {
  const [topic, setTopic] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string[]>([]);

  const handleTopicUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  const handleSummaryUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSummary(e.target.value);
  };

  const handleDescriptionUpdate = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
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

    await firestoreTopic.save({
      title: topic,
      summary,
      description,
      countActive: 0,
      countInactive: 0,
      isActive: true,
    });

    setSuccess(["Topic added successfully"]);
    setTopic("");
    setSummary("");
    setDescription("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen mx-3">
      <form onSubmit={handleFormSubmission} className="w-full max-w-lg">
        {errors.length > 0 && <ValidationError errors={errors} />}
        {success.length > 0 && <SuccessMessage messages={success} />}

        <div className="w-full mb-4">
          <label
            htmlFor="topic"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Topic
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={topic}
            onChange={handleTopicUpdate}
            className="appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:shadow-outline"
            placeholder="Enter topic"
            required={true}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="summary"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Summary
          </label>
          <textarea
            name="summary"
            value={summary}
            onChange={handleSummaryUpdate}
            className="appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:shadow-outline"
            placeholder="Enter summary"
            rows={5}
            required={true}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description
          </label>
          <textarea
            name="description"
            value={description}
            onChange={handleDescriptionUpdate}
            className="appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:shadow-outline"
            placeholder="Enter description"
            rows={10}
            required={true}
          />
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

export default isAdmin(Topics);
