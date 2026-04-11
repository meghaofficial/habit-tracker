export const weekLetters: string[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const daysNums: number[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31,
];

export const months: Record<string, string> = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  June: "June",
  July: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December",
};

export const week: Record<number, string> = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

// bright bluebonnet - https://www.color-hex.com/color-palettes/
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
    price: "₹20/month",
    desc: "Pay ₹20 per month for the remaining months of the current year (including this month)."
  }
];
