const path = require("path");
const app = require("express")();

const pathToIndex = path.join(__dirname, "../client/index.html");

app.use("/*", function (req, res) {
  //Transfers the file at the given path.
  res.sendFile(pathToIndex);
});

module.exports = app;
