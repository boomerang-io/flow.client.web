import { DonutChart } from "@carbon/charts-react";
import { Alignments, LegendPositions } from "@carbon/charts/interfaces";

interface CarbonDonutChartProps {
  data: any;
  title?: string;
}

function CarbonDonutChart(props: CarbonDonutChartProps) {
  const { data, title = "Donut Chart" } = props;
  return (
    <div className="CarbonDonutChart">
      <DonutChart
        data={data}
        options={{
          title,
          resizable: true,
          height: "350px",
          donut: {
            alignment: Alignments.CENTER,
            center: {
              label: "Executions",
            },
          },
          legend: {
            alignment: Alignments.CENTER,
            position: LegendPositions.BOTTOM,
          },
        }}
      />
    </div>
  );
}

export default CarbonDonutChart;
