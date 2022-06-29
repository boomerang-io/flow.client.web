// @ts-nocheck
import { LineChart } from "@carbon/charts-react";
import { chartInfo } from "../constants";

const lineTimeSeriesOptions = {
  height: "400px",
  axes: {
    left: {
      title: "Executions",
      secondary: true,
    },
    bottom: {
      title: "Date",
      scaleType: "time",
      primary: true,
    },
  },
  curve: "curveMonotoneX",
  tooltip: {
    groupLabel: "Status"
  }
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
