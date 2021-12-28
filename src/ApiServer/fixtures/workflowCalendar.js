export const workflowCalendar = [
  {
    dateSchedule: "2021-12-07T12:00:00",
    description: "This triggers things",
    id: "2",
    labels: { maintenance: "hello", daily: "yes" },
    name: "Trigger",
    parameters: { name: "Tyson", word: "this" },
    status: "active",
    type: "runOnce",
  },
  {
    cronSchedule: "2021-12-08T15:00:00",
    description: "This does stuff daily",
    id: "1",
    labels: { maintenance: "hello", daily: "yes" },
    name: "Daily event",
    parameters: { name: "Tyson", word: "this" },
    status: "active",
    type: "cron",
  },
];

export default workflowCalendar;
