import { useContext } from "react";
import { EditorContext } from "State/context";

function useEditorContext() {
  const editorContext = useContext(EditorContext);
  if (!editorContext) throw new Error("useContext must be inside a Provider with a value");
  return editorContext;
}

export default useEditorContext;
