const got = require("got");
const baseUrl = "https://api.github.com";
const timeout = 20000;

const formatLanguages = (languageInput = "") => {
  const languageArray = languageInput.split(",");
  return languageArray.map((item) => `language:"${item}"`);
};

const fetcher = (url) =>
  got(url, { timeout })
    .then((res) => JSON.parse(res.body))
    .catch((e) => {
      if (e.name === "TimeoutError") return "Timeout";
      throw e;
    });

const getUserDetails = (arrayOfUsers, userUrl) =>
  arrayOfUsers.map(({ login, avatar_url }) =>
    fetcher(`${userUrl}/${login}`).then(({ followers, name }) => ({
      name,
      followers,
      avatar_url,
      username: login,
    }))
  );

const getUser = async (req, res) => {
  const { username, language } = req.query;
  const formatedLanguages = formatLanguages(language);
  let searchResults;
  try {
    for (const formatedLanguage of formatedLanguages) {
      const response = await fetcher(
        `${baseUrl}/search/users?q=${username}+in:login+${formatedLanguage}`
      );
      if (response === "Timeout") {
        continue;
      }
      if (response.items.length) {
        searchResults = response.items;
        break;
      }
    }
    if (!searchResults.length) {
      res
        .status(200)
        .send(`No Github user with the programming language ${language}`);
      return;
    }
    const userDetailsPromises = getUserDetails(
      searchResults,
      `${baseUrl}/users`
    );

    const final = await Promise.all(userDetailsPromises);
    res.status(200).send(final);
  } catch (error) {
    if (error.status === 403) {
      res.status(400).send("Rate Limit Exceeded, Try Again later");
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
};

module.exports = { formatLanguages, getUserDetails, getUser, fetcher };
