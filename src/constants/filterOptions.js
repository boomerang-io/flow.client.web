import moment from "moment";

const oneMonthAgo = moment().subtract(1, "month");
const monthAgoInDays = moment().diff(oneMonthAgo, "days");

const threeMonthsAgo = moment().subtract(3, "month");
const threeMonthsAgoInDays = moment().diff(threeMonthsAgo, "days");

// const sixMonthsAgo = moment().subtract(6, "month");
// const sixMonthsAgoInDays = moment().diff(sixMonthsAgo, "days");

// const oneYearAgo = moment().subtract(1, "year");
// const yearAgoInDays = moment().diff(oneYearAgo, "days");

export const timeframeOptions = [
  { label: "1 day", value: 1 },
  { label: "1 week", value: 7 },
  { label: "1 month", value: monthAgoInDays },
  { label: "3 months", value: threeMonthsAgoInDays },
  // { label: "6 months", value: sixMonthsAgoInDays },
  // { label: "1 year", value: yearAgoInDays }
];
export const executionOptions = [
  { label: "cron", value: "cron" },
  { label: "manual", value: "manual" },
  { label: "webhook", value: "webhook" },
];
export const statusOptions = [
  { label: "Succeeded", value: "completed" },
  { label: "Failed", value: "failure" },
  { label: "Invalid", value: "invalid" },
  { label: "In Progress", value: "inProgress" },
];

export const ALL_OPTIONS = {
  TEAMS: { id: "none", name: "All Teams" },
  WORKFLOWS: { id: "none", name: "All Workflows" },
};
