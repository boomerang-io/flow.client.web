import React from "react";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import "./styles.scss";

const Filler = ({ index, finishPosition, totalDuration }) => {
  const colors = ["#57d785", "#95c4f3", "#e3bc13", "#fc835c", "#f7aac3"];

  const styles = {
    zIndex: 20 - index,
    backgroundColor: colors[index],
    width: `${finishPosition}%`
  }

  momentDurationFormatSetup(moment);
  const finishTime = moment.duration((finishPosition * totalDuration / 100), "millisecond").format("hh:mm:ss", { trim: false });

  return (
    <div className="b-time-progress-bar-filler" style={styles}>
      <div className="b-time-progress-bar-filler__time">{finishTime}</div>
    </div>
  );
};

export default Filler;