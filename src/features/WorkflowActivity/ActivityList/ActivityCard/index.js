import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import getHumanizedDuration from "@boomerang/boomerang-utilities/lib/getHumanizedDuration";
import activityStatuses from "Constants/activityStatuses";
import imgs from "Assets/icons";
import statusImgs from "./img";
import "./styles.scss";

class ActivityCard extends Component {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  getStatusIcon = status => {
    switch (status) {
      case activityStatuses.COMPLETED:
        return statusImgs["passed"];
      case activityStatuses.FAILED:
        return statusImgs["failed"];
      default:
        return statusImgs["pending"];
    }
  };
  getStatusText = status => {
    switch (status) {
      case activityStatuses.COMPLETED:
        return "Success";
      case activityStatuses.FAILED:
        return "Failed";
      default:
        return "In Progress";
    }
  };

  handleCardClick = (activityId, workflowId) => {
    this.props.history.push(`/activity/${workflowId}/execution/${activityId}`);
  };

  render() {
    const { icon, workflowName, description, creationDate, status, duration, id, workflowId } = this.props.activity;
    return (
      <div className={`c-activities-card --${status}`} onClick={()=>this.handleCardClick(id, workflowId)}>
        <div className="c-activity-card__workflow">
          <div className="c-activity-card__icon">
            <img className="b-activity-card__icon" src={imgs[icon]} alt="icon" />
          </div>
          <div className="c-activity-card__workflow-info">
            <label className="b-activity-card__name">{workflowName}</label>
            <label className="b-activity-card__description">{description}</label>
          </div>
        </div>
        <div className="c-activity-card__activity">
          <div className="c-activity-card__label">
            <label className="b-activity-card__label">Start Time</label>
            <label className="b-activity-card__data">
              {moment(creationDate).format("YYYY-MM-DD hh:mm A")}
            </label>
          </div>
          <div className="c-activity-card__label">
            <label className="b-activity-card__label">Duration</label>
            <label className="b-activity-card__data">{getHumanizedDuration(duration)}</label>
          </div>
          <div className="c-activity-card__label">
            <label className="b-activity-card__label"> Status</label>
            <label className="b-activity-card__data">
              <img
                className="b-activity-card__status-icon"
                src={this.getStatusIcon(status)}
                alt="status"
              />
              {this.getStatusText(status)}
            </label>
          </div>
        </div>
      </div>
    );
  }
}

export default ActivityCard;
