import React from "react";
import PropTypes from "prop-types";
import { useExecutionContext } from "Hooks";
import { PortWidget } from "@projectstorm/react-diagrams";
import { ExecutionStatus } from "Constants";
import cx from "classnames";
import "./styles.scss";

const StartEndNode = React.memo(function StartEndNode({ isLocked, node }) {
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
          workflowExecution.status === ExecutionStatus.InProgress,
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
});

StartEndNode.propTypes = {
  isLocked: PropTypes.bool,
  node: PropTypes.object.isRequired,
};

export default StartEndNode;
