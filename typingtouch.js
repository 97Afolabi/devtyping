var firstProgram =
  "<!DOCTYPE html>\n<html lang='en-US'>\n\n<head>\n  <title>My First Web Page!</title>\n</head>\n\n<body>\n\n<h1>My First Web Page!</h1>\n<p>Hello World. I'm happy to be here!</p>\n\n</body>\n\n</html>\n";

var text = (document.querySelector("#text").innerHTML =
  firstProgram.toString()); // text to be typed converted to string
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
  text.length == input1.value.length && input1.value === text.slice(0, inputPos)
    ? (document.body.style.backgroundColor = "rgba(32, 245,32, 0.8)")
    : "";

  /* function to print next characters
    function nextc() {
        for(var pos = 1; pos < inputPos; pos++) {
        show.innerHTML += text.charAt(inputPos + pos) + "&nbsp;";
        }
    }
    */

  //print current character
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
