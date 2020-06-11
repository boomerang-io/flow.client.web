import { useTracked, AppActionsTypes } from "State/reducers/app";

function useAppContext() {
  const [state, dispatch] = useTracked();
  const setTeams = (data) => dispatch({ type: AppActionsTypes.SetTeams, data });
  const setUser = (data) => dispatch({ type: AppActionsTypes.SetUser, data });
  return { state, setTeams, setUser };
}

export default useAppContext;
