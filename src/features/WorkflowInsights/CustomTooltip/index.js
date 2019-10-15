import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import getHumanizedDuration from "@boomerang/boomerang-utilities/lib/getHumanizedDuration";
import styles from "./customTooltip.module.scss";

class CustomTooltip extends Component {
  renderGeneralTooltip = tooltipFields => {
    return tooltipFields.map((field, index) => {
      return field === "date" ? (
        <p key={`${field}-${index}`} className={styles.data}>
          <span className={styles.field}>{`${field}: `}</span>
          {`${moment(this.props.payload[0].payload[field]).format(this.props.dateFormat)}`}
        </p>
      ) : field === "duration" ? (
        <p key={`${field}-${index}`} className={styles.data}>
          <span className={styles.field}>{`${field}: `}</span>
          {`${getHumanizedDuration(this.props.payload[0].payload[field])}`}
        </p>
      ) : (
        <p key={`${field}-${index}`} className={styles.data}>
          {" "}
          <span className={styles.field}>{`${
            field === "passRate" ? "pass rate" : field === "criticalViolations" ? "critical violations" : field
          }: `}</span>
          {`${this.props.payload[0].payload[field]}`}
        </p>
      );
    });
  };
  renderPieTooltip = () => {
    return (
      <p className={styles.data}>
        <span className={styles.field}>{`${this.props.payload[0].payload["name"]}: `}</span>
        {`${this.props.payload[0].payload["value"]}`}
      </p>
    );
  };

  render() {
    const tooltipFields = this.props.payload.length > 0 ? Object.keys(this.props.payload[0].payload) : null;
    return (
      <div className={styles.container}>
        {this.props.payload.length > 0 ? (
          <div>{this.props.type === "pie" ? this.renderPieTooltip() : this.renderGeneralTooltip(tooltipFields)}</div>
        ) : null}
      </div>
    );
  }
}

CustomTooltip.propTypes = {
  payload: PropTypes.array,
  dateFormat: PropTypes.string,
  type: PropTypes.string
};

CustomTooltip.defaultProps = {
  dateFormat: "MMM DD - YYYY, HH:mm",
  type: "general"
};

export default CustomTooltip;
