import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import moment from "moment";
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import { ACTIVITY_STATUSES_TO_TEXT } from "Constants/activityStatuses";
import getHumanizedDuration from "@boomerang/boomerang-utilities/lib/getHumanizedDuration";
import "./styles.scss";

Filler.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  finishTime: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  isFirstTask: PropTypes.bool,
  isLastTask: PropTypes.bool,
  percentOfTotal: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  taskId: PropTypes.string.isRequired,
  taskName: PropTypes.string.isRequired,
  updateActiveNode: PropTypes.func.isRequired
};

function Filler({
  backgroundColor,
  duration,
  finishTime,
  id,
  isFirstTask, //TODO: for styling
  isLastTask, //TODO
  percentOfTotal,
  status,
  taskId,
  taskName,
  updateActiveNode
}) {
  const styles = {
    backgroundColor: backgroundColor,
    width: `${percentOfTotal}%`
  };

  const finishTimeFormatted = moment.unix(finishTime / 1000).format("hh:mm:ss a", { trim: false });
  return (
    <>
      <div
        onClick={() => updateActiveNode(taskId)}
        data-tip
        data-for={id}
        className={classnames("b-time-progress-bar-filler", { "--first": isFirstTask, "--last": isLastTask })}
        style={styles}
      >
        {percentOfTotal > 5 && <div className="b-time-progress-bar-filler__time">{finishTimeFormatted}</div>}
      </div>

      <Tooltip id={id} theme="bmrg-white" place="bottom">
        <div className="c-time-progress-bar-filler-info">
          <div className="b-time-progress-bar-filler-info">
            <label className="b-time-progress-bar-filler-info__label">Task name:</label>
            <label className="b-time-progress-bar-filler-info__label">Duration:</label>
            <label className="b-time-progress-bar-filler-info__label">Status:</label>
          </div>
          <div className="b-time-progress-bar-filler-info">
            <label className="b-time-progress-bar-filler-info__value">{taskName}</label>
            <label className="b-time-progress-bar-filler-info__value">
              {getHumanizedDuration(Math.round(parseInt(duration / 1000), 10))}
            </label>
            <label className="b-time-progress-bar-filler-info__value">{ACTIVITY_STATUSES_TO_TEXT[status]}</label>
          </div>
        </div>
      </Tooltip>
    </>
  );
}

export default Filler;
