import { formatDistanceToNowStrict, parseISO } from "date-fns";

export const formatNumber = (number) => {
  return new Intl.NumberFormat().format(number);
};

export const formatDate = (date) => {
  const options = {
    dateStyle: "medium",
    timeStyle: "short",
  };
  return new Date(date).toLocaleString("en-GB", options);
};

export const getTimeAgo = (timestamp) => {
  let timeAgo = "";

  if (timestamp) {
    const date = parseISO(timestamp);
    const timePeriod = formatDistanceToNowStrict(date);
    timeAgo = `${timePeriod} ago`;
  }

  return timeAgo;
};

export const parseValidInt = (value) => (parseInt(value) ? parseInt(value) : 0);

export const parseValidFloat = (value) =>
  parseFloat(value) ? parseFloat(value) : 0;
