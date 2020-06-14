const express = require("express");
const got = require("got");
const { formatLanguages, getUserDetails } = require("./src/helpers");

const app = express();
const PORT = 8080;
const HOST = "0.0.0.0";

app.get("/", (req, res) => res.send(`Please check the READ.me file`));

app.get("/get-users", async (req, res) => {
  const { username, language } = req.query;
  const formatedLanguage = formatLanguages(language);
  try {
    const response = await got(
      `https://api.github.com/search/users?q=${username}+in:login${formatedLanguage}`
    );
    const { body } = response;
    if (!body || body.length === 0) {
      res
        .status(200)
        .send(`No Github user with the programming language ${language}`);
    }
    const rest = JSON.parse(body);
    const formatted = getUserDetails(
      rest.items,
      `https://api.github.com/users`
    );

    return Promise.all(formatted)
      .then((final) => res.status(200).send(final))
      .catch((_) => res.status(403).send("Rate Limit Exceeded"));
  } catch (error) {
    if (error.name === "HTTPError") {
      res.status(403).send("Rate limit exceeded");
      res.status(500).send("Internal Server Error");
    } else {
      throw error;
    }
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});
