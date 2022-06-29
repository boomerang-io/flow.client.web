//@ts-nocheck
import { ScatterChart } from "@carbon/charts-react";
import { ScaleTypes, ChartTabularData } from "@carbon/charts/interfaces";
import "@carbon/charts/styles.css";
// import CustomTooltip from "./CustomTooltip";

const scatterSeriesOptions = {
  height: "400px",
  axes: {
    left: {
      title: "Duration (secs)",
      mapsTo: "value",
    },
    bottom: {
      title: "Date",
      scaleType: ScaleTypes.TIME,
      mapsTo: "date",
    },
  },
  legend: {
    enabled: false,
  },
  tooltip: {
    groupLabel: "Workflow",
    truncation: {
      numCharacter: 50
    }
  }
};

interface CarbonScatterChartProps {
  data: ChartTabularData;
  title: string;
}

const CarbonScatterChart = ({ data, title = "Scatter Chart" }: CarbonScatterChartProps) => {
  return (
    <div className="CarbonTimeScatterChart">
      <ScatterChart
        resizable
        data={data}
        options={{ ...scatterSeriesOptions, title }}
      />
    </div>
  );
};

export default CarbonScatterChart;
