const express = require("express");

const app = express();
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.render(__dirname + "/index.html");
});

app.get("/formatter", (req, res) => {
  res.sendFile(__dirname + "/formatter.html");
});

app.listen(5919, () => {
  console.log("DevTyp.i.ng running on port 5919");
});
