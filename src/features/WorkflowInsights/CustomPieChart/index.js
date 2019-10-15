import React, { Component } from "react";
import PropTypes from "prop-types";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts/lib";
// import CustomTooltip from "../CustomTooltip";
import CustomPieLegend from "../CustomPieLegend";
import styles from "./customPieChart.module.scss";
class CustomPieChart extends Component {
  render() {
    const colors = ["#009C98", "#FFA4A9", "#50565B", "#B9BFC7"];

    return (
      <ResponsiveContainer height={220}>
        <PieChart className={styles.container}>
          <Pie
            align="left"
            data={this.props.data}
            dataKey="value"
            outerRadius={"80%"}
            innerRadius={"62%"}
            startAngle={90}
            endAngle={450}
            blendStroke={true}
          >
            {this.props.data.map((sector, index) => (
              <Cell key={index} fill={colors[index]} />
            ))}
          </Pie>
          {/* <Tooltip content={<CustomTooltip type="pie" />} /> */}
          <Legend content={<CustomPieLegend />} align="right" verticalAlign="middle" width={50} />
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
