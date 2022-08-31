async function fetchLanguages() {
  try {
    const response = await fetch("../languages/index.json");
    const data = await response.json();
    renderLanguages(data.list);
  } catch (error) {
    console.log(error);
  }
}
document.addEventListener("load", fetchLanguages());

function renderLanguages(data) {
  const languages = document.querySelector("#languages");

  data.map((language) => {
    const { name, src, description } = language;
    const langBox = document.createElement("div");
    langBox.innerHTML = `<b>${name}</b><p>${description}</p><button type='submit' onclick='fetchSamples("${src}")'>Take test</button>`;
    return languages.appendChild(langBox);
  });
}

async function fetchSamples(file) {
  try {
    const response = await fetch(`../languages/${file}`);
    const data = await response.json();
    // console.log(data.samples);
    renderSample(data.samples);
  } catch (error) {
    console.log(error);
  }
}

function renderSample(sample) {
  var text = (document.querySelector("#text").innerText = sample[3]);
  // firstProgram.toString()); // text to be typed converted to string
  var input1 = document.querySelector("#input1"); //value of user's input
  var show = document.querySelector("#show");

  input1.addEventListener("keyup", function () {
    function colourRed() {
      document.body.style.backgroundColor = "rgba(245,32,32, 0.8)";
    }

    function colourBlue() {
      document.body.style.backgroundColor = "rgba(32,32, 245, 0.8)";
    }

    var inputPos = input1.value.length; //length of user's input
    if (inputPos == 0) document.body.style.backgroundColor = "#ffffff";
    //test equality of input and text to be entered
    input1.value === text.slice(0, inputPos) ? colourBlue() : colourRed();
    //show.innerHTML = "Incorrectly typed:" +
    //change the background colour when input is complete
    text.length == input1.value.length &&
    input1.value === text.slice(0, inputPos)
      ? (document.body.style.backgroundColor = "rgba(32, 245,32, 0.8)")
      : "";

    show.innerHTML =
      "Characters: " +
      text.charAt(inputPos - 1) +
      "&nbsp;" +
      text.charAt(inputPos) +
      "&nbsp;" +
      text.charAt(inputPos + 1) +
      "&nbsp;" +
      text.charAt(inputPos + 2) +
      "&nbsp;" +
      text.charAt(inputPos + 3) +
      "&nbsp;" +
      text.charAt(inputPos + 4);
  });
}
