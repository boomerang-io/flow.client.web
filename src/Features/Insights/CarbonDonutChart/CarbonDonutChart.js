import React from "react";
import { DonutChart } from "@carbon/charts-react";

const CarbonDonutChart = ({ data, title="Donut Chart" }) => {
  return (
    <div className="CarbonDonutChart">
      <DonutChart
        resizable
        fixedDataLabels={false}
        data={{
          labels: ["Success", "Failed", "Invalid", "Cancelled"],
          datasets: data,
        }}
        options={{
          title,
          resizable: true,
          height: "300px",
          donut: {
            center: {
              label: "Executions",
            },
          },
          legend: {
            position: "right",
            items: {
              verticalSpace: 30,
            },
          },
        }}
      />
    </div>
  );
};

export default CarbonDonutChart;
