const express = require("express");
const { getUser } = require("./src/helpers");

const app = express();
const PORT = 8080;
const HOST = "0.0.0.0";

app.get("/", (req, res) => res.send(`Please check the README file`));
app.get("/get-users", getUser);

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});
