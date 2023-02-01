import React from "react";
import ReactFlow, {
  ReactFlowProvider,
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
  addEdge,
  Connection,
} from "reactflow";
import { ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import { ArrowRight, Check, Close } from "@carbon/react/icons";
import "reactflow/dist/style.css";
import "./styles.scss";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import WorkflowEditButton from "Components/WorkflowEditButton";

const initialNodes: Node[] = [
  {
    id: "start",
    position: { x: 200, y: 200 },
    data: { label: "start" },
    type: "start",
    sourcePosition: Position.Right,
    deletable: false,
  },
  {
    id: "2",
    position: { x: 800, y: 200 },
    data: { label: "node" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    type: "task",
  },
  {
    id: "end",
    position: { x: 1400, y: 200 },
    data: { label: "end" },
    type: "end",
    targetPosition: Position.Left,
    deletable: false,
  },
];

const initialEdges: Edge[] = [
  {
    id: "1-2",
    source: "1",
    target: "2",
    type: "task",
    data: { text: "hello" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 24,
      height: 24,
      color: "var(--cds-interactive-01)",
    },
    style: {
      stroke: "var(--cds-interactive-01)",
      strokeWidth: "2",
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

const StartNode: React.FC<NodeProps> = (props) => {
  const { isConnectable } = props;
  return (
    <div className="b-startEnd-node">
      <h2>Start</h2>
      <Handle
        className="b-startEnd-node__port --right"
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </div>
  );
};

const EndNode: React.FC<NodeProps> = (props) => {
  const { isConnectable } = props;
  return (
    <div className="b-startEnd-node">
      <Handle
        className="b-startEnd-node__port --left"
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <h2>End</h2>
    </div>
  );
};

const TaskNode: React.FC<NodeProps> = (props) => {
  const { isConnectable } = props;
  const reactFlowInstance = useReactFlow();
  return (
    <div
      style={{
        position: "relative",
        background: "white",
        color: "black",
        padding: "0.5rem",
        borderRadius: "0.25rem",
        borderColor: "var(--cds-interactive-01)",
        borderWidth: "2px",
        borderStyle: "solid",
        width: "260px",
        height: "80px",
      }}
    >
      <h2>Task node</h2>
      <div style={{ position: "absolute", top: "-0.875rem", right: "-0.875rem", display: "flex", gap: "0.25rem" }}>
        <WorkflowEditButton className={""} onClick={() => console.log("clicked")}>
          Edit
        </WorkflowEditButton>
        <WorkflowCloseButton className={""} onClick={() => reactFlowInstance.deleteElements({ nodes: [props] })}>
          Delete
        </WorkflowCloseButton>
      </div>
      <Handle
        className="b-startEnd-node__port --right"
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <Handle
        className="b-startEnd-node__port --left"
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
    </div>
  );
};

const TaskEdge: React.FC<EdgeProps> = (props: any) => {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, markerEnd, style } = props;
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [condition, setCondition] = React.useState(0);

  const reactFlowInstance = useReactFlow();

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
          <WorkflowCloseButton className="" onClick={() => reactFlowInstance.deleteElements({ edges: [props] })} />
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

const edgeTypes: EdgeTypes = {
  task: TaskEdge,
};

const nodeTypes: NodeTypes = {
  start: StartNode,
  end: EndNode,
  task: TaskNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

function Flow() {
  const [nodes, setNodes] = React.useState<Node[]>(initialNodes);
  const [edges, setEdges] = React.useState<Edge[]>(initialEdges);
  const reactFlowWrapper = React.useRef<HTMLDivElement>(null);
  const [flow, setFlow] = React.useState<ReactFlowInstance | null>(null);

  const onNodesChange = React.useCallback((changes) => setNodes(applyNodeChanges(changes, nodes)), [nodes]);
  const onEdgesChange = React.useCallback((changes) => setEdges(applyEdgeChanges(changes, edges)), [edges]);
  const onConnect = React.useCallback(
    (connection: Connection) => setEdges((edges) => addEdge({ ...connection, ...getLinkType(connection) }, edges)),
    [setEdges]
  );

  const onDragOver = React.useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = React.useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect() ?? { left: 0, top: 0 };
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = flow?.project({
        x: event.clientX - reactFlowBounds?.left,
        y: event.clientY - reactFlowBounds?.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode as any));
    },
    [flow]
  );

  if (flow) {
    const object = flow.toObject();
    console.log({ object });
  }

  return (
    <div style={{ height: "100%" }}>
      <ReactFlowProvider>
        <Sidenav />
        <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ height: "100%" }}>
          <ReactFlow
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            edgeTypes={edgeTypes}
            nodeTypes={nodeTypes}
            onConnect={onConnect}
            onInit={setFlow}
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
}

function getLinkType(connection: Connection) {
  const { source } = connection;

  if (source === "start") {
    return {
      type: "default",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 24,
        height: 24,
        color: "var(--cds-interactive-01)",
      },
      style: {
        stroke: "var(--cds-interactive-01)",
        strokeWidth: "2",
      },
    };
  }
  return {
    type: "task",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 24,
      height: 24,
      color: "var(--cds-interactive-01)",
    },
    style: {
      stroke: "var(--cds-interactive-01)",
      strokeWidth: "2",
    },
  };
}

const Sidenav = () => {
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, "start")} draggable>
        Start Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, "task")} draggable>
        Task Node
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, "end")} draggable>
        End Node
      </div>
    </aside>
  );
};

export default Flow;
