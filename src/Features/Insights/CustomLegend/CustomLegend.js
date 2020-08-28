import React, { Component } from "react";
import PropTypes from "prop-types";
import LegendIcon from "./LegendIcon";
import { isAccessibleEvent } from "@boomerang-io/utils";
import styles from "./customLegend.module.scss";
class CustomTooltip extends Component {
  render() {
    // const tooltipFields = this.props.payload.length > 0 ? Object.keys(this.props.payload[0].payload) : null;

    return (
      <div className={styles.container}>
        {this.props.payload.map((data, index) => {
          let isToggled = this.props.toggledItems.find((item) => data.payload.name === item);
          return (
            <div
              key={`${data.payload.name}-${index}`}
              className={styles.iconContainer}
              onMouseEnter={this.props.onMouseEnter}
              onMouseLeave={this.props.onMouseLeave}
              onClick={() => this.props.toggleItem(data)}
              onKeyDown={(e) => isAccessibleEvent(e) && this.props.toggleItem(data)}
              role="button"
              tabIndex="0"
            >
              <LegendIcon className={styles.icon} strokeColor={data.payload.fill} />
              <span className={`${styles.label} ${isToggled ? " --toggled" : ""}`} key={data.dataKey}>
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
  toggledItems: PropTypes.array,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

export default CustomTooltip;
