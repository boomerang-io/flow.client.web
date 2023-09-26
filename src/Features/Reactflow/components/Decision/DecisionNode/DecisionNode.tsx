import React from "react";
import { TemplateNode } from "../../Template";
import { WorkflowNodeProps } from "Types";
import styles from "./DecisionNode.module.scss";

export default function DecisionsNode(props: WorkflowNodeProps) {
  // use context to determine state of diagram
  // render the correct component based on the mode of the diagram
  return <DecisionNodeDesigner {...props} />;
}

function DecisionNodeDesigner(props: WorkflowNodeProps) {
  return <TemplateNode {...props} className={styles.node} />;
}
