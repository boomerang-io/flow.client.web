export const RevisionActionTypes = {
  AddNode: "ADD_NODE",
  DeleteNode: "DELETE_NODE",
  Reset: "RESET",
  Set: "SET",
  UpdateNodeConfig: "UPDATE_NODE_CONFIG",
  UpdateNodeTaskVersion: "UPDATE_NODE_TASK_VERSION",
};

export function revisionReducer(state, action) {
  switch (action.type) {
    case RevisionActionTypes.AddNode: {
      const { data } = action;
      state.hasUnsavedUpdates = true;
      state.config[data.nodeId] = data;
      return state;
    }
    case RevisionActionTypes.DeleteNode: {
      let { nodeId } = action.data;
      delete state.config[nodeId];
      state.dag.nodes = state.dag?.nodes?.filter((node) => node.nodeId !== nodeId) ?? [];
      state.hasUnsavedUpdates = true;
      return state;
    }
    case RevisionActionTypes.UpdateNodeConfig: {
      const { nodeId, inputs } = action.data;
      state.config[nodeId].inputs = { ...state.config[nodeId].inputs, ...inputs };
      state.hasUnsavedUpdates = true;
      return state;
    }
    case RevisionActionTypes.UpdateNodeTaskVersion: {
      const { nodeId, inputs, version } = action.data;
      state.dag.nodes.find((node) => node.nodeId === nodeId).templateUpgradeAvailable = false;
      state.config[nodeId].taskVersion = version;
      state.config[nodeId].inputs = { ...state.config[nodeId].inputs, ...inputs };
      state.hasUnsavedUpdates = true;
      return state;
    }
    case RevisionActionTypes.Set: {
      return initRevisionReducerState(action.data);
    }
    case RevisionActionTypes.Reset: {
      return initRevisionReducerState(action.data);
    }
    default:
      throw new Error();
  }
}

export function initRevisionReducerState(revisionData) {
  if (revisionData) {
    const { config, ...rest } = revisionData;
    const normalizedNodesObj = {};
    config.nodes.forEach((node) => {
      normalizedNodesObj[node.nodeId] = node;
    });

    return { ...rest, config: normalizedNodesObj };
  }
  return {};
}
