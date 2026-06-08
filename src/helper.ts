import { toast } from "react-toastify";
import type { SubscriptionI } from "./types";
// import debounce from 'lodash.debounce';

export const notify = {
  success: (msg: string) => toast.success(msg),
  error: (msg: string) => toast.error(msg),
  info: (msg: string) => toast.info(msg),
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
) => {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export function formatDateString(dateStr: string) {
  const parts = dateStr.split("-");
  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  if (parts.length === 2) {
    return `${months[monthIndex]} ${year}`;
  }
  const day = parseInt(parts[2], 10);
  return `${day} ${months[monthIndex]} ${year}`;
}

export function formatDateString2(date: string | Date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatMonthYearSimple(isoString: Date | string) {
  const date = new Date(isoString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// NEw new
export const formattedText = (text: string) => {
  const arr = text.split("_");
  const temp = arr.map((d) => d[0].toUpperCase() + d.slice(1));
  return temp.join(" ");
};
export const splitSubscriptionsByMonth = (
  subscriptions: SubscriptionI[],
): SubscriptionI[] => {
  const result: SubscriptionI[] = [];

  for (const subscription of subscriptions) {
    const originalStart = new Date(subscription.startDate);
    const originalEnd = new Date(subscription.endDate);

    let currentYear = originalStart.getFullYear();
    let currentMonth = originalStart.getMonth();

    while (
      currentYear < originalEnd.getFullYear() ||
      (currentYear === originalEnd.getFullYear() &&
        currentMonth <= originalEnd.getMonth())
    ) {
      const isFirstMonth =
        currentYear === originalStart.getFullYear() &&
        currentMonth === originalStart.getMonth();

      const isLastMonth =
        currentYear === originalEnd.getFullYear() &&
        currentMonth === originalEnd.getMonth();

      let segmentStart: Date;
      let segmentEnd: Date;

      if (isFirstMonth) {
        segmentStart = new Date(originalStart);
      } else {
        segmentStart = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);
      }

      if (isLastMonth) {
        segmentEnd = new Date(originalEnd);
      } else {
        segmentEnd = new Date(
          currentYear,
          currentMonth + 1,
          0,
          23,
          59,
          59,
          999,
        );
      }

      result.push({
        ...subscription,
        startDate: segmentStart.toISOString(),
        endDate: segmentEnd.toISOString(),
      });

      currentMonth++;

      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }
  }

  return result;
};

// NEW NEW
// Monthly note last updated at
export function formatTimestamp(isoString: string) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle '0' hours as '12'
  return `${day}-${monthName}-${year} | ${hours}:${minutes} ${ampm}`;
}
function getInclusiveMonthCount(
  startDateISO: Date | string,
  endDateISO: Date | string,
) {
  const start = new Date(startDateISO);
  const end = new Date(endDateISO);
  const result = [];
  const current = new Date(start.getFullYear(), start.getMonth(), 1);
  while (current <= end) {
    result.push(current.getMonth() + 1);
    current.setMonth(current.getMonth() + 1);
  }
  return result;
}