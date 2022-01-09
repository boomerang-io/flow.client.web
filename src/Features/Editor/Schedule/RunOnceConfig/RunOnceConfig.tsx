import React from "react";
import { ScheduleUnion } from "Types";

interface RunOnceConfigProps {
  event: ScheduleUnion;
}

export default function RunOnceConfig(props: RunOnceConfigProps) {
  return <div>Run once!</div>;
}
