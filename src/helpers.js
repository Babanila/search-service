const formatLanguages = (languageInput) => {
  const languageArray = languageInput.split(",");
  let formatLanguage = "";
  for (let i = 0; i < languageArray.length; i++) {
    formatLanguage += `+language:"${languageArray[i]}"`;
  }
  return formatLanguage;
};

module.exports = { formatLanguages };
