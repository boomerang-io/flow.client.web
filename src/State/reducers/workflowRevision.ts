import { WorkflowCanvas, WorkflowCanvasState } from "Types";

//@ts-nocheck
export const RevisionActionTypes = {
  UpdateNodes: "UPDATE_NODES",
  UpdateEdges: "UPDATE_EDGES",
  Reset: "RESET",
  Set: "SET",
  UpdateNodeConfig: "UPDATE_NODE_CONFIG",
  UpdateNodeTaskVersion: "UPDATE_NODE_TASK_VERSION",
  UpdateNotes: "UPDATE_NOTES",
} as const;

type RevisionActionType = typeof RevisionActionTypes[keyof typeof RevisionActionTypes];


export function revisionReducer(state: WorkflowCanvasState, action: { data: any; type: RevisionActionType }) {
  switch (action.type) {
    case RevisionActionTypes.UpdateEdges: {
      state.hasUnsavedUpdates = true;
      state.edges = action.data
      return state;
    }
    case RevisionActionTypes.UpdateNodes: {
      state.hasUnsavedUpdates = true;
      state.nodes = action.data
      return state;
    }
    case RevisionActionTypes.UpdateNotes: {
      const { markdown } = action.data;
      state.markdown = markdown;
      state.hasUnsavedUpdates = true;
      return state;
    }
    case RevisionActionTypes.Set: {
      return action.data;
    }
    case RevisionActionTypes.Reset: {
      return action.data;
    }
    default:
      throw new Error();
  }
}

export function initRevisionReducerState(workflow: WorkflowCanvas): WorkflowCanvasState {
  return { ...workflow, hasUnsavedUpdates: false };
}
