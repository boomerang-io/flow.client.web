import moment from "moment";
import { ApprovalStatus, ExecutionStatus } from "Types";

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
  { label: "Scheduler", value: "scheduler" },
  { label: "Manual", value: "manual" },
  { label: "Webhook", value: "webhook" },
];

export const statusOptions: Array<{ label: string; value: ExecutionStatus }> = [
  { label: "Succeeded", value: ExecutionStatus.Completed },
  { label: "Failed", value: ExecutionStatus.Failure },
  { label: "In Progress", value: ExecutionStatus.InProgress },
  { label: "Cancelled", value: ExecutionStatus.Cancelled },
  { label: "Invalid", value: ExecutionStatus.Invalid },
  { label: "Waiting", value: ExecutionStatus.Waiting },
];

export const approvalStatusOptions = [
  { label: "Approved", value: ApprovalStatus.Approved },
  { label: "Rejected", value: ApprovalStatus.Rejected },
  { label: "Submitted", value: ApprovalStatus.Submitted },
];
