import React from "react";
import { DonutChart } from "@carbon/charts-react";

const CarbonDonutChart = ({ data }) => {
  return (
    <div className="CarbonDonutChart">
      <DonutChart
        fixedDataLabels={false}
        data={{
          labels: ["Success", "Failed", "Invalid", "In Progress"],
          datasets: data
        }}
        options={{
          accessibility: false,
          // tooltip: {
          //   formatter: tooltipValue => `${tooltipValue * 100}%`
          // },
          // pie:{
          //   padAngle: "40"
          // },
          legend: {
            position: "right",
            items: {
              verticalSpace: 30
            }
          },
          height: 250,
          width: 400
        }}
      />
    </div>
  );
};

export default CarbonDonutChart;
