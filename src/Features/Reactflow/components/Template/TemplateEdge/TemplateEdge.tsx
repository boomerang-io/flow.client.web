import React from "react";
import { getBezierPath, useReactFlow, EdgeLabelRenderer } from "reactflow";
import TaskLinkExecutionConditionSwitcher from "Components/TaskLinkExecutionConditionSwitcher";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import { EXECUTION_CONDITIONS } from "Utils/taskLinkIcons";
import { markerTypes } from "Features/Reactflow/Reactflow";
import { WorkflowEdge, WorkflowEdgeProps } from "Types";

export default function TemplateEdge(props: WorkflowEdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, data } = props;
  const reactFlowInstance = useReactFlow();
  const executionConditionIndex = EXECUTION_CONDITIONS.findIndex(
    (condition) => condition.name === data?.executionCondition
  );
  const condition = executionConditionIndex >= 0 ? executionConditionIndex : 0;

  const handleChangeCondition = (newCondition: number) => {
    const edges = reactFlowInstance.getEdges() as Array<WorkflowEdge>;
    const newEdges = edges.map((edge) => {
      if (edge.id === props.id) {
        return {
          ...edge,
          data: { ...edge.data, executionCondition: EXECUTION_CONDITIONS[newCondition].name },
        };
      } else {
        return edge;
      }
    }) as Array<WorkflowEdge>;

    reactFlowInstance.setEdges(newEdges);
  };

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
        markerEnd={`url(#${markerTypes.template}`}
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
            onClick={() => handleChangeCondition((condition + 1) % 3)}
            executionCondition={EXECUTION_CONDITIONS[condition]}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
