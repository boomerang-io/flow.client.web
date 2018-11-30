import React, { Component } from "react";
import PropTypes from "prop-types";
import { PieChart, Pie, Tooltip, Cell, Label, ResponsiveContainer } from "recharts/lib";
import CustomTooltip from "../CustomTooltip";

class CustomPieChart extends Component {
  render() {
    const colors = ["#82ca9d", "#e26665"];

    return (
      <ResponsiveContainer height={200}>
        <PieChart>
          <Pie data={this.props.data} dataKey="value" outerRadius={"80%"} innerRadius={"60%"}>
            {this.props.data.map((sector, index) => (
              <Cell key={index} fill={colors[index]} />
            ))}
            <Label width={50} position="center">
              {`${this.props.percentageSuccessful}%`}
            </Label>
          </Pie>
          <Tooltip content={<CustomTooltip type="pie" />} />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}

CustomPieChart.propTypes = {
  data: PropTypes.array,
  percentageSuccessful: PropTypes.number
};
export default CustomPieChart;
