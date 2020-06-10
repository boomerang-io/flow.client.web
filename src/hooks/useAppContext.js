import { useTracked } from "State/reducers/app";

function useAppContext() {
  const [state, dispatch] = useTracked();
  return { ...state, dispatch };
}

export default useAppContext;
