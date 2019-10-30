import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Label,
  ResponsiveContainer,
  CartesianGrid
} from "recharts/lib";
import CustomTooltip from "../CustomTooltip";
import CustomLegend from "../CustomLegend";
import moment from "moment";

class CustomAreaChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggledAreas: [],
      offsetFailed1: "5%",
      offsetFailed2: "95%",
      offsetSuccess1: "5%",
      offsetSuccess2: "95%",
      offsetTotal1: "5%",
      offsetTotal2: "95%",
      offsetInProgress1: "5%",
      offsetInProgress2: "95%",
      offsetInvalid1: "5%",
      offsetInvalid2: "95%"
    };
    this.toggleArea = this.toggleArea.bind(this);
  }

  handleMouseEnter = o => {
    const textValue = o.target.innerText ? o.target.innerText : "";
    switch (textValue.trim()) {
      case "failed":
        return this.setState({
          offsetFailed1: "100%",
          offsetFailed2: "0%",
          offsetSuccess1: "0%",
          offsetSuccess2: "0%",
          offsetTotal1: "0%",
          offsetTotal2: "0%",
          offsetInProgress1: "0%",
          offsetInProgress2: "0%",
          offsetInvalid1: "0%",
          offsetInvalid2: "0%"
        });
      case "success":
        return this.setState({
          offsetFailed1: "0%",
          offsetFailed2: "0%",
          offsetSuccess1: "100%",
          offsetSuccess2: "0%",
          offsetTotal1: "0%",
          offsetTotal2: "0%",
          offsetInProgress1: "0%",
          offsetInProgress2: "0%",
          offsetInvalid1: "0%",
          offsetInvalid2: "0%"
        });
      case "total":
        return this.setState({
          offsetFailed1: "0%",
          offsetFailed2: "0%",
          offsetSuccess1: "0%",
          offsetSuccess2: "0%",
          offsetTotal1: "100%",
          offsetTotal2: "0%",
          offsetInProgress1: "0%",
          offsetInProgress2: "0%",
          offsetInvalid1: "0%",
          offsetInvalid2: "0%"
        });
      case "inProgress":
        return this.setState({
          offsetFailed1: "0%",
          offsetFailed2: "0%",
          offsetSuccess1: "0%",
          offsetSuccess2: "0%",
          offsetTotal1: "0%",
          offsetTotal2: "0%",
          offsetInProgress1: "100%",
          offsetInProgress2: "0%",
          offsetInvalid1: "0%",
          offsetInvalid2: "0%"
        });
      case "invalid":
        return this.setState({
          offsetFailed1: "0%",
          offsetFailed2: "0%",
          offsetSuccess1: "0%",
          offsetSuccess2: "0%",
          offsetTotal1: "0%",
          offsetTotal2: "0%",
          offsetInProgress1: "0%",
          offsetInProgress2: "0%",
          offsetInvalid1: "100%",
          offsetInvalid2: "0%"
        });
      default:
    }
  };
  handleMouseLeave = o => {
    this.setState({
      offsetFailed1: "5%",
      offsetFailed2: "95%",
      offsetSuccess1: "5%",
      offsetSuccess2: "95%",
      offsetTotal1: "5%",
      offsetTotal2: "95%",
      offsetInProgress1: "5%",
      offsetInProgress2: "95%",
      offsetInvalid1: "5%",
      offsetInvalid2: "95%"
    });
  };

  toggleArea(value) {
    const selectedArea = this.state.toggledAreas.find(area => area === value.payload.name);
    if (!selectedArea) {
      this.setState({ toggledAreas: this.state.toggledAreas.concat(value.dataKey) });
    } else {
      this.setState({ toggledAreas: this.state.toggledAreas.filter(area => area !== value.payload.name) });
    }
  }
  render() {
    const {
      offsetFailed1,
      offsetFailed2,
      offsetSuccess1,
      offsetSuccess2,
      offsetTotal1,
      offsetTotal2,
      offsetInProgress1,
      offsetInProgress2,
      offsetInvalid1,
      offsetInvalid2
    } = this.state;
    const AreaLabel = (
      <text x={-180} y={35} dy={-5} fill={"#4a4a4a"} fontSize={14} transform="rotate(-90)" textAnchor="middle">
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
            fill={"#272727"}
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
            fill={"#272727"}
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
      <ResponsiveContainer width="100%" aspect={4.25 / 2} minHeight={300}>
        <AreaChart data={this.props.data} margin={{ top: 35, right: 40, left: 20, bottom: 40 }}>
          <defs>
            <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset={offsetFailed1} stopColor="#FFA4A9" stopOpacity={0.8} />
              <stop offset={offsetFailed2} stopColor="#FFA4A9" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset={offsetSuccess1} stopColor="#009C98" stopOpacity={0.8} />
              <stop offset={offsetSuccess2} stopColor="#009C98" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset={offsetTotal1} stopColor="#5285C1" stopOpacity={0.8} />
              <stop offset={offsetTotal2} stopColor="#5285C1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="grayGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset={offsetInvalid1} stopColor="#50565B" stopOpacity={0.8} />
              <stop offset={offsetInvalid2} stopColor="#50565B" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="lightGrayGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset={offsetInProgress1} stopColor="#B9BFC7" stopOpacity={0.8} />
              <stop offset={offsetInProgress2} stopColor="#B9BFC7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey={this.props.xAxisKey}
            tick={<CustomizedTick />}
            type={this.props.data.length === 1 ? "category" : "number"}
            domain={["dataMin", "dataMax"]}
          >
            <Label content={() => TitleLabel} />
          </XAxis>
          <YAxis
            allowDecimals={false}
            unit={this.props.yAxisUnit}
            domain={this.props.yAxisUnit === "%" ? [0, 100] : ["dataMin", "dataMax"]}
            padding={{ left: 20, right: 20 }}
          >
            <Label content={() => AreaLabel} />
          </YAxis>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Tooltip content={<CustomTooltip dateFormat={this.props.toolTipDateFormat} />} />
          {this.props.areaData.length > 1 ? (
            <Legend
              onClick={this.toggleArea}
              content={
                <CustomLegend
                  onMouseEnter={this.handleMouseEnter}
                  onMouseLeave={this.handleMouseLeave}
                  toggleItem={this.toggleArea}
                  toggledItems={this.state.toggledAreas}
                />
              }
              verticalAlign="bottom"
              iconType={"line"}
            />
          ) : null}
          {this.props.areaData.map((area, index) => {
            return (
              <Area
                key={index}
                type="monotone"
                fill={`url(#${area.gradientFill})`}
                dataKey={
                  !this.state.toggledAreas.find(selectedArea => selectedArea === area.dataKey) ? area.dataKey : ""
                }
                name={area.dataKey}
                stroke={area.stroke}
                activeDot={area.activeDot ? { r: 8 } : true}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    );
  }
}

CustomAreaChart.propTypes = {
  data: PropTypes.array,
  yAxisText: PropTypes.string,
  areaData: PropTypes.array.isRequired,
  xAxisKey: PropTypes.string,
  yAxisUnit: PropTypes.string,
  title: PropTypes.string,
  toolTipDateFormat: PropTypes.string
};

CustomAreaChart.defaultProps = {
  title: ""
};
export default CustomAreaChart;
