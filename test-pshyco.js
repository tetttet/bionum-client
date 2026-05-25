#!/usr/bin/env node

const readline = require("node:readline");

const COLORS = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  dim: "\x1b[2m",
};

const padDatePart = (value) => String(value).padStart(2, "0");

const getDaysInMonth = (year, month) => {
  return [
    31,
    year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ][month - 1];
};

const isValidDateParts = ({ day, month, year }) => {
  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year)
  ) {
    return false;
  }

  if (year < 1000 || year > 9999) return false;
  if (month < 1 || month > 12) return false;

  return day >= 1 && day <= getDaysInMonth(year, month);
};

const getDigitsFromString = (value) => {
  return value
    .split("")
    .map((digit) => Number.parseInt(digit, 10))
    .filter((digit) => !Number.isNaN(digit));
};

const getNonZeroDigitsFromString = (value) => {
  return getDigitsFromString(value).filter((digit) => digit !== 0);
};

const getNumberDigitString = (num) => {
  return String(Math.abs(num));
};

const sumDigitsOnce = (num) => {
  return getDigitsFromString(getNumberDigitString(num)).reduce(
    (sum, digit) => sum + digit,
    0,
  );
};

const parseBirthDate = (birthDate) => {
  const value = String(birthDate).trim();
  const match = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(value);

  if (!match) {
    throw new Error("Неверный формат даты. Используй DD.MM.YYYY");
  }

  const parts = {
    day: Number.parseInt(match[1], 10),
    month: Number.parseInt(match[2], 10),
    year: Number.parseInt(match[3], 10),
  };

  if (!isValidDateParts(parts)) {
    throw new Error("Дата не существует");
  }

  return parts;
};

const formatBirthDate = ({ day, month, year }) => {
  return `${padDatePart(day)}.${padDatePart(month)}.${year}`;
};

const countDigits = (digitsForMatrix) => {
  const counts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  };

  getDigitsFromString(digitsForMatrix).forEach((digit) => {
    if (digit >= 1 && digit <= 9) {
      counts[digit] += 1;
    }
  });

  return counts;
};

const buildMatrix = (digitsForMatrix) => {
  const counts = countDigits(digitsForMatrix);

  return {
    1: counts[1] > 0 ? "1".repeat(counts[1]) : "-",
    2: counts[2] > 0 ? "2".repeat(counts[2]) : "-",
    3: counts[3] > 0 ? "3".repeat(counts[3]) : "-",
    4: counts[4] > 0 ? "4".repeat(counts[4]) : "-",
    5: counts[5] > 0 ? "5".repeat(counts[5]) : "-",
    6: counts[6] > 0 ? "6".repeat(counts[6]) : "-",
    7: counts[7] > 0 ? "7".repeat(counts[7]) : "-",
    8: counts[8] > 0 ? "8".repeat(counts[8]) : "-",
    9: counts[9] > 0 ? "9".repeat(counts[9]) : "-",
  };
};

const calculatePsychomatrix = (birthDate) => {
  const dateParts = parseBirthDate(birthDate);
  const normalizedBirthDate = formatBirthDate(dateParts);
  const dayStr = padDatePart(dateParts.day);
  const monthStr = padDatePart(dateParts.month);
  const yearStr = String(dateParts.year);
  const fullDateDigits = getDigitsFromString(dayStr + monthStr + yearStr);

  const baseDigits = getNonZeroDigitsFromString(dayStr + monthStr + yearStr)
    .join("");
  const initialDigits = getDigitsFromString(baseDigits);

  if (initialDigits.length === 0) {
    throw new Error("Не удалось получить цифры из даты рождения");
  }

  const is21Century = dateParts.year >= 2000;
  const baseSum = fullDateDigits.reduce((sum, digit) => sum + digit, 0);
  const constant = is21Century ? 19 : null;
  const primarySum = baseSum;
  const secondarySum = sumDigitsOnce(primarySum);

  let intermediate = null;
  let thirdNumber = null;
  let fourthNumber = null;
  const matrixParts = [
    baseDigits,
    getNumberDigitString(primarySum),
    getNumberDigitString(secondarySum),
  ];

  if (is21Century) {
    thirdNumber = primarySum + 19;
    fourthNumber =
      Math.abs(thirdNumber) < 10 ? thirdNumber : sumDigitsOnce(thirdNumber);
    matrixParts.push(
      getNumberDigitString(thirdNumber),
      getNumberDigitString(fourthNumber),
      getNumberDigitString(19),
    );
  } else {
    intermediate = initialDigits[0] * 2;
    thirdNumber = primarySum - intermediate;
    fourthNumber =
      Math.abs(thirdNumber) < 10 ? thirdNumber : sumDigitsOnce(thirdNumber);
    matrixParts.push(
      getNumberDigitString(thirdNumber),
      getNumberDigitString(fourthNumber),
    );
  }

  const digitsForMatrix = matrixParts.join("");
  const counts = countDigits(digitsForMatrix);
  const matrix = buildMatrix(digitsForMatrix);

  return {
    birthDate: normalizedBirthDate,
    is21Century,
    baseDigits,
    baseSum,
    constant,
    primarySum,
    secondarySum,
    intermediate,
    thirdNumber,
    fourthNumber,
    digitsForMatrix,
    counts,
    matrix,
  };
};

