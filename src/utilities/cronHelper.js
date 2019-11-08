import DAYS_OF_WEEK from "Constants/daysOfWeek";

export const cronToDateTime = (hasSchedule, cronExp) => {
  if (!cronExp) return { selectedDays: {}, cronTime: "" };
  const cronToData = hasSchedule ? cronExp.split(" ") : undefined;
  let daysSlot = cronToData.length === 5 ? 4 : 5;
  let cronDays = cronToData
    ? cronToData[daysSlot] === "*" || !cronToData[daysSlot]
      ? []
      : cronToData[daysSlot].split(",")
    : [];
  let selectedDays = {};

  DAYS_OF_WEEK.forEach(
    day =>
      (selectedDays[day.value] = !!cronDays.find(
        cron => cron === day.cron || day.cronNumber.find(num => cron.includes(num))
      ))
  );

  let cronTime = cronToData
    ? `${parseInt(cronToData[2], 10) < 10 ? "0" : ""}${parseInt(cronToData[2], 10)}:${
        parseInt(cronToData[1], 10) < 10 ? "0" : ""
      }${parseInt(cronToData[1], 10)}`
    : "18:00";
  return { selectedDays, cronTime };
};
