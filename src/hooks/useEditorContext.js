import { useContext } from "react";
import { EditorContext } from "State/context";

function useEditorContext() {
  return useContext(EditorContext);
}

export default useEditorContext;
