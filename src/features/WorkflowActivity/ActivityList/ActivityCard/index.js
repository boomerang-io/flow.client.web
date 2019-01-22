import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import getHumanizedDuration from "@boomerang/boomerang-utilities/lib/getHumanizedDuration";
import { ACTIVITY_STATUSES_TO_TEXT, ACTIVITY_STATUSES_TO_ICON } from "Constants/activityStatuses";
import imgs from "Assets/icons";
import "./styles.scss";

class ActivityCard extends Component {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
  };

  render() {
    const {
      description,
      creationDate,
      icon,
      duration = 0,
      id,
      initiatedByUserName,
      status,
      teamName,
      trigger,
      workflowId,
      workflowName
    } = this.props.activity;
    return (
      <Link
        className={`c-activities-card --${status}`}
        to={{
          pathname: `/activity/${workflowId}/execution/${id}`,
          state: { fromUrl: this.props.match.url, fromText: "Activity" }
        }}
      >
        <div className="c-activity-card-workflow">
          <div className="c-activity-card-section--left">
            <div className="c-activity-card__icon">
              <img className="b-activity-card__icon" src={imgs[icon ? icon : "docs"]} alt="Worklflow icon" />
            </div>
            <div className="c-activity-card-workflow-info">
              <label className="b-activity-card__name">{workflowName}</label>
              <label className="b-activity-card__description">{description}</label>
            </div>
          </div>
          <div className="c-activity-card-section--right">
            <ul className="c-activity-card-execution-info --first">
              <li className="b-activity-card__row">
                <label className="b-activity-card__label">Team</label>
                <label className="b-activity-card__data">{teamName}</label>
              </li>
              <li className="b-activity-card__row">
                <label className="b-activity-card__label">Trigger</label>
                <label className="b-activity-card__data">
                  {trigger ? trigger.slice(0, 1).toUpperCase() + trigger.slice(1) : "---"}
                </label>
              </li>
              <li className="b-activity-card__row">
                <label className="b-activity-card__label">Initiated by</label>
                <label className="b-activity-card__data">{initiatedByUserName || "---"}</label>
              </li>
            </ul>
            <ul className="c-activity-card-execution-info">
              <li className="b-activity-card__row">
                <label className="b-activity-card__label">Start Time</label>
                <label className="b-activity-card__data">{moment(creationDate).format("YYYY-MM-DD hh:mm A")}</label>
              </li>
              <li className="b-activity-card__row">
                <label className="b-activity-card__label">Duration</label>
                <label className="b-activity-card__data">
                  {duration ? getHumanizedDuration(parseInt(duration / 1000, 10)) : "---"}
                </label>
              </li>
              <li className="b-activity-card__row">
                <label className="b-activity-card__label"> Status</label>
                <label className="b-activity-card__data">
                  <img
                    className="b-activity-card__status-icon"
                    src={ACTIVITY_STATUSES_TO_ICON[status ? status : "notstarted"]}
                    alt={`Status ${status}`}
                  />
                  {ACTIVITY_STATUSES_TO_TEXT[status ? status : "notstarted"]}
                </label>
              </li>
            </ul>
          </div>
        </div>
      </Link>
    );
  }
}

export default ActivityCard;
