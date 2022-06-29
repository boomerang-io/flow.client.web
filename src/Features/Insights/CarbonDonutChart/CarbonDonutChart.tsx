// @ts-nocheck
import { DonutChart } from "@carbon/charts-react";

const CarbonDonutChart = ({
  data,
  title = "Donut Chart",
  labels = ["Succeeded", "Failed", "Invalid", "Cancelled", "In Progress", "Waiting"],
}) => {
  return (
    <div className="CarbonDonutChart">
      <DonutChart
        resizable
        fixedDataLabels={false}
        data={{
          labels,
          datasets: data,
        }}
        options={{
          title,
          resizable: true,
          height: "350px",
          donut: {
            alignment: "center",
            center: {
              label: "Executions",
            },
          },
          legend: {
            alignment: "left",
            position: "bottom",
          },
        }}
      />
    </div>
  );
};

export default CarbonDonutChart;
