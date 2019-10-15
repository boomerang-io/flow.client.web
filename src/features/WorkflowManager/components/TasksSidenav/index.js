import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Tasks from "./Tasks";
import { REQUEST_STATUSES } from "Config/servicesConfig";
import "./styles.scss";

class TasksSidenavContainer extends Component {
  static propTypes = {
    tasks: PropTypes.object.isRequired
  };

  render() {
    const { tasks } = this.props;

    if (tasks.status === REQUEST_STATUSES.SUCCESS) {
      return (
        <div className="c-tasks-sidenav">
          <Tasks tasks={tasks} />
        </div>
      );
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
)(TasksSidenavContainer);
