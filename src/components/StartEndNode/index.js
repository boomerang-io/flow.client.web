import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { PortWidget } from "@projectstorm/react-diagrams";
import { ACTIVITY_STATUSES } from "Constants/activityStatuses";
import cx from "classnames";
import "./styles.scss";

class StartEndNode extends Component {
  static propTypes = {
    isLocked: PropTypes.bool,
    node: PropTypes.object.isRequired,
    workflowExecution: PropTypes.object
  };

  render() {
    const {
      isLocked,
      workflowExecution,
      node: { passedName }
    } = this.props;

    return (
      <div
        className={cx("b-startEnd-node", {
          "--locked": isLocked,
          "--executionInProgress": isLocked && workflowExecution.data.status === ACTIVITY_STATUSES.IN_PROGRESS
        })}
      >
        <div className="b-startEnd-node__title"> {passedName} </div>
        {passedName === "End" ? (
          <PortWidget
            className={cx("b-startEnd-node__port", "--left", { "--locked": isLocked })}
            name="left"
            node={this.props.node}
          />
        ) : (
          <PortWidget
            className={cx("b-startEnd-node__port", "--right", { "--locked": isLocked })}
            name="right"
            node={this.props.node}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    workflowExecution: state.workflowExecution
  };
};

export default connect(mapStateToProps)(StartEndNode);
