import React from "react";
import { LineChart } from "@carbon/charts-react";
import "@carbon/charts/styles.css";
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
  curve: "curveMonotoneX",
  height: 350,
  width: 620
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
