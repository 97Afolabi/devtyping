const technologies = document.querySelector("#technologies");
const playground = document.querySelector("#playground");
const challenge = document.querySelector("#challenge");
const input = document.querySelector("#touch-typing textarea"); //value of user's input
const show = document.querySelector("#show");
const indicator = document.querySelector("#indicator");
const samplesMenu = document.querySelector("#samples");
const contributor = document.querySelector("#contributor > a");

async function fetchLanguages() {
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
  data.map((language) => {
    const { name, src, description } = language;
    const langBox = document.createElement("div");
    langBox.className = "technologies";
    langBox.innerHTML = `
      <h3 class="technology">${name}</h3>
      <div class="icon">${name}</div>
      <p class="description">${description}</p>
      <button type='submit' class="start" onclick='fetchSamples("${src}")'>Start</button>
    `;
    return technologies.appendChild(langBox);
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
  technologies.style.display = "none";
  playground.style.display = "grid";
  input.style.display = "block";

  samples.map((sample, index) => {
    const { title, contributor, text } = sample;
    const sampleButton = document.createElement("button");
    sampleButton.type = "button";
    // sampleButton.id = "sample-" + index;
    sampleButton.className = "samples";
    sampleButton.onclick = function () {
      setChallenge(text);
      setContributor(contributor);
    };
    sampleButton.innerText = title;
    return samplesMenu.appendChild(sampleButton);
  });

  input.addEventListener("keyup", function () {
    //   function colourRed() {
    //     document.body.style.backgroundColor = "rgba(245,32,32, 0.8)";
    //   }

    //   function colourBlue() {
    //     document.body.style.backgroundColor = "rgba(32,32, 245, 0.8)";
    //   }

    let inputPos = input.value.length; //length of user's input
    //   if (inputPos == 0) document.body.style.backgroundColor = "#ffffff";
    //   //test equality of input and text to be entered
    input.value === challenge.innerText.slice(0, inputPos)
      ? setIndicatorColour("rgba(32,32, 245, 0.8)")
      : setIndicatorColour("rgba(245,32,32, 0.8)");
    //   //show.innerHTML = "Incorrectly typed:" +
    //   //change the background colour when input is complete
    challenge.innerText.length == input.value.length &&
    input.value === challenge.innerText.slice(0, inputPos)
      ? setIndicatorColour("rgba(32, 245,32, 0.8)")
      : "";
  });
}

function setIndicatorColour(colour) {
  indicator.style.backgroundColor = colour;
}

function setContributor(name) {
  contributor.href = "https://github.com/" + name;
  contributor.innerText = name;
}

function setChallenge(text) {
  challenge.innerText = text;
}

function nextCharacters() {
  //   show.innerHTML =
  //     "Characters: " +
  //     text.charAt(inputPos - 1) +
  //     "&nbsp;" +
  //     text.charAt(inputPos) +
  //     "&nbsp;" +
  //     text.charAt(inputPos + 1) +
  //     "&nbsp;" +
  //     text.charAt(inputPos + 2) +
  //     "&nbsp;" +
  //     text.charAt(inputPos + 3) +
  //     "&nbsp;" +
  //     text.charAt(inputPos + 4);
  // });
}
