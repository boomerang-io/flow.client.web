import React from "react";
import PropTypes from "prop-types";
import WorkflowLink from "Components/WorkflowLink";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import ExecutionConditionSwitcher from "Components/ExecutionConditionSwitcher";
//import { CheckmarkOutline16, CloseOutline16, ArrowRight16 } from "@carbon/icons-react";
import AlwaysIcon from "./assets/AlwaysIcon";
import FailureIcon from "./assets/FailureIcon";
import SuccessIcon from "./assets/SuccessIcon";
//import styles from "./TaskLink.module.scss";

export const EXECUTION_STATES = {
  SUCCESS: "success",
  FAILURE: "failure",
  ALWAYS: "always"
};

export const EXECUTION_CONDITIONS = [
  {
    Icon: SuccessIcon,
    name: EXECUTION_STATES.SUCCESS
  },
  {
    Icon: FailureIcon,
    name: EXECUTION_STATES.FAILURE
  },
  {
    Icon: AlwaysIcon,
    name: EXECUTION_STATES.ALWAYS
  }
];

TaskLinkDesigner.propTypes = {
  diagramEngine: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired
};

function TaskLinkDesigner({ diagramEngine, model, path }) {
  const [executionConditionIndex, setExecutionConditionIndex] = React.useState(
    EXECUTION_CONDITIONS.findIndex(executionCondition => executionCondition.name === model.executionCondition)
  );

  function updateExecutionState() {
    const newExecutionConditionIndex = (executionConditionIndex + 1) % EXECUTION_CONDITIONS.length;
    const executionCondition = EXECUTION_CONDITIONS[newExecutionConditionIndex];
    model.executionCondition = executionCondition.name;
    setExecutionConditionIndex(newExecutionConditionIndex);
  }

  const isModelLocked = diagramEngine.diagramModel.locked;

  return (
    <WorkflowLink diagramEngine={diagramEngine} model={model} path={path}>
      {({ halfwayPoint, handleOnDelete }) => (
        <>
          <g transform={`translate(${halfwayPoint.x - 12}, ${halfwayPoint.y - 12})`} xmlns="http://www.w3.org/2000/svg">
            <WorkflowCloseButton onClick={handleOnDelete} xmlns="http://www.w3.org/1999/xhtml" />
          </g>
          <g
            transform={`translate(${halfwayPoint.x + (isModelLocked ? -12 : 12)}, ${halfwayPoint.y - 12})`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <ExecutionConditionSwitcher
              disabled={isModelLocked}
              executionCondition={EXECUTION_CONDITIONS[executionConditionIndex]}
              kind="designer"
              onClick={updateExecutionState}
            />
            ) }}
          </g>
        </>
      )}
    </WorkflowLink>
  );
}

export default TaskLinkDesigner;
