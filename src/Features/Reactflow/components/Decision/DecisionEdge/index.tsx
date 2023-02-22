import React from "react";
import { EdgeProps, getBezierPath, EdgeLabelRenderer, useReactFlow } from "reactflow";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import { markerTypes } from "Features/Reactflow/Reactflow";
import SwitchEdgeExecutionConditionButton from "./ExecutionConditionButton";
import ConfigureSwitchModal from "./ConfigureModal";
import { ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";

export default function SwitchEdge(props: EdgeProps) {
  // TODO: determine how to render this one or the other one
  // Figure out how the switch condition data is going to
  return <SwitchEdgeDesigner {...props} model={{}} />;
}

function SwitchEdgeDesigner(props: EdgeProps & { model: { switchCondition?: string | null } }) {
  const [config, setConfig] = React.useState({
    defaultState: props?.model.switchCondition === null ? true : false,
    isModalOpen: false,
    switchCondition: props.model.switchCondition,
  });

  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style } = props;
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
    stroke: "purple",
    strokeWidth: "2",
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
            style={{ path: "purple" }}
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
              subtitle: "Set it up the conditions",
            }}
            modalTrigger={(props) => {
              return <SwitchEdgeExecutionConditionButton onClick={props.openModal} />;
            }}
          >
            {({ closeModal }) => {
              // TODO: have these functions actually do things
              return (
                <ConfigureSwitchModal
                  closeModal={closeModal}
                  defaultState={config.defaultState}
                  onSubmit={() => console.log("save")}
                  switchCondition={config.switchCondition}
                  updateDefaultState={() => console.log("update default")}
                  updateSwitchState={() => console.log("update default")}
                />
              );
            }}
          </ComposedModal>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

const SwitchEdgeExecution: React.FC<EdgeProps> = (props: any) => {
  return <div>TODO</div>;
};
