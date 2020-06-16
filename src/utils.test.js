const { formatLanguages } = require("./utils");

describe("Check formatLanguages", () => {
  it("should output a single language", () => {
    const languages = "javascript";
    expect(formatLanguages).toBeDefined();
    expect(formatLanguages(languages)).toEqual([`language:"javascript"`]);
  });
  it("should output multiple languages", () => {
    const languages = "java,javascript";
    expect(formatLanguages).toBeDefined();
    expect(formatLanguages(languages)).toEqual([
      `language:"java"`,
      `language:"javascript"`,
    ]);
  });
});
