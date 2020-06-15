const PromiseMap = require("p-map");

module.exports = function createController(
  fetch,
  formatLanguages,
  baseUrl,
  timeout
) {
  const fetcher = (url, timeout) => {
    return fetch(url, { timeout })
      .then((res) => JSON.parse(res.body))
      .catch((e) => {
        if (e.name === "TimeoutError") return "Timeout";
        throw e;
      });
  };

  const getUsers = async (req, res) => {
    const { username, language } = req.query;
    const formatedLanguages = formatLanguages(language);
    let searchResults;
    try {
      for (const formatedLanguage of formatedLanguages) {
        const response = await fetcher(
          `${baseUrl}/search/users?q=${username}+in:login+${formatedLanguage}`,
          timeout
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

      const userDetails = await PromiseMap(
        searchResults.slice(0, 4),
        async ({ login, avatar_url }) => {
          const { followers, name } = await fetcher(
            `${baseUrl}/users/${login}`,
            timeout
          );
          return {
            name,
            followers,
            avatar_url,
            username: login,
          };
        },
        { concurrency: 5 }
      );

      res.status(200).send(userDetails);
    } catch (error) {
      if (error.status === 403) {
        res.status(400).send("Rate Limit Exceeded, Try Again later");
      } else {
        res.status(500).send("Internal Server Error");
      }
    }
  };

  return { getUsers };
};
