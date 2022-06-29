import { sortBy, orderBy } from "lodash";
import { ExecutionStatus } from "Constants";
import { timeSecondsToTimeUnit } from "Utils/timeSecondsToTimeUnit";
import { chartInfo } from "./constants";

export const parseChartsData = (data) => {
  let executionPerWorkflowMap = {};
  let executionDateMap = {};

  let cancelledList = [];
  let failureList = [];
  let inProgressList = [];
  let invalidList = [];
  let successList = [];
  let waitingList = [];

  let scatterPlotData = [];
  let sumDuration = 0;

  data.forEach((item) => {
    // Get execution count
    if (!executionPerWorkflowMap[item.workflowId]) {
      executionPerWorkflowMap[item.workflowId] = { label: item.workflowName, value: 1 };
    } else {
      executionPerWorkflowMap[item.workflowId].value += 1;
    }

    const executionDate = new Date(item.creationDate);
    const executionDateString = executionDate.toLocaleDateString("en-us", {
      day: "numeric",
      year: "numeric",
      month: "numeric",
    });

    // Summation of all durations
    sumDuration += item.duration;

    // Build scatter plot data
    scatterPlotData.push({
      value: parseInt(item.duration / 1000, 10),
      date: executionDate,
      group: item.workflowName,
    });

    // Group by status for pie chart
    switch (item.status) {
      case ExecutionStatus.Completed:
        successList.push(item);
        break;
      case ExecutionStatus.Failure:
        failureList.push(item);
        break;
      case ExecutionStatus.Cancelled:
        cancelledList.push(item);
        break;
      case ExecutionStatus.Invalid:
        invalidList.push(item);
        break;
      case ExecutionStatus.InProgress:
        inProgressList.push(item);
        break;
      case ExecutionStatus.Waiting:
        waitingList.push(item);
        break;
      default:
      // no-op
    }

    // Group by execution date for line chart
    if (!executionDateMap[executionDateString]) {
      executionDateMap[executionDateString] = {};
    }

    if (!executionDateMap[executionDateString][item.status]) {
      executionDateMap[executionDateString][item.status] = 1;
    } else {
      executionDateMap[executionDateString][item.status] += 1;
    }
  });

  // Calculate status
  const totalExecutions = data.length;
  const duration = data.filter((execution) => execution.duration > 0);
  const dataByDuration = sortBy(duration, ({ duration }) => duration || "");
  const averageDuration = parseInt(sumDuration / totalExecutions, 10);
  const medianDuration = dataByDuration[parseInt((data.length - 1) / 2, 10)]
    ? dataByDuration[parseInt((data.length - 1) / 2, 10)].duration
    : 0;
  const maximumDuration = dataByDuration[dataByDuration.length - 1]
    ? dataByDuration[dataByDuration.length - 1].duration
    : 0;
  const minimumDuration = dataByDuration[0] ? dataByDuration[0].duration || 0 : 0;

  const executionsByDayByType = {
    completed: [],
    failure: [],
    invalid: [],
    cancelled: [],
    inProgress: [],
    waiting: [],
  };

  for (const [dateStr, statusMap] of Object.entries(executionDateMap)) {
    for (const [status, value] of Object.entries(statusMap)) {
      if (Array.isArray(executionsByDayByType[status])) {
        executionsByDayByType[status].push({ date: new Date(dateStr), value });
      }
    }
  }

  const lineChartData = chartInfo.map((chart) => {
    return {
      color: chart.color,
      label: chart.label,
      data: executionsByDayByType[chart.value] ?? [],
    };
  });

  const donutData = [
    {
      data: [successList.length, failureList.length, invalidList.length, cancelledList.length, inProgressList.length, waitingList.length],
    },
  ];

  const executionsByTeam = Object.values(executionPerWorkflowMap);

  return {
    lineChartData,
    scatterPlotData,
    donutData,
    durationData: [
      { value: timeSecondsToTimeUnit(parseInt(minimumDuration / 1000, 10)), label: "Minimum" },
      { value: timeSecondsToTimeUnit(parseInt(maximumDuration / 1000, 10)), label: "Maximum" },
      { value: timeSecondsToTimeUnit(parseInt(averageDuration / 1000, 10)), label: "Average" },
    ],
    medianDuration: parseInt(medianDuration / 1000, 10),
    executionsByTeam: orderBy(executionsByTeam, ["value"], ["desc"]),
  };
};
