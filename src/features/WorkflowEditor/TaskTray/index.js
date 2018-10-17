import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as tasksActions } from "State/tasks";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import Tasks from "./Tasks";

class TaskTrayContainer extends Component {
  componentDidMount() {
    this.props.tasksActions.fetchTasks(`${BASE_SERVICE_URL}/tasks`);
  }

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

const mapDispatchToProps = dispatch => ({
  tasksActions: bindActionCreators(tasksActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskTrayContainer);
