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

  return (
    <WorkflowLink diagramEngine={diagramEngine} model={model} path={path}>
      {({ halfwayPoint, handleOnDelete }) => (
        <>
          <g transform={`translate(${halfwayPoint.x - 12}, ${halfwayPoint.y - 12})`}>
            <WorkflowCloseButton onClick={handleOnDelete} />
          </g>
          <g transform={`translate(${halfwayPoint.x + 16}, ${halfwayPoint.y - 12})`}>
            <TaskLinkExecutionConditionSwitcher
              disabled={false}
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
