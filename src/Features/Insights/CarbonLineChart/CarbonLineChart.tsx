import { LineChart } from "@carbon/charts-react";
import { ScaleTypes } from "@carbon/charts/interfaces";

interface CarbonLineChartProps {
  data: any;
  title?: string;
}

function CarbonLineChart(props: CarbonLineChartProps) {
  const { data, title = "Line Chart" } = props;
  return (
    <LineChart
      data={data}
      options={{
        title,
        curve: "curveMonotoneX",
        height: "400px",
        axes: {
          left: {
            title: "Executions",
          },
          bottom: {
            title: "Date",
            scaleType: ScaleTypes.TIME,
          },
        },
        tooltip: {
          groupLabel: "Status",
        },
        zoomBar: {
          top: {
            enabled: false,
          },
        },
      }}
    />
  );
}

export default CarbonLineChart;
