const workflowSchedules = [
  {
    dateSchedule: "2021-12-07T12:00:00",
    description: "Yep",
    id: "61d6286bc570b75ec2b47884",
    labels: [
      { key: "maintenance", value: "hello" },
      { key: "daily", value: "yes" },
    ],
    name: "Trigger",
    parameters: { name: "Tyson", word: "this" },
    status: "active",
    type: "runOnce",
  },
  {
    cronSchedule: "0 18 * * *",
    description: "This does stuff daily",
    id: "71d6286bc570b75ec2b47884",
    labels: [
      { key: "maintenance", value: "hello" },
      { key: "daily", value: "yes" },
    ],
    name: "Daily event",
    parameters: { name: "Tyson", word: "this" },
    status: "inactive",
    type: "cron",
  },
  {
    cronSchedule: "0 18 * * *",
    description:
      "This does stuff daily. But I need to include way to much information here. Way way too much, I mean it is absurd how much I am going to include here.",
    id: "81d6286bc570b75ec2b47884",
    labels: [
      { key: "maintenance", value: "hello" },
      { key: "daily", value: "yes" },
    ],
    name: "Deleted Daily event",
    parameters: { name: "Tyson", word: "this" },
    status: "deleted",
    type: "cron",
  },
];

export default workflowSchedules;
