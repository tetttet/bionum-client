function sumDigits(num: number) {
  let s = num
    .toString()
    .split("")
    .reduce((a, b) => a + Number(b), 0);
  while (s > 9) {
    s = s
      .toString()
      .split("")
      .reduce((a, b) => a + Number(b), 0);
  }
  return s;
}

export function getBirthNumber(dob: string) {
  const clean = dob.split("T")[0].replace(/-/g, "");
  return sumDigits(Number(clean));
}

export function getTodayNumber(dateKey: string) {
  const clean = dateKey.split("T")[0].replace(/-/g, "");
  return sumDigits(Number(clean));
}

export function getAffirmationNumber(dob: string, dateKey: string) {
  const birthNum = getBirthNumber(dob);
  const todayNum = getTodayNumber(dateKey);
  const total = birthNum + todayNum;
  return sumDigits(total); // финальное от 1 до 9
}
