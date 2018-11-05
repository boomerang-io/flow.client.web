import React, { Component } from "react";
import PropTypes from "prop-types";
import ActivityTable from "./ActivityTable";
import "./styles.scss";

class ActivityList extends Component {

  static propTypes = {
    activities: PropTypes.array.isRequired,
    fetchActivities: PropTypes.func.isRequired,
    savePageSize: PropTypes.func.isRequired,
    searchQuery: PropTypes.string
  };

  render() {
    const {activities, fetchActivities, savePageSize,searchQuery} = this.props;
      return (
        <div className="c-activity-list">
          <ActivityTable 
            activities={activities.records}
            pageSize={activities.size}
            pageNumber={activities.number}
            totalPageCount={activities.totalPages}
            totalElements={activities.totalElements}
            sort={activities.sort}
            fetchActivities={fetchActivities}
            savePageSize={savePageSize}
            searchQuery={searchQuery}
          />      
        </div>
      );
    }
}

export default ActivityList;
