import React from "react";
import { LineChart } from "@carbon/charts-react";
import { chartInfo } from "../constants";

const lineTimeSeriesOptions = {
  height: "400px",
  axes: {
    left: {
      secondary: true,
      title: "Executions",
    },
    bottom: {
      scaleType: "time",
      primary: true,
    },
  },
  curve: "curveMonotoneX",
};

const CarbonLineChart = ({ data, title = "Line Chart" }) => {
  return (
    <div className="CarbonTimeLineChart">
      <LineChart
        data={{
          labels: chartInfo.map((chart) => chart.label),
          datasets: data,
        }}
        options={{ ...lineTimeSeriesOptions, title }}
      />
    </div>
  );
};

export default CarbonLineChart;
