import React from "react";
import { Handle, Position, NodeProps } from "reactflow";

export function StartNode(props: NodeProps) {
  const { isConnectable } = props;
  return (
    <div className="b-startEnd-node">
      <h2>Start</h2>
      <Handle
        className="b-startEnd-node__port --right"
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </div>
  );
}
