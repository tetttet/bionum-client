/* eslint-env node */
const assert = require("node:assert/strict");
const test = require("node:test");

require("sucrase/register/ts");

const {
  calculateNameNumber,
  detectNameLanguage,
} = require("../data/name/nameNumber.ts");

const letterValues = (result) => result.letters.map((letter) => letter.value);

test("calculates Russian name number for Айгуль", () => {
  const result = calculateNameNumber("Айгуль", "ru");

  assert.deepEqual(letterValues(result), [1, 2, 4, 3, 4, 3]);
  assert.equal(result.rawSum, 17);
  assert.deepEqual(result.steps, [17, 8]);
  assert.equal(result.reduced, 8);
});

test("calculates English name number for Aigul", () => {
  const result = calculateNameNumber("Aigul", "en");

  assert.deepEqual(letterValues(result), [1, 9, 7, 3, 3]);
  assert.equal(result.rawSum, 23);
  assert.deepEqual(result.steps, [23, 5]);
  assert.equal(result.reduced, 5);
});

test("calculates Kazakh name number for Айгүл", () => {
  const result = calculateNameNumber("Айгүл", "kz");

  assert.deepEqual(letterValues(result), [1, 4, 5, 1, 7]);
  assert.equal(result.rawSum, 18);
  assert.deepEqual(result.steps, [18, 9]);
  assert.equal(result.reduced, 9);
});

test("calculates Turkish name number for Çağla", () => {
  const result = calculateNameNumber("Çağla", "tr");

  assert.deepEqual(letterValues(result), [4, 1, 9, 6, 1]);
  assert.equal(result.rawSum, 21);
  assert.deepEqual(result.steps, [21, 3]);
  assert.equal(result.reduced, 3);
});

test("ignores hyphens and spaces", () => {
  const compact = calculateNameNumber("AnneMarie", "en");
  const hyphenated = calculateNameNumber("Anne-Marie", "en");
  const spaced = calculateNameNumber("Anne Marie", "en");

  assert.equal(hyphenated.rawSum, compact.rawSum);
  assert.equal(spaced.rawSum, compact.rawSum);
  assert.equal(hyphenated.reduced, compact.reduced);
  assert.equal(spaced.reduced, compact.reduced);
});

test("keeps 11 as a master number", () => {
  const result = calculateNameNumber("IJA", "en");

  assert.equal(result.rawSum, 11);
  assert.deepEqual(result.steps, [11]);
  assert.equal(result.reduced, 11);
  assert.equal(result.isMasterNumber, true);
});

test("keeps 22 as a master number", () => {
  const result = calculateNameNumber("IRBB", "en");

  assert.equal(result.rawSum, 22);
  assert.deepEqual(result.steps, [22]);
  assert.equal(result.reduced, 22);
  assert.equal(result.isMasterNumber, true);
});

test("handles mixed uppercase and lowercase letters", () => {
  const result = calculateNameNumber("aIgUl", "en");

  assert.equal(result.rawSum, 23);
  assert.equal(result.reduced, 5);
});

test("uses the corrected Turkish letter values, including Ş", () => {
  const result = calculateNameNumber("ŞTÜVYZ", "tr");

  assert.deepEqual(letterValues(result), [4, 5, 7, 8, 9, 1]);
});

test("detects languages with special Kazakh and Turkish letters", () => {
  assert.equal(detectNameLanguage("Айгүл"), "kz");
  assert.equal(detectNameLanguage("Çağla"), "tr");
});
