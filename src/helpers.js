const got = require("got");

const formatLanguages = (languageInput) => {
  const languageArray = languageInput.split(",");
  let formatLanguage = "";
  for (let i = 0; i < languageArray.length; i++) {
    formatLanguage += `+language:"${languageArray[i]}"`;
  }
  return formatLanguage;
};
const getUserDetails = (arrayOfUsers, userUrl) => {
  return arrayOfUsers.map(({ login, avatar_url }) => {
    return got(`${userUrl}/${login}`).then((user) => {
      const { followers, name } = JSON.parse(user.body);
      return { name, followers, avatar_url, username: login };
    });
  });
};

module.exports = { formatLanguages, getUserDetails };
