import React from "react";
import { ScatterChart } from "@carbon/charts-react";
import "@carbon/charts/styles.css";
// import CustomTooltip from "./CustomTooltip";

const scatterSeriesOptions = {
  axes: {
    left: {
      secondary: true,
      title: "Seconds"
    },
    bottom: {
      scaleType: "time",
      primary: true
    }
  },
  curve: "curveMonotoneX",
  // Doesn't seems to work like expected
  tooltip: {
    // customHTML: data => <CustomTooltip data={data}/>,
    formatter: data => `${data} seconds`
  },
  legend: {
    clickable: false,
    items: {
      status: {
        // ACTIVE: false,
        DISABLED: true
      }
    }
  },
  height: 350,
  width: 620
};

const CarbonScatterChart = ({ data }) => {
  return (
    <div className="CarbonTimeScatterChart">
      <ScatterChart
        data={{
          labels: [""],
          datasets: data
        }}
        options={scatterSeriesOptions}
      />
    </div>
  );
};

export default CarbonScatterChart;
