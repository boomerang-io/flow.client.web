import DAYS_OF_WEEK from "Constants/daysOfWeek";

const CRON_TO_DAY = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6
};

const createListOfDays = (lowEnd, highEnd) => {
  var output = "";
  for (var i = lowEnd; i <= highEnd; i++) {
    output += `${i},`;
  }
  if (output[output.length - 1] === ",") {
    return output.slice(0, -1);
  } else {
    return output;
  }
};

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
  let cronDaysAdjusted = [];

  cronDays.forEach(entry => {
    let output = entry;
    if (entry.includes("-")) {
      let parts = entry.split("-");
      let lowEnd = parts[0];
      let highEnd = parts[0];
      if (lowEnd.length > 1) {
        //convert to number
        lowEnd = CRON_TO_DAY[parts[0]];
      }
      if (highEnd.length > 1) {
        //convert to number
        highEnd = CRON_TO_DAY[parts[1]];
      }
      output = createListOfDays(lowEnd, highEnd);
    }
    cronDaysAdjusted.push(output);
  });

  DAYS_OF_WEEK.forEach(
    day =>
      (selectedDays[day.value] =
        !!cronDaysAdjusted.find(cron => cron === day.cron || day.cronNumber.find(num => cron.includes(num))) ||
        cronDaysAdjusted.length === 0)
  );

  let cronTime = cronToData
    ? `${parseInt(cronToData[2], 10) < 10 ? "0" : ""}${parseInt(cronToData[2], 10)}:${
        parseInt(cronToData[1], 10) < 10 ? "0" : ""
      }${parseInt(cronToData[1], 10)}`
    : "18:00";
  return { selectedDays, cronTime };
};
