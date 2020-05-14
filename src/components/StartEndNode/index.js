import React from "react";
import PropTypes from "prop-types";
import { useExecutionContext } from "Hooks";
import { PortWidget } from "@projectstorm/react-diagrams";
import { ACTIVITY_STATUSES } from "Constants/activityStatuses";
import cx from "classnames";
import "./styles.scss";

StartEndNode.propTypes = {
  isLocked: PropTypes.bool,
  node: PropTypes.object.isRequired
};

export default function StartEndNode({ isLocked, node }) {
  const { workflowExecution } = useExecutionContext();
  const { passedName } = node;

  return (
    <div
      className={cx("b-startEnd-node", {
        "--locked": isLocked,
        "--executionInProgress":
          isLocked &&
          workflowExecution &&
          workflowExecution.status &&
          workflowExecution.status === ACTIVITY_STATUSES.IN_PROGRESS
      })}
    >
      <div className="b-startEnd-node__title"> {passedName} </div>
      {passedName === "End" ? (
        <PortWidget
          className={cx("b-startEnd-node__port", "--left", { "--locked": isLocked })}
          name="left"
          node={node}
        />
      ) : (
        <PortWidget
          className={cx("b-startEnd-node__port", "--right", { "--locked": isLocked })}
          name="right"
          node={node}
        />
      )}
    </div>
  );
}
