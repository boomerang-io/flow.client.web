import React from "react";
import { DonutChart } from "@carbon/charts-react";

const CarbonDonutChart = ({ data }) => {
  return (
    <div className="CarbonDonutChart">
      <DonutChart
        fixedDataLabels={false}
        data={{
          labels: ["Success", "Failed", "Invalid", "Cancelled"],
          datasets: data
        }}
        options={{
          legend: {
            position: "right",
            items: {
              verticalSpace: 30
            }
          },
        }}
      />
    </div>
  );
};

export default CarbonDonutChart;
