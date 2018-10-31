import React, { Component } from "react";
import PropTypes from "prop-types";
import ActivityCard from "./ActivityCard";
import "./styles.scss";

class ActivityList extends Component {
  
  static propTypes = {
    activities: PropTypes.array.isRequired,
    searchQuery: PropTypes.string
  };

  render() {
    const {activities, searchQuery} = this.props;
    let activitiesList = [];
    if (searchQuery) {
      activitiesList = activities.filter(activity => activity.name.toLowerCase().includes(searchQuery.toLowerCase()));
    } else {
      activitiesList = activities;
    }
      return (
        <div className="c-activity-list">
          {
            activitiesList.map(activity=>{
              return(
                <ActivityCard activity={activity}/>
              );
            })
          }          
        </div>
      );
    }
}

export default ActivityList;
