import React from "react";
import { LineChart } from "@carbon/charts-react";
import { chartInfo } from "../constants";

const lineTimeSeriesOptions = {
  axes: {
    left: {
      secondary: true,
      title: "Executions"
    },
    bottom: {
      scaleType: "time",
      primary: true
    }
  },
  curve: "curveMonotoneX"
};

const CarbonLineChart = ({ data }) => {
  return (
    <div className="CarbonTimeLineChart">
      <LineChart
        data={{
          labels: chartInfo.map(chart => chart.label),
          datasets: data
        }}
        options={lineTimeSeriesOptions}
      />
    </div>
  );
};

export default CarbonLineChart;
