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
    activity: PropTypes.object.isRequired
  };

  getStatusIcon = (status) => {
    switch(status){
      case activityStatuses.SUCCESS:
        return statusImgs["passed"];
      case activityStatuses.FAILURE:
        return statusImgs["failed"];
      default:
        return statusImgs["pending"];
    }
  }
  getStatusText = (status) => {
    switch(status){
      case activityStatuses.SUCCESS:
        return "Success";
      case activityStatuses.FAILURE:
        return "Failed";
      default:
        return "In Progress";
    }
  }

  render() {
    const {activity} = this.props;
      return (        
        <div className={`c-activity-card --${activity.status}`}>
          <div className="c-activity-card__workflow">
            <div className="c-activity-card__icon">
              <img className="b-activity-card__icon" src={imgs[activity.icon]} alt="icon"/>
            </div>
            <div className="c-activity-card__workflow-info">
              <label className="b-activity-card__name">{activity.name}</label>
              <label className="b-activity-card__description">{activity.description}</label>
            </div>
          </div>
          <div className="c-activity-card__activity">
            <div className="c-activity-card__label">
              <label className="b-activity-card__label">Start Time</label>
              <label className="b-activity-card__data">{moment(activity.startTime).format("YYYY-MM-DD hh:mm A")}</label>
            </div>
            <div className="c-activity-card__label">
              <label className="b-activity-card__label">Duration</label>
              <label className="b-activity-card__data">{getHumanizedDuration(activity.duration)}</label>
            </div>
            <div className="c-activity-card__label">
              <label className="b-activity-card__label"> Status</label>
              <label className="b-activity-card__data">
                <img className="b-activity-card__status-icon" src={this.getStatusIcon(activity.status)} alt="status" />
                {this.getStatusText(activity.status)}
              </label>
            </div>
          </div>
        </div>
      );
    }
}

export default ActivityCard;
