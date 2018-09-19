import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as blogPostActions } from "../reducer";
//import { actions as taskActions } from "../../demo-drag-and-drop/reducer";
//import Loading from '../../../components/Loading';
import BlogPost from "../BlogPost";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "../../../config/servicesConfig";

import { BodyWidget } from "../../demo-drag-and-drop/components/BodyWidget";

class BlogContainer extends Component {
  static propTypes = {
    taskActions: PropTypes.object.isRequired,
    tasks: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.taskActions.fetchTasks(`${BASE_SERVICE_URL}/tasks`);
  }

  componentWillUnmount() {
    const { blogPosts, blogPostActions } = this.props;
    if (blogPosts.isFetching) {
      blogPostActions.cancelFetchPosts();
    }
  }

  render() {
    console.log(this.props);
    const { tasks } = this.props;
    if (tasks.isFetching) {
      return "...";
    }

    if (tasks.status === REQUEST_STATUSES.SUCCESS) {
      return <BodyWidget tasks={tasks} />;
    }

    return null;
  }
}

const mapStateToProps = state => ({
  blogPosts: state.blogPosts,
  tasks: state.tasks
});

const mapDispatchToProps = dispatch => ({
  taskActions: bindActionCreators(blogPostActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlogContainer);
