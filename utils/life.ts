const six_3 = [13, 19, 25, 31, 37, 43, 49, 55, 61, 67, 73, 79, 85, 91, 97];
const six_0 = [14, 20, 26, 32, 38, 44, 50, 56, 62, 68, 74, 80, 86, 92, 98];
const six_5 = [15, 21, 27, 33, 39, 45, 51, 57, 63, 69, 75, 81, 87, 93, 99];
const six_6 = [16, 22, 28, 34, 40, 46, 52, 58, 64, 70, 76, 82, 88, 94, 100];
const six_9 = [17, 23, 29, 35, 41, 47, 53, 59, 65, 71, 77, 83, 89, 95];
const six_4 = [18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96];

const seven_3 = [13, 20, 27, 34, 41, 48, 55, 62, 69, 76, 83, 90, 97];
const seven_9 = [14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 91, 98];
const seven_8 = [15, 22, 29, 36, 43, 50, 57, 64, 71, 78, 85, 92, 99];
const seven_3_second = [16, 23, 30, 37, 44, 51, 58, 65, 72, 79, 86, 93, 100];
const seven_7 = [17, 24, 31, 38, 45, 52, 59, 66, 73, 80, 87, 94];
const seven_9_second = [18, 25, 32, 39, 46, 53, 60, 67, 74, 81, 88, 95];
const seven_1 = [19, 26, 33, 40, 47, 54, 61, 68, 75, 82, 89, 96];

type LifeCodeGroup = "five" | "six" | "seven";

export type LifeCodeResult = {
  group: LifeCodeGroup;
  code: number;
  arrayName: string;
  multiplyValue: number;
  digits: number[];
  age: number;
};

const START_AGE = 13;
const END_AGE = 100;

/**
 * Названия позиций для совместимости с твоей старой логикой
 */
const GROUP_ARRAY_NAMES: Record<LifeCodeGroup, string[]> = {
  five: ["five_1", "five_2", "five_3", "five_4", "five_5"],
  six: ["six_3", "six_0", "six_5", "six_6", "six_9", "six_4"],
  seven: [
    "seven_3",
    "seven_9",
    "seven_8",
    "seven_3_second",
    "seven_7",
    "seven_9_second",
    "seven_1",
  ],
};

function getBirthMultiplyDigits(dateOfBirth: Date): {
  multiplyValue: number;
  digits: number[];
  group: LifeCodeGroup;
} | null {
  const day = dateOfBirth.getDate();
  const month = dateOfBirth.getMonth() + 1;
  const year = dateOfBirth.getFullYear();

  // Пример:
  // 13.01.2007 => 131 * 2007
  const dayMonthNumber = Number(`${day}${month}`);
  const multiplyValue = dayMonthNumber * year;
  const digits = String(multiplyValue)
    .split("")
    .map((n) => Number(n));

  if (digits.length === 5) {
    return {
      multiplyValue,
      digits,
      group: "five",
    };
  }

  if (digits.length === 6) {
    return {
      multiplyValue,
      digits,
      group: "six",
    };
  }

  if (digits.length === 7) {
    return {
      multiplyValue,
      digits,
      group: "seven",
    };
  }

  return null;
}

export function getAgeByBirthDate(
  birthDate: Date,
  today: Date = new Date(),
): number {
  let age = today.getFullYear() - birthDate.getFullYear();

  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();

  const hasHadBirthdayThisYear =
    currentMonth > birthMonth ||
    (currentMonth === birthMonth && currentDay >= birthDay);

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age;
}

export function ifUserHaveBirthDay(
  birthDate: Date,
  today: Date = new Date(),
): boolean {
  return (
    today.getDate() === birthDate.getDate() &&
    today.getMonth() === birthDate.getMonth()
  );
}

/**
 * Возвращает индекс позиции возраста внутри группы:
 *
 * groupSize=6:
 * 13 -> 0
 * 14 -> 1
 * 15 -> 2
 * 16 -> 3
 * 17 -> 4
 * 18 -> 5
 * 19 -> 0
 *
 * groupSize=5:
 * 13 -> 0
 * 14 -> 1
 * 15 -> 2
 * 16 -> 3
 * 17 -> 4
 * 18 -> 0
 */
function getAgeGroupIndex(age: number, groupSize: number): number | null {
  if (age < START_AGE || age > END_AGE) {
    return null;
  }

  return (age - START_AGE) % groupSize;
}

export function getLifeCodeByAgeDate(
  age: number,
  dateOfBirth: Date,
): LifeCodeResult | null {
  const birthData = getBirthMultiplyDigits(dateOfBirth);

  if (!birthData) {
    return null;
  }

  const { multiplyValue, digits, group } = birthData;
  const groupSize = digits.length;

  const ageIndex = getAgeGroupIndex(age, groupSize);

  if (ageIndex === null) {
    return null;
  }

  const arrayNames = GROUP_ARRAY_NAMES[group];

  return {
    group,
    code: digits[ageIndex],
    arrayName: arrayNames[ageIndex],
    multiplyValue,
    digits,
    age,
  };
}

export function getLifeCodeByBirthDate(
  dateOfBirth: Date,
  today: Date = new Date(),
): LifeCodeResult | null {
  const age = getAgeByBirthDate(dateOfBirth, today);
  return getLifeCodeByAgeDate(age, dateOfBirth);
}

/**
 * Если хочешь получить сразу всю раскладку по группе:
 * например для 255807:
 * six_3 -> 2
 * six_0 -> 5
 * six_5 -> 5
 * six_6 -> 8
 * six_9 -> 0
 * six_4 -> 7
 */
export function getAllLifeCodesByBirthDate(dateOfBirth: Date): {
  group: LifeCodeGroup;
  multiplyValue: number;
  digits: number[];
  codes: { arrayName: string; code: number; index: number }[];
} | null {
  const birthData = getBirthMultiplyDigits(dateOfBirth);

  if (!birthData) {
    return null;
  }

  const { group, multiplyValue, digits } = birthData;
  const arrayNames = GROUP_ARRAY_NAMES[group];

  return {
    group,
    multiplyValue,
    digits,
    codes: digits.map((digit, index) => ({
      arrayName: arrayNames[index],
      code: digit,
      index,
    })),
  };
}