const visibleLength = (value) => String(value).replace(/\x1b\[[0-9;]*m/g, "").length;

const padCell = (value, width) => {
  const text = String(value);
  const visible = visibleLength(text);
  return text + " ".repeat(Math.max(width - visible, 0));
};

const renderMatrixTable = (matrix) => {
  const rows = [
    [
      `${COLORS.cyan}1${COLORS.reset}: ${matrix[1]}`,
      `${COLORS.cyan}4${COLORS.reset}: ${matrix[4]}`,
      `${COLORS.cyan}7${COLORS.reset}: ${matrix[7]}`,
    ],
    [
      `${COLORS.cyan}2${COLORS.reset}: ${matrix[2]}`,
      `${COLORS.cyan}5${COLORS.reset}: ${matrix[5]}`,
      `${COLORS.cyan}8${COLORS.reset}: ${matrix[8]}`,
    ],
    [
      `${COLORS.cyan}3${COLORS.reset}: ${matrix[3]}`,
      `${COLORS.cyan}6${COLORS.reset}: ${matrix[6]}`,
      `${COLORS.cyan}9${COLORS.reset}: ${matrix[9]}`,
    ],
  ];

  const columnWidths = [0, 0, 0];

  rows.forEach((row) => {
    row.forEach((cell, index) => {
      columnWidths[index] = Math.max(columnWidths[index], visibleLength(cell));
    });
  });

  const horizontal = `+${columnWidths
    .map((width) => "-".repeat(width + 2))
    .join("+")}+`;

  const output = [horizontal];

  rows.forEach((row, rowIndex) => {
    output.push(
      `| ${padCell(row[0], columnWidths[0])} | ${padCell(row[1], columnWidths[1])} | ${padCell(row[2], columnWidths[2])} |`,
    );

    if (rowIndex < rows.length - 1) {
      output.push(horizontal);
    }
  });

  output.push(horizontal);
  return output.join("\n");
};

const renderSummary = (result) => {
  const lines = [
    `${COLORS.bold}${COLORS.green}Психоматрица${COLORS.reset} ${COLORS.dim}для${COLORS.reset} ${COLORS.bold}${result.birthDate}${COLORS.reset}`,
    "",
    `${COLORS.yellow}Базовые цифры:${COLORS.reset} ${result.baseDigits}`,
    `${COLORS.yellow}Рабочие числа:${COLORS.reset} ${result.primarySum}, ${result.secondarySum}, ${result.thirdNumber}, ${result.fourthNumber}`,
    result.is21Century
      ? `${COLORS.yellow}Формула:${COLORS.reset} ветка 21 века (${result.primarySum} + 19)`
      : `${COLORS.yellow}Формула:${COLORS.reset} классическая ветка (${result.primarySum} - ${result.intermediate})`,
    `${COLORS.yellow}Цифры матрицы:${COLORS.reset} ${result.digitsForMatrix}`,
    "",
    renderMatrixTable(result.matrix),
  ];

  return lines.join("\n");
};

const readDateFromConsole = () => {
  const directInput = process.argv[2];

  if (directInput) {
    return Promise.resolve(directInput);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("Введите дату (DD.MM.YYYY): ", (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

const main = async () => {
  try {
    const input = await readDateFromConsole();
    const result = calculatePsychomatrix(input);
    console.log(renderSummary(result));
  } catch (error) {
    console.error(
      `${COLORS.bold}\x1b[31mОшибка:${COLORS.reset} ${error.message || String(error)}`,
    );
    process.exitCode = 1;
  }
};

if (require.main === module) {
  main();
}

module.exports = {
  calculatePsychomatrix,
  renderMatrixTable,
  renderSummary,
};
