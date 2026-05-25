/* eslint-env node */
const assert = require("node:assert/strict");
const Module = require("node:module");
const path = require("node:path");
const test = require("node:test");

const projectRoot = path.resolve(__dirname, "..");
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveWithProjectAliases(
  request,
  parent,
  isMain,
  options,
) {
  if (request.startsWith("@/")) {
    return originalResolveFilename.call(
      this,
      path.join(projectRoot, request.slice(2)),
      parent,
      isMain,
      options,
    );
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};

require("sucrase/register/ts");

const { calculatePsychomatrix } = require("../data/psycho/psychomatrixCore.ts");

const expected1978Matrix = {
  1: "11",
  2: "2",
  3: "333",
  4: "4",
  5: "-",
  6: "6",
  7: "77",
  8: "8",
  9: "9",
};

const expected2006Matrix = {
  1: "1111",
  2: "2",
  3: "3",
  4: "4",
  5: "55",
  6: "66",
  7: "7",
  8: "-",
  9: "9",
};

test("calculates psychomatrix for dates before 01.01.2000", () => {
  const result = calculatePsychomatrix("21.06.1978");

  assert.equal(result.baseDigits, "2161978");
  assert.equal(result.primarySum, 34);
  assert.equal(result.secondarySum, 7);
  assert.equal(result.intermediate, 4);
  assert.equal(result.thirdNumber, 30);
  assert.equal(result.fourthNumber, 3);
  assert.equal(result.digitsForMatrix, "2161978347303");
  assert.deepEqual(result.matrix, expected1978Matrix);
});

test("calculates psychomatrix for dates from 01.01.2000 with constant 19", () => {
  const result = calculatePsychomatrix("15.01.2006");

  assert.equal(result.baseDigits, "15126");
  assert.equal(result.baseSum, 15);
  assert.equal(result.constant, 19);
  assert.equal(result.primarySum, 15);
  assert.equal(result.secondarySum, 6);
  assert.equal(result.thirdNumber, 34);
  assert.equal(result.fourthNumber, 7);
  assert.equal(result.sum1, 15);
  assert.equal(result.sum2, 6);
  assert.equal(result.sum3, 34);
  assert.equal(result.sum4, 7);
  assert.equal(result.digitsForMatrix, "1512615634719");
  assert.deepEqual(result.matrix, expected2006Matrix);
});

test("treats 01.01.2000 as the 21st-century branch", () => {
  const result = calculatePsychomatrix("01.01.2000");

  assert.equal(result.is21Century, true);
  assert.equal(result.baseDigits, "112");
  assert.equal(result.baseSum, 4);
  assert.equal(result.constant, 19);
  assert.equal(result.primarySum, 4);
  assert.equal(result.secondarySum, 4);
  assert.equal(result.thirdNumber, 23);
  assert.equal(result.fourthNumber, 5);
  assert.equal(result.digitsForMatrix, "1124423519");
  assert.deepEqual(result.matrix, {
    1: "111",
    2: "22",
    3: "3",
    4: "44",
    5: "5",
    6: "-",
    7: "-",
    8: "-",
    9: "9",
  });
});

test("uses the XXI-century formula and includes constant 19 for 03.10.2005", () => {
  const result = calculatePsychomatrix("03.10.2005");

  assert.equal(result.is21Century, true);
  assert.equal(result.baseDigits, "3125");
  assert.equal(result.baseSum, 11);
  assert.equal(result.constant, 19);
  assert.equal(result.primarySum, 11);
  assert.equal(result.secondarySum, 2);
  assert.equal(result.thirdNumber, 30);
  assert.equal(result.fourthNumber, 3);
  assert.equal(result.sum1, 11);
  assert.equal(result.sum2, 2);
  assert.equal(result.sum3, 30);
  assert.equal(result.sum4, 3);
  assert.equal(result.digitsForMatrix, "312511230319");
  assert.deepEqual(result.matrix, {
    1: "1111",
    2: "22",
    3: "333",
    4: "-",
    5: "5",
    6: "-",
    7: "-",
    8: "-",
    9: "9",
  });
});

test("uses the old branch for 31.12.1999", () => {
  const result = calculatePsychomatrix("31.12.1999");

  assert.equal(result.is21Century, false);
  assert.equal(result.baseDigits, "31121999");
  assert.equal(result.primarySum, 35);
  assert.equal(result.secondarySum, 8);
  assert.equal(result.intermediate, 6);
  assert.equal(result.thirdNumber, 29);
  assert.equal(result.fourthNumber, 11);
  assert.equal(result.digitsForMatrix, "311219993582911");
  assert.deepEqual(result.matrix, {
    1: "11111",
    2: "22",
    3: "33",
    4: "-",
    5: "5",
    6: "-",
    7: "-",
    8: "8",
    9: "9999",
  });
});

test("removes zeroes from the base date row but keeps zeroes in extra numbers", () => {
  const result = calculatePsychomatrix("09.07.1980");

  assert.equal(result.baseDigits, "97198");
  assert.equal(result.primarySum, 34);
  assert.equal(result.secondarySum, 7);
  assert.equal(result.intermediate, 18);
  assert.equal(result.thirdNumber, 16);
  assert.equal(result.fourthNumber, 7);
  assert.equal(result.digitsForMatrix, "97198347167");
  assert.deepEqual(result.matrix, {
    1: "11",
    2: "-",
    3: "3",
    4: "4",
    5: "-",
    6: "6",
    7: "777",
    8: "8",
    9: "99",
  });
});

test("parses YYYY-MM-DD without timezone day shifts", () => {
  const result = calculatePsychomatrix("1978-06-21");

  assert.equal(result.birthDate, "21.06.1978");
  assert.equal(result.digitsForMatrix, "2161978347303");
  assert.deepEqual(result.matrix, expected1978Matrix);
});

test("parses ISO strings as calendar dates without Date string parsing", () => {
  const result = calculatePsychomatrix("2006-01-15T00:00:00.000Z");

  assert.equal(result.birthDate, "15.01.2006");
  assert.equal(result.digitsForMatrix, "1512615634719");
  assert.deepEqual(result.matrix, expected2006Matrix);
});

test("supports Date objects from local pickers and UTC-midnight date-only values", () => {
  const localPickerDate = calculatePsychomatrix(new Date(2006, 0, 15));
  const utcMidnightDate = calculatePsychomatrix(new Date(Date.UTC(2006, 0, 15)));

  assert.equal(localPickerDate.birthDate, "15.01.2006");
  assert.equal(localPickerDate.digitsForMatrix, "1512615634719");
  assert.equal(utcMidnightDate.birthDate, "15.01.2006");
  assert.equal(utcMidnightDate.digitsForMatrix, "1512615634719");
});
