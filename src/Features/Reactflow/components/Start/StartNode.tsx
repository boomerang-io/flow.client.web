import React from "react";
import { Connection, Handle, Position, NodeProps } from "reactflow";

export function StartNode(props: NodeProps) {
  const { isConnectable } = props;
  return (
    <div className="b-startEnd-node">
      <h2>Start</h2>
      <Handle
        className="b-startEnd-node__port --right"
        position={Position.Right}
        isConnectable={isConnectable}
        isValidConnection={isValidHandle}
        type="source"
      />
    </div>
  );
}

function isValidHandle(connection: Connection) {
  return connection.source !== connection.target;
}
