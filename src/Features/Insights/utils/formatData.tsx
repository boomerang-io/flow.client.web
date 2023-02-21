import sortBy from "lodash/sortBy";
import orderBy from "lodash/orderBy";
import { ExecutionStatusCopy } from "Constants";
import { timeSecondsToTimeUnit } from "Utils/timeSecondsToTimeUnit";
import { InsightsExecution } from "../Insights";
import { ExecutionStatus } from "Types";

interface ChartDataItem {
  value: number;
  date: Date;
  group: string;
}

export const parseChartsData = (
  data: Array<InsightsExecution>,
  statuses: ExecutionStatus | Array<ExecutionStatus> | null
) => {
  let executionPerWorkflowMap: { [k: string]: { label: string; value: number } } = {};
  let executionDateMap: { [k: string]: { [k: string]: number } } = {};

  let statusListMap: { [k: string]: Array<InsightsExecution> } = {
    cancelled: [],
    failure: [],
    inProgress: [],
    invalid: [],
    completed: [],
    waiting: [],
  };

  let scatterPlotData: Array<ChartDataItem> = [];
  let lineChartData: Array<ChartDataItem> = [];
  let sumDuration = 0;

  data.forEach((execution) => {
    // Get execution count
    if (!executionPerWorkflowMap[execution.workflowId]) {
      executionPerWorkflowMap[execution.workflowId] = { label: execution.workflowName, value: 1 };
    } else {
      executionPerWorkflowMap[execution.workflowId].value += 1;
    }

    const executionDate = new Date(execution.creationDate);
    const executionDateString = executionDate.toLocaleDateString("en-us", {
      day: "numeric",
      year: "numeric",
      month: "numeric",
    });

    // Summation of all durations
    sumDuration += execution.duration;

    // Build scatter plot data
    scatterPlotData.push({
      value: Math.round(execution.duration / 1000),
      date: executionDate,
      group: execution.workflowName,
    });

    // Group by status for pie chart
    switch (execution.status) {
      case ExecutionStatus.Completed:
        statusListMap.completed.push(execution);
        break;
      case ExecutionStatus.Failure:
        statusListMap.failure.push(execution);
        break;
      case ExecutionStatus.Cancelled:
        statusListMap.cancelled.push(execution);
        break;
      case ExecutionStatus.Invalid:
        statusListMap.invalid.push(execution);
        break;
      case ExecutionStatus.InProgress:
        statusListMap.inProgress.push(execution);
        break;
      case ExecutionStatus.Waiting:
        statusListMap.waiting.push(execution);
        break;
      default:
      // no-op
    }

    // Group by execution date for line chart
    if (!executionDateMap[executionDateString]) {
      executionDateMap[executionDateString] = {};
    }

    if (!executionDateMap[executionDateString][execution.status]) {
      executionDateMap[executionDateString][execution.status] = 1;
    } else {
      executionDateMap[executionDateString][execution.status] += 1;
    }
  });

  // Calculate status
  const totalExecutions = data.length;
  const duration = data.filter((execution) => execution.duration > 0);
  const dataByDuration = sortBy(duration, ({ duration }) => duration || "");
  const averageDuration = Math.round(sumDuration / totalExecutions);
  const maximumDuration = dataByDuration[dataByDuration.length - 1]
    ? dataByDuration[dataByDuration.length - 1].duration
    : 0;
  const minimumDuration = dataByDuration[0] ? dataByDuration[0].duration || 0 : 0;

  for (const [dateStr, statusMap] of Object.entries(executionDateMap)) {
    for (let [status, value] of Object.entries(statusMap)) {
      const typedStatus: ExecutionStatus = status as ExecutionStatus;
      if (ExecutionStatusCopy[typedStatus]) {
        lineChartData.push({ date: new Date(dateStr), value, group: ExecutionStatusCopy[typedStatus] });
      }
    }
  }

  // Default to all of them if no statuses are passed in
  let selectedStatuses = Object.values(ExecutionStatus).filter(
    (value) => [ExecutionStatus.NotStarted, ExecutionStatus.Skipped].includes(value) === false
  );
  if (statuses) {
    if (typeof statuses === "string") {
      selectedStatuses = [statuses];
    } else {
      selectedStatuses = statuses;
    }
  }

  const donutData = selectedStatuses.map((status: ExecutionStatus) => {
    return {
      group: ExecutionStatusCopy[status],
      value: statusListMap[status]?.length || 0,
    };
  });

  const executionsCountList = Object.values(executionPerWorkflowMap);

  return {
    lineChartData,
    scatterPlotData,
    donutData,
    durationData: [
      { value: timeSecondsToTimeUnit(Math.round(minimumDuration / 1000)), label: "Minimum" },
      { value: timeSecondsToTimeUnit(Math.round(maximumDuration / 1000)), label: "Maximum" },
      { value: timeSecondsToTimeUnit(Math.round(averageDuration / 1000)), label: "Average" },
    ],
    executionsCountList: orderBy(executionsCountList, ["value"], ["desc"]),
  };
};
