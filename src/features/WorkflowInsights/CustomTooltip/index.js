import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import getHumanizedDuration from "@boomerang/boomerang-utilities/lib/getHumanizedDuration";
import "./styles.scss";

class CustomTooltip extends Component {
  constructor(props) {
    super(props);

    this.renderGeneralTooltip = this.renderGeneralTooltip.bind(this);
    this.renderPieTooltip = this.renderPieTooltip.bind(this);
  }

  renderGeneralTooltip(tooltipFields) {
    return tooltipFields.map(field => {
      return field === "date" ? (
        <p className="b-tooltip--data">
          <span className="b-tooltip--field">{`${field}: `}</span>
          {`${moment(this.props.payload[0].payload[field]).format(this.props.dateFormat)}`}
        </p>
      ) : field === "duration" ? (
        <p className="b-tooltip--data">
          <span className="b-tooltip--field">{`${field}: `}</span>
          {`${getHumanizedDuration(this.props.payload[0].payload[field])}`}
        </p>
      ) : (
        <p className="b-tooltip--data">
          {" "}
          <span className="b-tooltip--field">{`${
            field === "passRate" ? "pass rate" : field === "criticalViolations" ? "critical violations" : field
          }: `}</span>
          {`${this.props.payload[0].payload[field]}`}
        </p>
      );
    });
  }
  renderPieTooltip() {
    return (
      <p className="b-tooltip--data">
        <span className="b-tooltip--field">{`${this.props.payload[0].payload["name"]}: `}</span>
        {`${this.props.payload[0].payload["value"]}`}
      </p>
    );
  }

  render() {
    const tooltipFields = this.props.payload.length > 0 ? Object.keys(this.props.payload[0].payload) : null;
    return (
      <div className="c-tooltip">
        {this.props.payload.length > 0 ? (
          <div>{this.props.type === "pie" ? this.renderPieTooltip() : this.renderGeneralTooltip(tooltipFields)}</div>
        ) : null}
      </div>
    );
  }
}

CustomTooltip.propTypes = {
  payload: PropTypes.object,
  dateFormat: PropTypes.string,
  type: PropTypes.string
};

CustomTooltip.defaultProps = {
  dateFormat: "MMM DD - YYYY, HH:mm",
  type: "general"
};

export default CustomTooltip;
