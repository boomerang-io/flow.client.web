import React from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Edge,
  EdgeTypes,
  Node,
  MarkerType,
  ReactFlowInstance,
  applyEdgeChanges,
  applyNodeChanges,
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  Position,
  NodeTypes,
  NodeProps,
  useReactFlow,
} from "reactflow";
import { ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import "reactflow/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 200, y: 200 },
    data: { label: "start" },
    type: "input",
    sourcePosition: Position.Right,
    deletable: false,
  },
  {
    id: "2",
    position: { x: 800, y: 200 },
    data: { label: "node" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    type: "custom",
  },
  {
    id: "3",
    position: { x: 1400, y: 200 },
    data: { label: "end" },
    type: "output",
    targetPosition: Position.Left,
    deletable: false,
  },
];

const initialEdges: Edge[] = [
  {
    id: "1-2",
    source: "1",
    target: "2",
    type: "custom",
    data: { text: "hello" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 24,
      height: 24,
      color: "blue",
    },
    style: {
      stroke: "blue",
    },
  },
];

const conditions = {
  0: "Always",
  1: "Success",
  2: "Failure",
};

const conditionColor = {
  0: "black",
  1: "green",
  2: "red",
};

const CustomNode: React.FC<NodeProps> = (props) => {
  const { isConnectable } = props;
  const reactFlowInstance = useReactFlow();
  return (
    <div
      style={{ background: "black", color: "white", padding: "0.5rem", borderRadius: "0.25rem", borderColor: "none" }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: "blue",
          height: "50%",
          width: "40px",
          borderRadius: "0",
          transform: "translate(-100%, -50%)",
          left: 0,
          borderColor: "none",
        }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <h2>Custom node</h2>
      <button
        onClick={() => reactFlowInstance.deleteElements({ nodes: [props] })}
        style={{ position: "absolute", color: "white", top: -20, right: -20, background: "red", cursor: "pointer" }}
      >
        Delete
      </button>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ top: 10, background: "#555" }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  style,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [condition, setCondition] = React.useState(0);

  return (
    <>
      <path id={id} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} style={style} />
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
          <button
            style={{
              cursor: "pointer",
              color: "white",
              background: conditionColor[condition as keyof typeof conditionColor],
              padding: "0.375rem",
              borderRadius: "4px",
            }}
            onClick={() => setCondition((condition + 1) % 3)}
          >
            {conditions[condition as keyof typeof conditions]}
          </button>
          <ComposedModal
            modalTrigger={({ openModal }: any) => (
              <button
                style={{
                  cursor: "pointer",
                  color: "white",
                  background: "black",
                  padding: "0.375rem",
                  borderRadius: "4px",
                }}
                onClick={openModal}
              >
                Edit
              </button>
            )}
          >
            {() => <div>hello</div>}
          </ComposedModal>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

function Flow() {
  const [nodes, setNodes] = React.useState<Node[]>(initialNodes);
  const [edges, setEdges] = React.useState<Edge[]>(initialEdges);

  const onNodesChange = React.useCallback((changes) => setNodes(applyNodeChanges(changes, nodes)), [nodes]);
  const onEdgesChange = React.useCallback((changes) => setEdges(applyEdgeChanges(changes, edges)), [edges]);

  const [flow, setFlow] = React.useState<ReactFlowInstance | null>(null);
  if (flow) {
    const thing = flow.toObject();
    console.log(thing);
  }

  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        onInit={(flow) => setFlow(flow)}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow;
