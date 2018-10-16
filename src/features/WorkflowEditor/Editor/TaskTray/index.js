import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as taskConfigurationActions } from "State/taskConfig";
import { actions as serializationActions } from "State/serialization";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import Tasks from "./Tasks";

class TrayContainer extends Component {
  componentDidMount() {
    serializationActions.fetchSerialization(`${BASE_SERVICE_URL}/serialization`);
    taskConfigurationActions.fetchTaskConfiguration(`${BASE_SERVICE_URL}/task_configuration`);
  }

  componentWillUnmount() {
    if (serializationActions.isFetching) {
      serializationActions.cancelFetchPosts();
    }
    if (taskConfigurationActions.isFetching) {
      taskConfigurationActions.cancelFetchPosts();
    }
  }

  render() {
    const { taskconfiguration, workflow } = this.props;
    if (taskconfiguration.isFetching || workflow.isFetching) {
      return "...";
    }

    if (taskconfiguration.status === REQUEST_STATUSES.SUCCESS && workflow.status === REQUEST_STATUSES.SUCCESS) {
      //need to pull in the workflow and set it

      return <Tasks> {this.props.trayItems}</Tasks>;
    }

    return null;
  }
}

const mapStateToProps = state => ({
  taskconfiguration: state.taskconfiguration,
  workflow: state.workflow
});

const mapDispatchToProps = dispatch => ({
  serializationActions: bindActionCreators(serializationActions, dispatch),
  taskConfigurationActions: bindActionCreators(taskConfigurationActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrayContainer);
