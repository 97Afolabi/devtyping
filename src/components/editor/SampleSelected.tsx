"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Exercise, ExerciseSummary } from "../../lib/interfaces/Exercise";
import { exercise } from "../../lib/data/data";
import Sidebar from "./Sidebar";
import Timer from "./Timer";

// Solid colours chosen to meet 3:1 contrast against the white sections they
// sit on (WCAG 1.4.11 non-text contrast).
const NEUTRAL_COLOUR = "#94a3b8"; // slate-400
const ERROR_COLOUR = "#dc2626"; // red-600
const SUCCESS_COLOUR = "#15803d"; // green-700

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
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const keystrokeCountRef = useRef(0);
  const errorCountRef = useRef(0);

  const [isTimerRunning, setTimerRunning] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState<ExerciseSummary[]>(
    initialData ? [initialData as ExerciseSummary] : [],
  );
  const [buttonText, setCopyButtonText] = useState("Copy");
  const [indicatorColour, setIndicatorColour] = useState(NEUTRAL_COLOUR);
  const [resultsMessage, setResultsMessage] = useState("");

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

  useEffect(() => {
    textareaRef.current?.focus();
    setInputValue("");
    setIndicatorColour(NEUTRAL_COLOUR);
    setResultsMessage("");
    setTimerRunning(false);
    startTimeRef.current = null;
    keystrokeCountRef.current = 0;
    errorCountRef.current = 0;
  }, [exerciseSlug]);

  const backHref = prefix ? `/${prefix}/${topicSlug}` : `/${topicSlug}`;

  // WCAG 2.1.2: this typing surface captures every keystroke, so it must
  // offer a way to leave that doesn't rely on the mouse.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      router.push(backHref);
    }
  };

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
      startTimeRef.current = Date.now();
    }

    keystrokeCountRef.current += 1;
    setResultsMessage("");

    const isCorrectSoFar = newInputValue === textInput.slice(0, inputPos);

    // Test equality of input and text to be entered
    if (isCorrectSoFar) {
      setIndicatorColour(NEUTRAL_COLOUR);
    } else {
      setIndicatorColour(ERROR_COLOUR);
      errorCountRef.current += 1;
    }

    // Change the background color when input is complete
    if (textInput.length === newInputValue.length && isCorrectSoFar) {
      setIndicatorColour(SUCCESS_COLOUR);
      setTimerRunning(false);

      const elapsedMinutes = startTimeRef.current
        ? Math.max(Date.now() - startTimeRef.current, 1000) / 60000
        : 1 / 60;
      const wpm = Math.round(textInput.length / 5 / elapsedMinutes);
      const totalKeystrokes = keystrokeCountRef.current;
      const accuracy = Math.round(
        ((totalKeystrokes - errorCountRef.current) / totalKeystrokes) * 100,
      );
      setResultsMessage(
        `Completed. ${wpm} words per minute, ${accuracy}% accuracy.`,
      );
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
        <strong
          style={{
            borderBottom: `3px double ${ERROR_COLOUR}`,
            fontSize: "18px",
          }}
        >
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
          <p className="bg-white text-xs text-gray-600 px-4 py-1">
            Press Esc to exit this exercise.
          </p>
          {practiceLinks.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 py-1 bg-white text-xs">
              {practiceLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-slate-600 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
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
            ref={textareaRef}
            className="basis-11/12 rounded-l-lg border-dashed border-2 px-2 py-2 text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            placeholder="Start typing..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onPaste={(e) => e.preventDefault()}
            aria-label="Type the code shown above"
          ></textarea>
          <button
            className="basis-1/12 bg-slate-800 rounded-r-lg text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            onClick={handleCopyButtonClick}
          >
            {buttonText}
          </button>
        </section>
        <p
          role="status"
          aria-live="polite"
          className="text-center text-sm py-1"
        >
          {resultsMessage}
        </p>
      </div>
    </>
  );
}
