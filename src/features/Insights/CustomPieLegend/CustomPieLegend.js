import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./customPieLegend.module.scss";

class CustomPieLegend extends Component {
  render() {
    return (
      <div className={styles.container}>
        {this.props.payload.map((data, index) => {
          return (
            <div key={`${data.payload.name}-${index}`} className={styles.iconContainer} role="button" tabIndex="0">
              <div className={styles.icon} style={{ backgroundColor: data.payload.fill }} />
              <div className={styles.labelContainer}>
                <span className={styles.label} key={`${data.dataKey}-label`}>
                  {data.payload.name}
                </span>
                <span className={styles.value} key={`${data.dataKey}-value`}>
                  {`${data.payload.percentage}% (${data.payload.value} runs)`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

CustomPieLegend.propTypes = {
  payload: PropTypes.array
};

export default CustomPieLegend;
