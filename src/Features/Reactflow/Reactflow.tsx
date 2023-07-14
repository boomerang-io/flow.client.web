import React from "react";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  Edge,
  EdgeTypes,
  Node,
  ReactFlowInstance,
  applyEdgeChanges,
  applyNodeChanges,
  NodeTypes,
  addEdge,
  Connection,
  XYPosition,
} from "reactflow";
import "reactflow/dist/style.css";
import "./styles.scss";
import { NodeType, WorkflowDagEngineMode } from "Constants";
import * as GraphComps from "./components";
import { TaskTemplate } from "Types";
import { current } from "immer";

type NodeTypeValues = typeof NodeType[keyof typeof NodeType];
type WorkflowEngineMode = typeof WorkflowDagEngineMode[keyof typeof WorkflowDagEngineMode];

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
  custom: "task-marker",
  decision: "decision-marker",
  end: "task-marker",
  eventwait: "task-marker",
  generic: "task-marker",
  manual: "task-marker",
  releaselock: "task-marker",
  runscheduledworkflow: "task-marker",
  runworkflow: "task-marker",
  script: "task-marker",
  setwfproperty: "task-marker",
  setwfstatus: "task-marker",
  template: "task-marker",
  start: "task-marker",
  sleep: "task-marker"
};

const edgeTypes: EdgeTypes = {
  template: GraphComps.TemplateEdge,
  decision: GraphComps.DecisionEdge,
};

// Replace all of the functionality for the utils/dag/WorkflowDagEngine constructor, registerNodeFactory and factories
const nodeTypes: { [K in NodeTypeValues]: string } = {
  acquirelock: GraphComps.AcquireLockNode,
  start: GraphComps.StartNode,
  template: GraphComps.TemplateNode,
  approval: GraphComps.TemplateNode,
  custom: GraphComps.CustomNode,
  decision: GraphComps.DecisionNode,
  end: GraphComps.EndNode,
  eventwait: GraphComps.WaitNode,
  generic: GraphComps.TemplateNode,
  manual: GraphComps.ManualNode,
  releaselock: GraphComps.ReleaseLockNode,
  runscheduledworkflow: GraphComps.RunScheduledWorkflowNode,
  runworkflow: GraphComps.RunWorkflowNode,
  script: GraphComps.ScriptNode,
  setwfproperty: GraphComps.SetPropertyNode,
  setwfstatus: GraphComps.SetStatusNode,
} as NodeTypes

let id = 0;
const getId = () => `dndnode_${id++}`;

interface FlowDiagramProps {
  mode: WorkflowEngineMode,
  diagram: { nodes: Node[]; edges: Edge[] };
}

function FlowDiagram(props: FlowDiagramProps) {
  /**
   * Set up state and refs
   */
  const reactFlowWrapper = React.useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = React.useState<Node[]>(props.diagram.nodes);
  const [edges, setEdges] = React.useState<Edge[]>(props.diagram.edges);
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
        x: event.clientX - reactFlowBounds?.left - 75,
        y: event.clientY - reactFlowBounds?.top - 25,
      }) as XYPosition


      // TODO: clean this up - determines how to give the task template a unique name
      const numTemplateRefInstances = nodes.reduce((prev, currentValue) => {
        if (currentValue.data.templateRef === task.name) {
          prev += 1
        }
        return prev
      }, 0)

      const taskName = numTemplateRefInstances ? `${task.displayName} ${numTemplateRefInstances + 1}` : task.displayName
      const newNode: Node = {
        id: getId(),
        type: task.type,
        position,
        data: { name: taskName, templateRef: task.name, templateVersion: task.version, templateUpgradesAvailable: false, params: [] },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [flow, nodes]
  );

  const isDisabled = props.mode === WorkflowDagEngineMode.Viewer;

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ height: "100%", width: "100%" }}>
          <ReactFlow
            fitView
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
              <CustomEdgeArrow id={markerTypes.template} color="#0072c3" />
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
    type: "template",
  };
}

export default FlowDiagram;
