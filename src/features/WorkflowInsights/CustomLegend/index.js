import React, { Component } from "react";
import PropTypes from "prop-types";
import LegendIcon from "./LegendIcon";
import "./styles.scss";

class CustomTooltip extends Component {
  render() {
    // const tooltipFields = this.props.payload.length > 0 ? Object.keys(this.props.payload[0].payload) : null;

    return (
      <div className="c-legend">
        {this.props.payload.map((data, index) => {
          let isToggled = this.props.toggledItems.find(item => data.payload.name === item);
          return (
            <div
              key={`${data.payload.name}-${index}`}
              className="c-legend-icon"
              onMouseEnter={this.props.onMouseEnter}
              onMouseLeave={this.props.onMouseLeave}
              onClick={() => this.props.toggleItem(data)}
            >
              <LegendIcon className="b-legend-icon" strokeColor={data.payload.fill} />
              <span className={`b-legend-label${isToggled ? " --toggled" : ""}`} key={data.dataKey}>
                {data.payload.name}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
}

CustomTooltip.propTypes = {
  payload: PropTypes.array,
  toggleItem: PropTypes.func,
  toggledItems: PropTypes.array
};

export default CustomTooltip;
