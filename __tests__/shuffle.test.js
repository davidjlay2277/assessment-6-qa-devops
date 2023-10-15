const shuffle = require("../src/shuffle");
const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

describe("shuffle should...", () => {
  it("return an array", () => {
    const shuffledArray1 = shuffle(testArray);
    expect(Array.isArray(shuffledArray1)).toBe(true);
  });
  it("contain all the original elements", () => {
    const shuffledArray2 = shuffle(testArray);
    testArray.forEach((e) => {
      expect(shuffledArray2).toContain(e);
    });
  });
});
