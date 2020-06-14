const express = require("express");
const got = require("got");
const app = express();

app.get("/get-users", async (req, res) => {
  const { username, language } = req.query;
  //   console.log("language", language);
  const response = await got(
    `https://api.github.com/search/users?q=${username}+in:login+language:${language}`
  );

  console.log(response);
  //   if (!body) return [];

  const { body } = response;
  const rest = JSON.parse(body);
  const formatted = rest.items
    .map(({ login, avatar_url }) => {
      return got(`https://api.github.com/users/${login}`).then((user) => {
        const { followers, name } = JSON.parse(user.body);
        return { name, followers, avatar_url, username: login };
      });
    })
    .catch((e) => {
      console.log("e", e);

      throw e;
    });
  const final = await Promise.all(formatted);
  res.status(200).send(final);
});
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});
