import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimestamp = (createdAt: Date): string => {
  const now = new Date();
  const timeDiff = now.getTime() - createdAt.getTime();

  // Define time units in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (timeDiff < minute) {
    const secondsAgo = Math.round(timeDiff / 1000);
    return `${secondsAgo} second${secondsAgo === 1 ? "" : "s"} ago`;
  } else if (timeDiff < hour) {
    const minutesAgo = Math.round(timeDiff / minute);
    return `${minutesAgo} minute${minutesAgo === 1 ? "" : "s"} ago`;
  } else if (timeDiff < day) {
    const hoursAgo = Math.round(timeDiff / hour);
    return `${hoursAgo} hour${hoursAgo === 1 ? "" : "s"} ago`;
  } else if (timeDiff < week) {
    const daysAgo = Math.round(timeDiff / day);
    return `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;
  } else if (timeDiff < month) {
    const weeksAgo = Math.round(timeDiff / week);
    return `${weeksAgo} week${weeksAgo === 1 ? "" : "s"} ago`;
  } else if (timeDiff < year) {
    const monthsAgo = Math.round(timeDiff / month);
    return `${monthsAgo} month${monthsAgo === 1 ? "" : "s"} ago`;
  } else {
    const yearsAgo = Math.round(timeDiff / year);
    return `${yearsAgo} year${yearsAgo === 1 ? "" : "s"} ago`;
  }
};

export const formatNumberWithExtension = (number: number): string => {
  if (typeof number !== "number") {
    console.log("Input must be a number");
  }

  if (Math.abs(number) >= 1e6) {
    return (number / 1e6).toFixed(1) + "M";
  } else if (Math.abs(number) >= 1e3) {
    return (number / 1e3).toFixed(1) + "K";
  } else {
    return number.toString();
  }
};

export const getJoinedDate = (date: Date): string => {
  const monthNames: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month: string = monthNames[date.getMonth()];
  const year: number = date.getFullYear();

  return `${month} ${year}`;
};

interface Props {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value }: Props) => {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

interface RemoveKeysProps {
  params: string;
  keysToRemove: string[];
}
export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: RemoveKeysProps) => {
  const currentUrl = qs.parse(params);
  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};
