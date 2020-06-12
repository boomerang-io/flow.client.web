import { useTracked, AppActionsTypes } from "State/reducers/editor";

function useWorkflowContext() {
  const [state, dispatch] = useTracked();
  const setRevisionDispatch = (data) => dispatch({ type: AppActionsTypes.SetRevisionDispatch, data });
  const setRevisionState = (data) => dispatch({ type: AppActionsTypes.SetRevisionState, data });
  const setRevisionQuery = (data) => dispatch({ type: AppActionsTypes.SetRevisionQuery, data });
  const setSummaryState = (data) => dispatch({ type: AppActionsTypes.SetSummaryState, data });
  const setTaskTemplates = (data) => dispatch({ type: AppActionsTypes.SetTaskTemplates, data });
  return { state, setRevisionDispatch, setRevisionState, setRevisionQuery, setSummaryState, setTaskTemplates };
}

export default useWorkflowContext;