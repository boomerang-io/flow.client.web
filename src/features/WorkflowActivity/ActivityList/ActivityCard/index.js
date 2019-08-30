import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
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
      shortDescription,
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
          state: { fromUrl: `${this.props.match.url}${this.props.location.search}`, fromText: "Activity" }
        }}
      >
        <div className="c-activity-card-workflow">
          <div className="c-activity-card-section--left">
            <div className="c-activity-card__icon">
              <img className="b-activity-card__icon" src={imgs[icon ? icon : "docs"]} alt="Worklflow icon" />
            </div>
            <div className="c-activity-card-workflow-info">
              <label className="b-activity-card__name">{workflowName}</label>
              <label className="b-activity-card__description">{shortDescription}</label>
            </div>
          </div>
          <div className="c-activity-card-section--right">
            <div className="c-activity-card-execution-info --first">
              <section className="b-activity-card__row">
                <p className="b-activity-card__label">Team</p>
                <p className="b-activity-card__data">{teamName}</p>
              </section>
              <section className="b-activity-card__row">
                <p className="b-activity-card__label">Trigger</p>
                <p className="b-activity-card__data">
                  {trigger ? trigger.slice(0, 1).toUpperCase() + trigger.slice(1) : "---"}
                </p>
              </section>
              <section className="b-activity-card__row">
                <p className="b-activity-card__label">Initiated by</p>
                <p className="b-activity-card__data">{initiatedByUserName || "---"}</p>
              </section>
            </div>
            <div className="c-activity-card-execution-info">
              <section className="b-activity-card__row">
                <p className="b-activity-card__label">Start Time</p>
                <p className="b-activity-card__data">{moment(creationDate).format("YYYY-MM-DD hh:mm A")}</p>
              </section>
              <section className="b-activity-card__row">
                <p className="b-activity-card__label">Duration</p>
                <p className="b-activity-card__data">
                  {duration ? getHumanizedDuration(parseInt(duration / 1000, 10)) : "---"}
                </p>
              </section>
              <section className="b-activity-card__row">
                <p className="b-activity-card__label"> Status</p>
                <p className="b-activity-card__data">
                  <img
                    className="b-activity-card__status-icon"
                    src={ACTIVITY_STATUSES_TO_ICON[status ? status : "notstarted"]}
                    alt={`Status ${status}`}
                  />
                  {ACTIVITY_STATUSES_TO_TEXT[status ? status : "notstarted"]}
                </p>
              </section>
            </div>
          </div>
        </div>
      </Link>
    );
  }
}

export default withRouter(ActivityCard);
