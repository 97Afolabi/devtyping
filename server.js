const express = require("express");
const path = require("path");

const app = express();
// app.use(express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  console(__dirname + "/public/index.html");
  res.render(__dirname + "/public/index.html");
});

app.get("/parser", (req, res) => {
  console.log(__dirname + "/public/parser.html");
  res.sendFile(__dirname + "/public/parser.html");
});

app.get("/format", (req, res) => {
  // res.send("format input");
  const out = res.json({
    hello: `
    we sometimes
    do not know
    where the
    hailing seas
    of times

    violently

    carries us

    to
  `,
  });

  console.log(out);
});

// app.get("/languages/:language", (req, res) => {
//   res.json(req.params.language);
// });

app.listen(5919, () => {
  console.log("DevTyp.i.ng running on port 5919");
  // console.log(__dirname + "/assets");
  //   console.log(path.join(__dirname, "public"));
});
