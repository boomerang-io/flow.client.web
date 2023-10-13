import React from "react";
import { getBezierPath, EdgeLabelRenderer, useReactFlow } from "reactflow";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import { markerTypes } from "Features/Reactflow/Reactflow";
import ExecutionConditionButton from "./ExecutionConditionButton";
import ConfigureSwitchModal from "./ConfigureModal";
import { ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import { WorkflowEdge, WorkflowEdgeProps } from "Types";
import { useEditorContext } from "Hooks";

export default function SwitchEdge(props: WorkflowEdgeProps) {
  // TODO: determine how to render this one or the other one
  // Figure out how the switch condition data is going to
  return <SwitchEdgeDesigner {...props} />;
}

function SwitchEdgeDesigner(props: WorkflowEdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, data } = props;
  const { mode } = useEditorContext();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const reactFlowInstance = useReactFlow();

  const mergedStyles = {
    ...style,
    stroke: "var(--flow-switch-primary)",
    strokeWidth: "2",
  };

  const handleChangeCondition = (decisionCondition: string) => {
    const edges = reactFlowInstance.getEdges() as Array<WorkflowEdge>;
    const newEdges = edges.map((edge) => {
      if (edge.id === props.id) {
        return {
          ...edge,
          data: { ...edge.data, decisionCondition },
        };
      } else {
        return edge;
      }
    }) as Array<WorkflowEdge>;

    reactFlowInstance.setEdges(newEdges);
  };

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={`url(#${markerTypes.decision}`}
        style={mergedStyles}
      />
      <EdgeLabelRenderer>
        {mode === "editor" ? (
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
            <WorkflowCloseButton
              style={{ path: "var(--flow-switch-primary)" }}
              className=""
              onClick={() => reactFlowInstance.deleteElements({ edges: [props] })}
            />
            <ComposedModal
              confirmModalProps={{
                title: "Are you sure?",
                children: "Your changes will not be saved",
              }}
              modalHeaderProps={{
                title: "Switch",
                subtitle: "Set up the conditions",
              }}
              modalTrigger={(props) => {
                return <ExecutionConditionButton onClick={props.openModal} inputText={data?.decisionCondition} />;
              }}
            >
              {({ closeModal }) => {
                return (
                  <ConfigureSwitchModal
                    closeModal={closeModal}
                    decisionCondition={data?.decisionCondition}
                    onUpdate={handleChangeCondition}
                  />
                );
              }}
            </ComposedModal>
          </div>
        ) : null}
      </EdgeLabelRenderer>
    </>
  );
}
