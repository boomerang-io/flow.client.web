import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import moment from "moment";
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import { ACTIVITY_STATUSES, ACTIVITY_STATUSES_TO_TEXT } from "Constants/activityStatuses";
import getHumanizedDuration from "@boomerang/boomerang-utilities/lib/getHumanizedDuration";
import "./styles.scss";
import isAccessibleEvent from "@boomerang/boomerang-utilities/lib/isAccessibleEvent";

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
    backgroundColor: status === ACTIVITY_STATUSES.COMPLETED ? "#57d785" : "#e06768",
    width: `${percentOfTotal}%`
  };

  const finishTimeFormatted = moment.unix(finishTime / 1000).format("hh:mm:ss a", { trim: false });
  return (
    <div className="c-time-progress-bar-filler" style={styles} data-tip data-for={id}>
      <button
        onClick={() => updateActiveNode(taskId)}
        className={classnames("b-time-progress-bar-filler", { "--first": isFirstTask, "--last": isLastTask })}
      />
      {percentOfTotal > 5 && <div className="b-time-progress-bar-filler__time">{finishTimeFormatted}</div>}

      <Tooltip id={id} place="bottom">
        <div className="c-time-progress-bar-filler-info">
          <section className="b-time-progress-bar-filler-info">
            <p className="b-time-progress-bar-filler-info__label">Task name:</p>
            <p className="b-time-progress-bar-filler-info__label">Duration:</p>
            <p className="b-time-progress-bar-filler-info__label">Status:</p>
          </section>
          <section className="b-time-progress-bar-filler-info">
            <p className="b-time-progress-bar-filler-info__value">{taskName}</p>
            <p className="b-time-progress-bar-filler-info__value">
              {getHumanizedDuration(Math.round(parseInt(duration / 1000), 10))}
            </p>
            <p className="b-time-progress-bar-filler-info__value">{ACTIVITY_STATUSES_TO_TEXT[status]}</p>
          </section>
        </div>
      </Tooltip>
    </div>
  );
}

export default Filler;
