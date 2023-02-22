import React from "react";
import { Handle, Position, NodeProps } from "reactflow";

export function EndNode(props: NodeProps) {
  const { isConnectable } = props;
  return (
    <div className="b-startEnd-node">
      <Handle
        className="b-startEnd-node__port --left"
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <h2>End</h2>
    </div>
  );
}
