const formatLanguages = (languageInput = "") => {
  const languageArray = languageInput.split(",");
  return languageArray.map((item) => `language:"${item}"`);
};

module.exports = { formatLanguages };
