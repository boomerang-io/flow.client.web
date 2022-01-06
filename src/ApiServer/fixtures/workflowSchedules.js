const workflowSchedules = [
  {
    dateSchedule: "2021-12-07T12:00:00",
    description: "Yep",
    id: "61d6286bc570b75ec2b47884",
    labels: { maintenance: "hello", daily: "yes" },
    name: "Trigger",
    parameters: { name: "Tyson", word: "this" },
    status: "active",
    type: "runOnce",
  },
  {
    cronSchedule: "2021-12-08T15:00:00",
    description: "This does stuff daily",
    id: "71d6286bc570b75ec2b47884",
    labels: { maintenance: "hello", daily: "yes" },
    name: "Daily event",
    parameters: { name: "Tyson", word: "this" },
    status: "inactive",
    type: "cron",
  },
  {
    cronSchedule: "2021-12-08T15:00:00",
    description:
      "This does stuff daily. But I need to include way to much information here. Way way too much, I mean it is absurd how much I am going to include here.",
    id: "81d6286bc570b75ec2b47884",
    labels: { maintenance: "hello", daily: "yes" },
    name: "Deleted Daily event",
    parameters: { name: "Tyson", word: "this" },
    status: "deleted",
    type: "cron",
  },
];

export default workflowSchedules;
