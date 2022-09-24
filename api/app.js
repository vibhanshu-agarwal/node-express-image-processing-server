const path = require("path");
const express = require("express");
const app = express();
const router = require("./src/router");


const pathToIndex = path.join(__dirname, "../client/index.html");

app.use("/" , router);

app.use(express.static(path.resolve(__dirname, 'uploads')));

app.use("/*", function (req, res) {
    //Transfers the file at the given path.
    res.sendFile(pathToIndex);
});

module.exports = app;