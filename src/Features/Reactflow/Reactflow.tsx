import React from "react";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  ControlButton,
  Edge,
  Node,
  ReactFlowInstance,
  addEdge,
  Connection,
  XYPosition,
  NodeProps,
  EdgeProps,
  useEdgesState,
  useNodesState,
} from "reactflow";
import dagre from "@dagrejs/dagre";
import { WorkflowEngineMode } from "Constants";
import * as GraphComps from "./components";
import { WorkflowEngineModeType, NodeTypeType, TaskTemplate, WorkflowNodeData } from "Types";
import "reactflow/dist/style.css";
import "./styles.scss";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

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
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
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

export const markerTypes: { [K in NodeTypeType]: string } = {
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
  sleep: "task-marker",
};

const edgeTypes: { [K in NodeTypeType]: React.FC<EdgeProps> } = {
  acquirelock: GraphComps.TemplateEdge,
  approval: GraphComps.TemplateEdge,
  custom: GraphComps.TemplateEdge,
  decision: GraphComps.DecisionEdge,
  end: GraphComps.TemplateEdge,
  eventwait: GraphComps.TemplateEdge,
  generic: GraphComps.TemplateEdge,
  manual: GraphComps.TemplateEdge,
  releaselock: GraphComps.TemplateEdge,
  runscheduledworkflow: GraphComps.TemplateEdge,
  runworkflow: GraphComps.TemplateEdge,
  script: GraphComps.TemplateEdge,
  setwfproperty: GraphComps.TemplateEdge,
  setwfstatus: GraphComps.TemplateEdge,
  start: GraphComps.TemplateEdge,
  template: GraphComps.TemplateEdge,
  sleep: GraphComps.TemplateEdge,
};

const nodeTypes: { [K in NodeTypeType]: React.FC<NodeProps> } = {
  acquirelock: GraphComps.TemplateNode,
  approval: GraphComps.TemplateNode,
  custom: GraphComps.CustomNode,
  decision: GraphComps.DecisionNode,
  end: GraphComps.EndNode,
  eventwait: GraphComps.TemplateNode,
  generic: GraphComps.TemplateNode,
  manual: GraphComps.TemplateNode,
  releaselock: GraphComps.TemplateNode,
  runscheduledworkflow: GraphComps.RunScheduledWorkflowNode,
  runworkflow: GraphComps.RunWorkflowNode,
  script: GraphComps.ScriptNode,
  setwfproperty: GraphComps.TemplateNode,
  setwfstatus: GraphComps.TemplateNode,
  start: GraphComps.StartNode,
  template: GraphComps.TemplateNode,
  sleep: GraphComps.TemplateNode,
};

interface FlowDiagramProps {
  mode: WorkflowEngineModeType;
  nodes?: Node[];
  edges?: Edge[];
  setWorkflow?: React.Dispatch<React.SetStateAction<ReactFlowInstance | null>>;
}

function getLayoutedElements(nodes: any, edges: any) {
  dagreGraph.setGraph({ rankdir: "LR" });

  nodes.forEach((node) => {
    if (node.type === "start" || node.type === "end") {
      dagreGraph.setNode(node.id, { width: 260, height: 80 });
    } else {
      dagreGraph.setNode(node.id, { width: 340, height: 80 });
    }
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = "left";
    node.sourcePosition = "right";

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    if (node.type === "start" || node.type === "end") {
      node.position = {
        x: nodeWithPosition.x - 144 / 2,
        y: nodeWithPosition.y - 80 / 2,
      };
    } else {
      node.position = {
        x: nodeWithPosition.x - 240 / 2,
        y: nodeWithPosition.y - 80 / 2,
      };
    }

    return node;
  });

  return { nodes, edges };
}

function FlowDiagram(props: FlowDiagramProps) {
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(props.nodes, props.edges);
  const { setWorkflow } = props;
  /**
   * Set up state and refs
   */
  const reactFlowWrapper = React.useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNodeData>(layoutedNodes ?? []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges ?? []);
  const [flow, setFlow] = React.useState<ReactFlowInstance | null>(null);

  // Set workflow in parent
  React.useEffect(() => {
    if (setWorkflow && flow) {
      setWorkflow(flow);
    }
  }, [flow, setWorkflow]);

  /**
   * Handle changes of nodes and eges
   */
  const onConnect = React.useCallback(
    (connection: Connection) =>
      setEdges((edges) => addEdge({ ...connection, ...getLinkType(connection, nodes) }, edges)),
    [setEdges, nodes]
  );

  const onLayout = React.useCallback(
    (direction) => {
      console.log("called");
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges, setEdges, setNodes]
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
      const taskString = event.dataTransfer.getData("application/reactflow") as string;
      const task = JSON.parse(taskString) as TaskTemplate;

      // check if the dropped element is valid
      if (typeof task.type === "undefined" || !task) {
        return;
      }

      const position = flow?.project({
        x: event.clientX - reactFlowBounds?.left - 75,
        y: event.clientY - reactFlowBounds?.top - 25,
      }) as XYPosition;

      // TODO: clean this up - determines how to give the task template a unique name
      const numTemplateRefInstances = nodes.reduce((accum, currentNode) => {
        if (currentNode.data.templateRef === task.name) {
          accum += 1;
        }
        return accum;
      }, 0);

      const taskName = numTemplateRefInstances
        ? `${task.displayName} ${numTemplateRefInstances + 1}`
        : task.displayName;

      const newNode: Node = {
        id: taskName,
        type: task.type,
        position,
        data: {
          name: taskName,
          templateRef: task.name,
          templateVersion: task.version,
          templateUpgradesAvailable: false,
          params: [],
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [flow, nodes]
  );

  const isDisabled = props.mode === WorkflowEngineMode.Viewer;
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ height: "100%", width: "100%" }}>
          <ReactFlow
            fitView
            edges={edges}
            edgeTypes={edgeTypes}
            elementsSelectable={!isDisabled}
            nodesConnectable={!isDisabled}
            nodes={nodes}
            nodesDraggable={!isDisabled}
            nodeTypes={nodeTypes}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onEdgesChange={onEdgesChange}
            onNodesChange={onNodesChange}
            onInit={setFlow}
            proOptions={{ hideAttribution: true }}
          >
            <MarkerDefinition>
              <CustomEdgeArrow id={markerTypes.decision} color="purple" />
              <CustomEdgeArrow id={markerTypes.template} color="#0072c3" />
            </MarkerDefinition>
            <Background />
            <Controls showInteractive={false}>
              <ControlButton onClick={onLayout} title="auto-layout">
                <div>L</div>
              </ControlButton>
            </Controls>
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
}

function getLinkType(connection: Connection, nodes: Node[]) {
  const { source } = connection;
  const node = nodes.find((node) => node.id === source) as Node;
  return { type: node.type };
}

export default FlowDiagram;
