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
  XYPosition,
} from "reactflow";
import "reactflow/dist/style.css";
import "./styles.scss";
import { NodeType, WorkflowDagEngineMode } from "Constants";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import WorkflowEditButton from "Components/WorkflowEditButton";
import * as GraphComps from "./components";
import TaskLinkExecutionConditionSwitcher from "Components/TaskLinkExecutionConditionSwitcher";
import { EXECUTION_CONDITIONS } from "Utils/taskLinkIcons";
import { TaskTemplate } from "Types";

type NodeTypeValues = typeof NodeType[keyof typeof NodeType];

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

const TaskNode: React.FC<NodeProps> = (props) => {
  // TODO: this along w/ the use of `reactFlowInstance.deleteElements` should probably be a shared hook that can be reused by
  // nodes
  console.log({ data: props.data })
  const reactFlowInstance = useReactFlow();
  const { isConnectable, type } = props;
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
      <h2>{props.data?.task?.displayName ?? "Task"}</h2>
      <div style={{ position: "absolute", top: "-0.875rem", right: "-0.875rem", display: "flex", gap: "0.375rem" }}>
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
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, style } = props;
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

  const [condition, setCondition] = React.useState(0);
  const reactFlowInstance = useReactFlow();

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={`url(#${markerTypes.task}`}
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

function CustomEdgeArrow({ id, color }: any) {
  return (
    <marker
      id={id}
      markerWidth="16"
      markerHeight="16"
      viewBox="-10 -10 20 20"
      markerUnits="strokeWidth"
      orient="auto-start-reverse"
      refX="0"
      refY="0"
    >
      <polyline
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
        fill={color}
        points="-5,-4 0,0 -5,4 -5,-4"
      ></polyline>
    </marker>
  );
}

interface MarkerDefinitionsProps {
  children: React.ReactNode;
}

export function MarkerDefinition({ children }: MarkerDefinitionsProps) {
  return (
    <svg>
      <defs>{children}</defs>
    </svg>
  );
}

export const markerTypes: { [K in NodeTypeValues]: string } = {
  approval: "task-marker",
  acquirelock: "task-marker",
  decision: "decision-marker",
  end: "task-marker",
  eventwait: "task-marker",
  custom: "task-marker",
  manual: "task-marker",
  releaselock: "task-marker",
  runscheduledworkflow: "task-marker",
  runworkflow: "task-marker",
  script: "task-marker",
  setwfproperty: "task-marker",
  setwfstatus: "task-marker",
  start: "task-marker",
  task: "task-marker",
  template: "task-marker",
};

const edgeTypes: EdgeTypes = {
  task: TaskEdge,
  decision: GraphComps.DecisionEdge,
};

