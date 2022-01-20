import { ScheduleStatus, ScheduleType } from "Types";

export const scheduleStatusOptions: Array<{ label: string; value: ScheduleStatus }> = [
  { label: "Enabled", value: "active" },
  { label: "Disabled", value: "inactive" },
  { label: "Workflow Disabled", value: "trigger_disabled" },
];

export const statusLabelMap: Record<ScheduleStatus, string> = {
  active: "Enabled",
  inactive: "Disabled",
  trigger_disabled: "Trigger Disabled",
  deleted: "Deleted",
};

export const typeLabelMap: Record<ScheduleType, string> = {
  runOnce: "Run Once",
  cron: "Recurring",
  advancedCron: "Recurring via cron expression",
};
