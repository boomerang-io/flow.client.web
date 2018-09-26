import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as taskActions } from "../reducer";
import { BodyWidget } from "./BodyWidget";
import { LoadingAnimation } from "@boomerang/boomerang-components/lib/LoadingAnimation";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "../../../config/servicesConfig";

//call redux action to get tasks in compponentDidMount
//render BodyWidget with app and tasks as props when successfully retrieved

export class BodyWidgetContainer extends Component {
  static propTypes = {
    taskActions: PropTypes.object.isRequired,
    tasks: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.blogPostActions.fetchPosts(`${BASE_SERVICE_URL}/tasks`);
  }

  componentWillUnmount() {
    const { tasks, taskActions } = this.props;
    if (tasks.isFetching) {
      taskActions.cancelFetchPosts();
    }
  }

  render() {
    //console.log(this.props);
    const { tasks, app } = this.props;
    if (tasks.isFetching) {
      return <LoadingAnimation />;
    }

    if (tasks.status === REQUEST_STATUSES.SUCCESS) {
      return <BodyWidget app={app} tasks={tasks} />;
    }

    return null;
  }
}

const mapStateToProps = state => {
  return { tasks: state };
};

const mapDispatchToProps = dispatch => ({
  taskActions: bindActionCreators(taskActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BodyWidgetContainer);
