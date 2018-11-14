import React from "react";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import "./styles.scss";

const Filler = ({ taskId, index, taskName, finishPosition, totalDuration, updateActiveNode }) => {
  const colors = ["#57d785", "#95c4f3", "#e3bc13", "#fc835c", "#f7aac3"];

  const styles = {
    zIndex: 20 - index,
    backgroundColor: colors[index],
    width: `${finishPosition}%`
  };

  momentDurationFormatSetup(moment);
  const finishTime = totalDuration
    ? moment.duration((finishPosition * totalDuration) / 100, "millisecond").format("hh:mm:ss", { trim: false })
    : "";

  return (
    <div onClick={() => updateActiveNode(taskId)} className="b-time-progress-bar-filler" style={styles}>
      <div className="b-time-progress-bar-filler__time">{finishTime}</div>
      <div className="b-time-progress-bar-filler__name">{taskName}</div>
    </div>
  );
};

export default Filler;
