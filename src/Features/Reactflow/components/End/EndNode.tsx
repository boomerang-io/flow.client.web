import React from "react";
import { Connection, Handle, Position, NodeProps } from "reactflow";

export default function EndNode(props: NodeProps) {
  const { isConnectable } = props;
  return (
    <div className="b-startEnd-node">
      <Handle
        className="b-startEnd-node__port --left"
        isConnectable={isConnectable}
        isValidConnection={isValidHandle}
        position={Position.Left}
        type="target"
      />
      <h2>End</h2>
    </div>
  );
}
function isValidHandle(connection: Connection) {
  return connection.source !== connection.target;
}
