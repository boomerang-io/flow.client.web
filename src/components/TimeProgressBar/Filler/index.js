import React from "react";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { ACTIVITY_STATUSES_TO_TEXT } from "Constants/activityStatuses";
import getHumanizedDuration from "@boomerang/boomerang-utilities/lib/getHumanizedDuration";
import "./styles.scss";

const Filler = ({
  taskId,
  index,
  taskName,
  finishPosition,
  totalDuration,
  updateActiveNode,
  status,
  currentDuration
}) => {
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
      <div className="c-time-progress-bar-filler__info">
        <div className="c-time-progress-bar-filler__infos">
          <label className="b-time-progress-bar-filler__label">Task name:</label>
          <label className="b-time-progress-bar-filler__label">Duration:</label>
          <label className="b-time-progress-bar-filler__label">Status:</label>
        </div>
        <div className="c-time-progress-bar-filler__infos">
          <label className="b-time-progress-bar-filler__info">{taskName}</label>
          <label className="b-time-progress-bar-filler__info">
            {getHumanizedDuration(parseInt(currentDuration / 1000, 10))}
          </label>
          <label className="b-time-progress-bar-filler__info">{ACTIVITY_STATUSES_TO_TEXT[status]}</label>
        </div>
      </div>
    </div>
  );
};

export default Filler;
