import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import Tasks from "./Tasks";

class TaskTrayContainer extends Component {
  render() {
    const { tasks } = this.props;

    if (tasks.status === REQUEST_STATUSES.SUCCESS) {
      return <Tasks tasks={tasks.data} />;
    }

    return null;
  }
}

const mapStateToProps = state => ({
  tasks: state.tasks
});

export default connect(
  mapStateToProps,
  null
)(TaskTrayContainer);
