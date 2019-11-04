import React from "react";
import PropTypes from "prop-types";
import WorkflowLink from "Components/WorkflowLink";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import TaskLinkExecutionConditionSwitcher from "Components/TaskLinkExecutionConditionSwitcher";
import { EXECUTION_CONDITIONS } from "Utilities/taskLinkIcons";

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
            transform={`translate(${halfwayPoint.x + (isModelLocked ? -12 : 16)}, ${halfwayPoint.y - 12})`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <TaskLinkExecutionConditionSwitcher
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
