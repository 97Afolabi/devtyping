"use client";
import { useEffect, useState } from "react";
import { replaceHTMLChar } from "../../lib/constants/strings";
import { ExerciseSummary } from "../../lib/interfaces/Exercise";
import { exercise } from "../../lib/data/data";
import Sidebar from "./Sidebar";
import Timer from "./Timer";

export default function SampleSelected({
  prefix,
  topicSlug,
  exerciseSlug,
}: {
  prefix: "" | "review";
  topicSlug: string;
  exerciseSlug: string;
}) {
  const [isTimerRunning, setTimerRunning] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState<ExerciseSummary[]>([]);
  const [buttonText, setCopyButtonText] = useState("Copy");
  const [indicatorColour, setIndicatorColour] = useState("rgba(255, 255, 255)");
  const [challengeContent, setChallengeContent] = useState("");

  const [textInput, setTextInput] = useState("");
  const [title, setTitle] = useState("");
  const [contributors, setContributors] = useState<string[]>([]);
  useEffect(() => {
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
      setChallengeContent(replaceHTMLChar(data.text));
      if (data.contributors) {
        setContributors(data.contributors);
      }
    };

    getExercise();
  }, [exerciseSlug, prefix]);

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

    if (inputPos < textInput.length) {
      update(textInput, inputPos);
    }
  };

  const update = (textInput: string, inputPos: number) => {
    const beforeInput = replaceHTMLChar(textInput.slice(0, inputPos));
    const afterInput = replaceHTMLChar(textInput.slice(inputPos + 1));

    const updatedContent = `${beforeInput}<strong style="border-bottom: 3px double red; font-size: 18px;">${replaceHTMLChar(
      textInput[inputPos]
    )}</strong>${afterInput}`;

    setChallengeContent(updatedContent);
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
            className="flex h-8 justify-between py-1 px-4 bg-white"
            style={{
              border: "1px solid " + indicatorColour,
            }}
          >
            <div id="title">{title}</div>
            <Timer isTyping={isTimerRunning}></Timer>
          </section>
          <pre className="p-2 max-h-full overflow-scroll">
            <code
              className="pb-10 text-start select-none text-gray-700"
              id="challenge"
              dangerouslySetInnerHTML={{ __html: challengeContent }}
              style={{ whiteSpace: "pre-wrap" }}
            ></code>
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
