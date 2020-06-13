const express = require("express");
const got = require("got");
const app = express();

app.get("/get-users", async (req, res) => {
  const { username, language } = req.query;
  const { body } = await got(
    `https://api.github.com/search/users?q=${username}+in:login+language:${language}`
  );
  const rest = JSON.parse(body);
  const formatted = rest.items.map(({ login, avatar_url }) => {
    return got(`https://api.github.com/users/${login}`).then((user) => {
      const { followers, name } = JSON.parse(user.body);
      return { name, followers, avatar_url, username: login };
    });
  });
  const final = await Promise.all(formatted);
  res.status(200).send(final);
});
const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || "127.0.0.1";
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
