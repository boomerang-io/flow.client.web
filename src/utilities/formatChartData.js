import { sortBy } from "lodash";
import moment from "moment";

export const parseChartsData = data => {
  let dateName = [];
  let failure = [];
  let success = [];
  let finalData = [];
  let scatterData = [];
  let medianArray = [];

  data.map(item => {
    scatterData.push({
      name: `${item.teamName} - ${item.workflowName} `,
      duration: parseInt(item.duration / 1000, 10),
      date: parseInt(moment(item.creationDate).format("x"), 10)
    });
    medianArray.push(parseInt(item.duration / 1000, 10));
    if (item.status === "completed") success.push(item);
    if (item.status === "failed" || item.status === "inprogress" || item.status === undefined) failure.push(item);
    if (dateName.find(date => moment(date).format("DD-MM-YY") === moment(item.creationDate).format("DD-MM-YY"))) {
      return null;
    } else {
      return dateName.push(item.creationDate);
    }
  });

  dateName.map(date => {
    let fail = failure.filter(item => moment(item.creationDate).format("DD-MM-YY") === moment(date).format("DD-MM-YY"))
      .length;
    let succeeded = success.filter(
      item => moment(item.creationDate).format("DD-MM-YY") === moment(date).format("DD-MM-YY")
    ).length;
    return finalData.push({
      date: parseInt(moment(date).format("x"), 10),
      failed: fail,
      success: succeeded,
      total: fail + succeeded
    });
  });
  const totalExecutions = data.length;
  const successExecutions = success.length;
  const percentageSuccessful = parseFloat(((success.length / totalExecutions) * 100).toFixed(2));
  return {
    timeData: sortBy(finalData, ["date"]),
    scatterData: sortBy(scatterData, ["date"]),
    pieData: [
      { name: "Passed", value: successExecutions },
      { name: "Failed", value: totalExecutions - successExecutions }
    ],
    percentageSuccessful
  };
};
