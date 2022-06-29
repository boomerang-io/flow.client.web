import { ScatterChart } from "@carbon/charts-react";
import "@carbon/charts/styles.css";
// import CustomTooltip from "./CustomTooltip";

const scatterSeriesOptions = {
  height: "400px",
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
  }
};

const CarbonScatterChart = ({ data, title="Scatter Chart" }) => {
  return (
    <div className="CarbonTimeScatterChart">
      <ScatterChart
        data={{
          labels: [""],
          datasets: data
        }}
        options={{...scatterSeriesOptions, title}}
      />
    </div>
  );
};

export default CarbonScatterChart;
