export const weekLetters: string[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const daysNums: number[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31,
];

export const week: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export const weekColors: string[] = [
  "#eef2ff", // very light indigo
  "#e0e7ff",
  "#c7d2fe",
  "#a5b4fc",
  "#818cf8"  // closer to primary
];
export const weekColorsDark: string[] = [
  "#1a1c3a",
  "#23265a",
  "#2d317a",
  "#373c9a",
  "#4448b5"
];

export const plans = [
  {
    title: "1 Month",
    price: "Free",
    desc: "Valid for the current month only, regardless of remaining days."
  },
  {
    title: "3 Months",
    price: "₹50",
    desc: "Covers current month + next 2 months."
  },
  {
    title: "6 Months",
    price: "₹80",
    desc: "Covers current month + next 5 months."
  },
  {
    title: "12 Months",
    price: "₹150",
    desc: "Covers current month + next 11 months."
  },
  {
    title: "Current Year",
    price: "₹20",
    desc: "Covers current month + next remaining months of current year (₹20/month)."
  }
];

export const monMap: { [key: number]: string } = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
  }
