import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import getHumanizedDuration from "@boomerang-io/utils/lib/getHumanizedDuration";
import styles from "./customTooltip.module.scss";

class CustomTooltip extends Component {
  render() {
    const { data } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.colorContainer} />
        <div className={styles.colorContainer}>
          <p key="data-label" className={styles.row}>
            <span className={styles.label}>{`Date:`}</span>
            {`${moment(data.date).format("DD-MM-YY")}`}
          </p>
          <p key="data-value" className={styles.row}>
            <span className={styles.label}>{`Duration: `}</span>
            {`${getHumanizedDuration(data.value)}`}
          </p>
        </div>
      </div>
    );
  }
}

CustomTooltip.propTypes = {
  payload: PropTypes.array,
  dateFormat: PropTypes.string,
  type: PropTypes.string,
};

CustomTooltip.defaultProps = {
  dateFormat: "MMM DD - YYYY, HH:mm",
  type: "general",
};

export default CustomTooltip;
