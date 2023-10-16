"use client";
import { useEffect, useState } from "react";
import { replaceHTMLChar } from "../../lib/constants/strings";
import { exercise } from "../../lib/data/data";
import Sidebar from "./Sidebar";
import Timer from "./Timer";

export default function SampleSelected({
  topicSlug,
  exerciseSlug,
}: {
  topicSlug: string;
  exerciseSlug: string;
}) {
  const [isTimerRunning, setTimerRunning] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [buttonText, setCopyButtonText] = useState("Copy");
  const [indicatorColour, setIndicatorColour] = useState("rgba(255, 255, 255)");
  const [challengeContent, setChallengeContent] = useState("");

  const [textInput, setTextInput] = useState("");
  const [title, setTitle] = useState("");
  const [contributors, setContributors] = useState<string[]>([]);
  useEffect(() => {
    const getExercise = async () => {
      const data = await exercise.get(exerciseSlug);
      if (!data) {
        // TODO: show 404
      }
      handleTitleUpdate(data.title);
      handleTextInputUpdate(data.text);
      setChallengeContent(replaceHTMLChar(data.text));
      if (data.contributors) {
        handleContributorsUpdate(data.contributors);
      }
    };

    getExercise();
  }, [exerciseSlug]);

  const handleTextInputUpdate = (text: string) => {
    setTextInput(text);
  };
  const handleTitleUpdate = (text: string) => {
    setTitle(text);
  };
  const handleContributorsUpdate = (contributors: string[]) => {
    setContributors(contributors);
  };

  const handleCopyButtonClick: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
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
    <section className="flex flex-col lg:flex-row w-full h-5/6 py-5 px-2 md:px-10 gap-3">
      <Sidebar
        data={[]}
        slug={topicSlug}
        contributors={contributors}
        sampleSelected={true}
      ></Sidebar>
      <div className="basis-4/5 flex flex-col justify-between bg-slate-100 lg:max-2xl:rounded-r-lg max-lg:rounded-b-lg overflow-scroll py-3">
        <section className="w-full font-mono font-semibold">
          <section
            className="flex h-8 justify-between py-1 px-4 bg-white"
            style={{
              border: "1px solid " + indicatorColour,
            }}
          >
            <div id="title">{title}</div>
            <Timer isTyping={isTimerRunning}></Timer>
          </section>
          <pre className="p-2">
            <code
              className="text-start text-gray-700"
              id="challenge"
              dangerouslySetInnerHTML={{ __html: challengeContent }}
              style={{ whiteSpace: "pre-wrap" }}
            ></code>
          </pre>
        </section>
        <section
          className="flex justify-center w-full bg-white py-2 px-4"
          style={{
            backgroundColor: indicatorColour,
          }}
        >
          <textarea
            className="basis-11/12 rounded-l-lg border-dashed border-2 px-2 py-2 text-start"
            placeholder="Start typing..."
            value={inputValue}
            onChange={handleInputChange}
            onPaste={(e) => e.preventDefault()}
          ></textarea>
          <button
            className="basis-1/12 bg-slate-800 rounded-r-lg text-white"
            onClick={handleCopyButtonClick}
          >
            {buttonText}
          </button>
        </section>
      </div>
    </section>
  );
}
