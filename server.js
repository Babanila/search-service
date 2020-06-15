const got = require("got");
const express = require("express");
const createController = require("./src/controller");
const { formatLanguages } = require("./src/utils");

const app = express();
const PORT = 8080;
const HOST = "0.0.0.0";
const baseUrl = "https://api.github.com";
const timeout = 20000;

const { getUsers } = createController(got, formatLanguages, baseUrl, timeout);

app.get("/", (req, res) => res.send(`Please check the README file`));
app.get("/get-users", getUsers);

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});
