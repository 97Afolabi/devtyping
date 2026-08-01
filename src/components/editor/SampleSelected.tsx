"use client";
import { useEffect, useState } from "react";
import { Exercise, ExerciseSummary } from "../../lib/interfaces/Exercise";
import { exercise } from "../../lib/data/data";
import Sidebar from "./Sidebar";
import Timer from "./Timer";

export default function SampleSelected({
  prefix,
  topicSlug,
  exerciseSlug,
  initialData,
}: {
  prefix: "" | "review";
  topicSlug: string;
  exerciseSlug: string;
  initialData?: Exercise | null;
}) {
  const [isTimerRunning, setTimerRunning] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState<ExerciseSummary[]>(
    initialData ? [initialData as ExerciseSummary] : [],
  );
  const [buttonText, setCopyButtonText] = useState("Copy");
  const [indicatorColour, setIndicatorColour] = useState("rgba(255, 255, 255)");

  const [textInput, setTextInput] = useState(initialData?.text ?? "");
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [practiceLinks, setPracticeLinks] = useState(
    initialData?.practiceLinks ?? [],
  );
  const [contributors, setContributors] = useState<string[]>(
    initialData?.contributors ?? [],
  );
  useEffect(() => {
    if (initialData) {
      // Server already fetched this via SSR — sync state from it (covers
      // client-side navigation between exercises, where props change but
      // this component instance stays mounted) and warm IndexedDB from it
      // instead of re-fetching the same data over the network.
      setData([initialData as ExerciseSummary]);
      setTitle(initialData.title);
      setTextInput(initialData.text);
      setCategory(initialData.category ?? "");
      setPracticeLinks(initialData.practiceLinks ?? []);
      setContributors(initialData.contributors ?? []);
      exercise.warmCache(initialData, prefix);
      return;
    }

    const getExercise = async () => {
      const data =
        prefix === "review"
          ? await exercise.getInactive(exerciseSlug)
          : await exercise.getActive(exerciseSlug);
      if (!data) {
        // TODO: show 404
      }

      const summary = data as ExerciseSummary;
      setData([summary]);
      setTitle(data.title);
      setTextInput(data.text);
      setCategory(data.category ?? "");
      setPracticeLinks(data.practiceLinks ?? []);
      if (data.contributors) {
        setContributors(data.contributors);
      }
    };

    getExercise();
  }, [exerciseSlug, prefix, initialData]);

  const handleCopyButtonClick: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    navigator.clipboard.writeText(inputValue).then(null);
    setCopyButtonText("Copied");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);
    const inputPos = newInputValue.length;

    if (!isTimerRunning && newInputValue.length) {
      // Start the timer when input begins
      setTimerRunning(true);
    }

    // Test equality of input and text to be entered
    if (newInputValue === textInput.slice(0, inputPos)) {
      setIndicatorColour("rgba(255, 255, 255)");
    } else {
      setIndicatorColour("rgba(245, 32, 32, 0.8)");
    }

    // Change the background color when input is complete
    if (
      textInput.length === newInputValue.length &&
      newInputValue === textInput.slice(0, inputPos)
    ) {
      setIndicatorColour("rgba(32, 245, 32, 0.8)");
      setTimerRunning(false);
    }

    return;
  };

  const renderChallengeText = () => {
    if (!textInput) {
      return null;
    }

    const inputPos = inputValue.length;

    if (inputPos >= textInput.length) {
      return textInput;
    }

    const beforeInput = textInput.slice(0, inputPos);
    const currentInput = textInput[inputPos];
    const afterInput = textInput.slice(inputPos + 1);

    return (
      <>
        {beforeInput}
        <strong style={{ borderBottom: "3px double red", fontSize: "18px" }}>
          {currentInput}
        </strong>
        {afterInput}
      </>
    );
  };

  return (
    <>
      <Sidebar
        data={data}
        prefix={prefix}
        slug={topicSlug}
        contributors={contributors}
        sampleSelected={true}
      ></Sidebar>
      <div
        className="lg:basis-4/5 flex flex-col justify-between bg-slate-100 lg:max-2xl:rounded-r-lg max-lg:rounded-b-lg py-3"
        style={{ height: "85vh" }}
      >
        <section
          className="w-full font-mono font-semibold"
          style={{ height: "90%" }}
        >
          <section
            className="flex h-8 justify-between items-center py-1 px-4 bg-white"
            style={{
              border: "1px solid " + indicatorColour,
            }}
          >
            <h1 id="title" className="m-0 text-base font-semibold">
              {title}
              {(topicSlug || category) && (
                <span className="ml-2 text-xs font-normal text-gray-500">
                  {[topicSlug, category].filter(Boolean).join(" · ")}
                </span>
              )}
            </h1>
            <Timer isTyping={isTimerRunning}></Timer>
          </section>
          {practiceLinks.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 py-1 bg-white text-xs">
              {practiceLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-slate-600 hover:text-slate-900"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
          <pre className="p-2 max-h-full overflow-scroll">
            <code
              className="pb-10 text-start select-none text-gray-700"
              id="challenge"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {renderChallengeText()}
            </code>
          </pre>
        </section>
        <section
          className="flex justify-center w-full bg-white py-2 px-4"
          style={{
            height: "10%",
            backgroundColor: indicatorColour,
          }}
        >
          <textarea
            className="basis-11/12 rounded-l-lg border-dashed border-2 px-2 py-2 text-start"
            placeholder="Start typing..."
            value={inputValue}
            onChange={handleInputChange}
            onPaste={(e) => e.preventDefault()}
            autoFocus={true}
          ></textarea>
          <button
            className="basis-1/12 bg-slate-800 rounded-r-lg text-white"
            onClick={handleCopyButtonClick}
          >
            {buttonText}
          </button>
        </section>
      </div>
    </>
  );
}
