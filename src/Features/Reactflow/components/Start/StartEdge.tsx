import React from "react";
import { getBezierPath, useReactFlow, EdgeLabelRenderer } from "reactflow";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import { markerTypes } from "Features/Reactflow/Reactflow";
import { WorkflowEdgeProps } from "Types";
import { useEditorContext } from "Hooks";

// There is a base link component that we are going to want simliar functionality from
export function StartEdge(props: WorkflowEdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style } = props;
  const { mode } = useEditorContext();
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
          {mode === "editor" ? (
            <WorkflowCloseButton className="" onClick={() => reactFlowInstance.deleteElements({ edges: [props] })} />
          ) : null}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
