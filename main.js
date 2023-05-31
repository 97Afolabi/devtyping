const content = document.querySelector("#content");
const technologies = document.querySelector("#technologies");
const ct = document.querySelector("#ct");
const playground = document.querySelector("#playground");
const challenge = document.querySelector("#challenge");
const input = document.querySelector("#touch-typing textarea"); //value of user's input
const show = document.querySelector("#show");
const indicators = document.querySelectorAll(".indicator");
const samplesMenu = document.querySelector("#samples");
const contributor = document.querySelector("#contributor > a");
const samplesTitle = document.querySelector("#sample-title");
const languageSamples = document.querySelector("#sidebar > ul");

let textInput;

async function fetchLanguages() {
  // hide sidebar
  samplesMenu.style.display = "none";
  content.style.margin = "50px";

  playground.style.display = "none";
  input.value = "";

  try {
    const response = await fetch("./languages/index.json");
    const data = await response.json();
    renderLanguages(data.list);
  } catch (error) {
    console.log(error);
  }
}
document.addEventListener("load", fetchLanguages());

function renderLanguages(data) {
  const noteClasses = [
    "",
    "note-personal",
    "note-fav",
    "note-work",
    "note-social",
    "note-important",
  ];
  let cursor = 0;
  data.map((language) => {
    let index = cursor < noteClasses.length ? cursor++ : 0;
    const { name, src, description } = language;
    const langBox = document.createElement("div");
    langBox.className = `note-item all-notes ${noteClasses[index]}`;
    langBox.innerHTML = `
      <div class="note-inner-content">
          <div class="note-content">
              <p class="note-title">${name}</p>
              <div class="note-description-content">
                  <p class="note-description">${description}</p>
              </div>
          </div>
          <div class="note-footer">
              <button class="start btn btn-dark mb-4 mr-2" onclick='fetchSamples("${src}")'>Start</button>
          </div>
      </div>
    `;
    return ct.appendChild(langBox);
  });
}

async function fetchSamples(file) {
  try {
    const response = await fetch(`./languages/${file}`);
    const data = await response.json();
    renderSample(data.samples);
  } catch (error) {
    console.log(error);
  }
}

function renderSample(samples) {
  samplesMenu.style.display = "block";
  content.style.marginLeft = "212px";

  technologies.style.display = "none";
  playground.style.display = "grid";
  input.style.display = "block";

  samples.map((sample, index) => {
    const { title, contributor, text } = sample;

    const sampleList = document.createElement("li");
    sampleList.className = "menu samples";

    const challenge = document.createElement("a");
    challenge.className = "dropdown-toggle";
    challenge.onclick = function () {
      samplesTitle.innerText = title;
      input.autofocus = true;

      setChallenge(text);
      setContributor(contributor);
    };
    challenge.innerHTML = `
      <div class="">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" class="feather feather-terminal">
              <polyline points="4 17 10 11 4 5"></polyline>
              <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>
          <span>${title}</span>
      </div>
    `;
    sampleList.appendChild(challenge);
    return languageSamples.appendChild(sampleList);
  });

  input.addEventListener("paste", (e) => e.preventDefault());

  input.addEventListener("keyup", function () {
    const inputPos = input.value.length ?? 0; //length of user's input

    //test equality of input and text to be entered
    input.value === textInput.slice(0, inputPos)
      ? setIndicatorColour("rgba(32,32, 245, 0.8)")
      : setIndicatorColour("rgba(245,32,32, 0.8)");

    //change the background colour when input is complete
    textInput.length == input.value.length &&
    input.value === textInput.slice(0, inputPos)
      ? setIndicatorColour("rgba(32, 245,32, 0.8)")
      : "";

    update(textInput, inputPos);
  });
}

const update = (textInput, inputPos) => {
  const pre = document.createElement("pre");

  pre.innerHTML =
    textInput
      .slice(0, inputPos)
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replaceAll(/\n/g, "<br>")
      .replaceAll(/\s/g, "&nbsp;") +
    `<u>` +
    textInput[inputPos]
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/, "<br>")
      .replace(/\s/, "&nbsp;") +
    `</u>` +
    textInput
      .slice(inputPos + 1)
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replaceAll(/\n/g, "<br>")
      .replaceAll(/\s/g, "&nbsp;");

  challenge.innerHTML = pre.innerHTML;
};

function setIndicatorColour(colour) {
  indicators.forEach((indicator) => {
    indicator.style.backgroundColor = colour;
  });
}

function setContributor(name) {
  contributor.href = "https://github.com/" + name;
  contributor.innerText = name;
}

function setChallenge(text) {
  input.value = "";
  input.focus();

  textInput = text;
  challenge.innerHTML = text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replaceAll(/\n/g, "<br>")
    .replaceAll(/\s/g, "&nbsp;");
}
