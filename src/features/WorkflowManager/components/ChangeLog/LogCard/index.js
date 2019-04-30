import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "./styles.scss";

class LogCard extends Component {
  static propTypes = {
    log: PropTypes.object.isRequired
  };
  static defaultProps = {
    log: {}
  };
  render() {
    const { version, reason, date, userName } = this.props.log;
    return (
      <div className="c-worklfow-log">
        <p className="b-workflow-log__version">{version}</p>
        <p className="b-workflow-log__message">{reason}</p>
        <div className="c-workflow-log__data">
          <p className="b-workflow-log__date">{moment(date).format("YYYY-MM-DD hh:mm A")}</p>
          <p className="b-workflow-log__divider">|</p>
          <p className="b-workflow-log__user">{userName}</p>
        </div>
      </div>
    );
  }
}
export default LogCard;
