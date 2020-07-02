import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Label,
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from "recharts/lib";
import moment from "moment";
import CustomTooltip from "../CustomTooltip";
import CustomLegend from "../CustomLegend";

class CustomScatterChart extends Component {
  state = {
    toggledScatters: []
  };

  toggleScatter = value => {
    const selectedScatter = this.state.toggledScatters.find(scatter => scatter === value.payload.name);
    if (!selectedScatter) {
      this.setState({ toggledScatters: this.state.toggledScatters.concat(value.payload.name) });
    } else {
      this.setState({ toggledScatters: this.state.toggledScatters.filter(scatter => scatter !== value.payload.name) });
    }
  };

  render() {
    const color = "#009C98";
    const ScatterCircle = () => {
      return (
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="10" height="10">
          <circle cx="10" cy="10" r={7} fill={color} />
        </svg>
      );
    };
    const ScatterLabel = (
      <text x={-180} y={30} dy={-5} fill={"#4a4a4a"} fontSize={14} transform="rotate(-90)" textAnchor="middle">
        {this.props.yAxisText}
      </text>
    );
    const TitleLabel = (
      <text x={240} y={16} dy={-4} fill={"#4a4a4a"} fontSize={16} textAnchor="middle">
        {this.props.title}
      </text>
    );
    const CustomizedTick = event => {
      const formatValue = moment(event.payload.value);
      return (
        <g>
          <text
            x={event.x}
            y={event.y + 20}
            dy={-4}
            fill={"#4a4a4a"}
            fontSize={12}
            fontFamily="IBM Plex Sans"
            letterSpacing={0.5}
            textAnchor="middle"
          >
            {`${formatValue.format("MMM")} ${formatValue.format("DD")}`}
          </text>
          <text
            x={event.x}
            y={event.y + 40}
            dy={-4}
            fill={"#4a4a4a"}
            fontSize={12}
            fontFamily="IBM Plex Sans"
            letterSpacing={0.5}
            textAnchor="middle"
          >
            {`${formatValue.year()}`}
          </text>
        </g>
      );
    };

    return (
      <ResponsiveContainer aspect={4.25 / 2}>
        <ScatterChart margin={{ top: 50, left: 20, right: 40, bottom: 20 }}>
          <XAxis
            domain={["dataMin", "dataMax"]}
            dataKey={"date"}
            type={this.props.data.length === 1 ? "category" : "number"}
            name="Date"
            tick={<CustomizedTick />}
            minTickGap={5}
            allowDuplicatedCategory={true}
          >
            <Label content={() => TitleLabel} />
          </XAxis>
          <YAxis
            domain={this.props.yAxisUnit === "%" ? [0, 100] : ["dataMin", "dataMax"]}
            dataKey={this.props.yAxisDataKey}
            type="number"
            name={this.props.yAxisDataKey}
            unit={this.props.yAxisUnit}
            allowDecimals={false}
          >
            <Label content={() => ScatterLabel} position={"bottom"} />
          </YAxis>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Tooltip cursor={{ strokeDasharray: "10 10" }} content={<CustomTooltip />} />
          {this.props.scatterData && this.props.scatterData.length > 1 ? (
            <Legend
              onClick={this.toggleScatter}
              content={<CustomLegend toggleItem={this.toggleScatter} toggledItems={this.state.toggledScatters} />}
              verticalAlign="bottom"
              iconType={"line"}
            />
          ) : null}
          {this.props.scatterData ? (
            this.props.scatterData.map((scatter, index) => {
              return (
                <Scatter
                  key={index}
                  name={scatter.name}
                  data={
                    !this.state.toggledScatters.find(selectedScatter => selectedScatter === scatter.name)
                      ? this.props.data[index]
                      : ""
                  }
                  fill={color}
                  shape={ScatterCircle()}
                />
              );
            })
          ) : (
            <Scatter data={this.props.data} fill="#047cc0" shape={ScatterCircle("#047cc0")} />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    );
  }
}

CustomScatterChart.propTypes = {
  data: PropTypes.array,
  yAxisText: PropTypes.string,
  yAxisDataKey: PropTypes.string,
  yAxisUnit: PropTypes.string,
  title: PropTypes.string,
  scatterData: PropTypes.array
};
CustomScatterChart.defaultProps = {
  title: ""
};
export default CustomScatterChart;
