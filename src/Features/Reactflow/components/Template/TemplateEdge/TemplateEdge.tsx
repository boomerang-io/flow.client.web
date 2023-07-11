import React from "react";
import { EdgeProps, getBezierPath, useReactFlow, EdgeLabelRenderer } from "reactflow";
import TaskLinkExecutionConditionSwitcher from "Components/TaskLinkExecutionConditionSwitcher";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import { EXECUTION_CONDITIONS } from "Utils/taskLinkIcons";
import { markerTypes } from "Features/Reactflow/Reactflow";

// There is a base link component that we are going to want simliar functionality from
export default function TemplateEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style } = props;

  const [condition, setCondition] = React.useState(0);
  const reactFlowInstance = useReactFlow();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const mergedStyles = {
    ...style,
    stroke: "#0072c3",
    strokeWidth: "2",
  };

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={`url(#${markerTypes.templateTask}`}
        style={mergedStyles}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            fontWeight: 700,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <WorkflowCloseButton className="" onClick={() => reactFlowInstance.deleteElements({ edges: [props] })} />
          <TaskLinkExecutionConditionSwitcher
            onClick={() => setCondition((condition + 1) % 3)}
            executionCondition={EXECUTION_CONDITIONS[condition]}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
