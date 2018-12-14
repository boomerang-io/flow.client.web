import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import getHumanizedDuration from "@boomerang/boomerang-utilities/lib/getHumanizedDuration";
import { ACTIVITY_STATUSES_TO_TEXT, ACTIVITY_STATUSES_TO_ICON } from "Constants/activityStatuses";
import triggerTypes from "Constants/triggerTypes";
import imgs from "Assets/icons";
import "./styles.scss";

class ActivityCard extends Component {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  render() {
    const {
      icon,
      workflowName,
      description,
      creationDate,
      status,
      duration,
      id,
      workflowId,
      teamName,
      trigger,
      initiatedByUserName
    } = this.props.activity;
    return (
      <Link className={`c-activities-card --${status}`} to={`/activity/${workflowId}/execution/${id}`}>
        <div className="c-activity-card__workflow">
          <div className="c-activity-card__icon">
            <img className="b-activity-card__icon" src={imgs[icon ? icon : "docs"]} alt="icon" />
          </div>
          <div className="c-activity-card__workflow-info">
            <label className="b-activity-card__team-name">{teamName}</label>
            <label className="b-activity-card__name">{workflowName}</label>
            <label className="b-activity-card__description">{description}</label>
          </div>
          <div className="c-activity-card__workflow-trigger">
            {trigger && <label className="b-activity-card__trigger-label">Trigger</label>}
            {trigger === triggerTypes.MANUAL && <label className="b-activity-card__trigger-label">Initiated by</label>}
          </div>
          <div className="c-activity-card__workflow-trigger">
            <label className="b-activity-card__trigger">{trigger}</label>
            {trigger === triggerTypes.MANUAL && <label className="b-activity-card__autor">{initiatedByUserName}</label>}
          </div>
        </div>
        <div className="c-activity-card__activity">
          <div className="c-activity-card__label">
            <label className="b-activity-card__label">Start Time</label>
            <label className="b-activity-card__data">{moment(creationDate).format("YYYY-MM-DD hh:mm A")}</label>
          </div>
          <div className="c-activity-card__label">
            <label className="b-activity-card__label">Duration</label>
            <label className="b-activity-card__data">{getHumanizedDuration(parseInt(duration / 1000, 10))}</label>
          </div>
          <div className="c-activity-card__label">
            <label className="b-activity-card__label"> Status</label>
            <label className="b-activity-card__data">
              <img
                className="b-activity-card__status-icon"
                src={ACTIVITY_STATUSES_TO_ICON[status ? status : "notstarted"]}
                alt={`Status ${status}`}
              />
              {ACTIVITY_STATUSES_TO_TEXT[status]}
            </label>
          </div>
        </div>
      </Link>
    );
  }
}

export default ActivityCard;