// Replace all of the functionality for the utils/dag/WorkflowDagEngine constructor, registerNodeFactory and factories
const nodeTypes: NodeTypes = {
  start: GraphComps.StartNode,
  end: GraphComps.EndNode,
  task: TaskNode,
  template: TaskNode,
  approval: TaskNode,
  custom: GraphComps.CustomNode,
  decision: GraphComps.DecisionNode,
  eventwait: GraphComps.WaitNode,
  manual: GraphComps.ManualNode,
  acquirelock: GraphComps.AcquireLockNode,
  releaselock: GraphComps.ReleaseLockNode,
  runscheduledworkflow: GraphComps.RunScheduledWorkflowNode,
  runworkflow: GraphComps.RunWorkflowNode,
  script: GraphComps.ScriptNode,
  setwfproperty: GraphComps.SetPropertyNode,
  setwfstatus: GraphComps.SetStatusNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const initialNodes: Node[] = [
  {
    id: "start",
    position: { x: 200, y: 200 },
    type: "start",
    data: {},
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
    id: "3",
    position: { x: 800, y: 400 },
    data: { label: "node" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    type: "decision",
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

function FlowDiagram(props: {
  mode: typeof WorkflowDagEngineMode[keyof typeof WorkflowDagEngineMode];
  diagram: { nodes: Node[]; edges: Edge[] };
}) {
  /**
   * Set up state and refs
   */
  const reactFlowWrapper = React.useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = React.useState<Node[]>(initialNodes);
  const [edges, setEdges] = React.useState<Edge[]>(initialEdges);
  const [flow, setFlow] = React.useState<ReactFlowInstance | null>(null);

  /**
   * Handle changes of nodes and eges
   */
  const onNodesChange = React.useCallback((changes) => setNodes(applyNodeChanges(changes, nodes)), [nodes]);
  const onEdgesChange = React.useCallback((changes) => setEdges(applyEdgeChanges(changes, edges)), [edges]);
  const onConnect = React.useCallback(
    (connection: Connection) =>
      setEdges((edges) => addEdge({ ...connection, ...getLinkType(connection, nodes) }, edges)),
    [setEdges, nodes]
  );

  /**
   * Handle drag action w/ drag and drop
   */
  const onDragOver = React.useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  /**
   * Handle drop action w/ drag and drop
   */
  const onDrop = React.useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect() ?? { left: 0, top: 0 };
      const taskString = event.dataTransfer.getData("application/reactflow") as string
      const task = JSON.parse(taskString) as TaskTemplate;

      // check if the dropped element is valid
      if (typeof task.type === "undefined" || !task) {
        return;
      }

      const position = flow?.project({
        x: event.clientX - reactFlowBounds?.left,
        y: event.clientY - reactFlowBounds?.top,
      }) as XYPosition

      const newNode: Node = {
        id: getId(),
        type: task.type,
        position,
        data: { label: `${task.type} node`, task },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [flow]
  );

  const isDisabled = props.mode === WorkflowDagEngineMode.Viewer;
  console.log({ nodes });

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ReactFlowProvider>
        {/* <Sidenav /> */}
        <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ height: "100%", width: "100%" }}>
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
            nodesDraggable={!isDisabled}
            nodesConnectable={!isDisabled}
            elementsSelectable={!isDisabled}
          >
            <MarkerDefinition>
              <CustomEdgeArrow id={markerTypes.decision} color="purple" />
              <CustomEdgeArrow id={markerTypes.task} color="#0072c3" />
            </MarkerDefinition>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
}

function getLinkType(connection: Connection, nodes: Node[]) {
  const { source } = connection;
  const node = nodes.find((node) => node.id === source) as Node;

  if (node.type === "decision") {
    return {
      type: "decision",
    };
  }

  return {
    type: "task",
  };
}

// const Sidenav = () => {
//   const onDragStart = (event: any, nodeType: any) => {
//     event.dataTransfer.setData("application/reactflow", nodeType);
//     event.dataTransfer.effectAllowed = "move";
//   };

//   return (
//     <aside style={{ background: "white", padding: "1rem", display: "flex", gap: "1rem" }}>
//       <div className="description">You can drag these nodes to the pane on the right.</div>
//       <div className="dndnode input" onDragStart={(event) => onDragStart(event, "start")} draggable>
//         Start Node
//       </div>
//       <div className="dndnode" onDragStart={(event) => onDragStart(event, "acquirelock")} draggable>
//         Acquire Lock
//       </div>
//       <div className="dndnode" onDragStart={(event) => onDragStart(event, "approval")} draggable>
//         Approval
//       </div>
//       <div className="dndnode" onDragStart={(event) => onDragStart(event, "releaselock")} draggable>
//         Release Lock
//       </div>
//       <div className="dndnode" onDragStart={(event) => onDragStart(event, "task")} draggable>
//         Task Node
//       </div>
//       <div className="dndnode" onDragStart={(event) => onDragStart(event, "decision")} draggable>
//         Decision Node
//       </div>
//       <div className="dndnode" onDragStart={(event) => onDragStart(event, "setwfproperty")} draggable>
//         Set Property Node
//       </div>
//       <div className="dndnode" onDragStart={(event) => onDragStart(event, "custom")} draggable>
//         Custom Node
//       </div>
//       <div className="dndnode output" onDragStart={(event) => onDragStart(event, "end")} draggable>
//         End Node
//       </div>
//     </aside>
//   );
// };

export default FlowDiagram;
