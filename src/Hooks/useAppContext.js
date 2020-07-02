import { useContext } from "react";
import { AppContext } from "State/context";

function useAppContext() {
  return useContext(AppContext);
}

export default useAppContext;
