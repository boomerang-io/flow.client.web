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
    const { version, date, userName } = this.props.log;
    return (
      <div className="c-worklfow-log">
        <label className="b-workflow-log__version">{version}</label>
        <div className="c-workflow-log__data">
          <label className="b-workflow-log__date">{moment(date).format("YYYY-MM-DD hh:mm A")}</label>
          <label className="b-workflow-log__divider">|</label>
          <label className="b-workflow-log__user">{userName}</label>
        </div>
      </div>
    );
  }
}
export default LogCard;
