import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as taskActions } from "State/nodes";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import DiagramApplication from "./utilities/DiagramApplication";
import ActionBar from "./ActionBar";
import Editor from "./Editor";
import "./styles.scss";

class WorkflowEditorContainer extends Component {
  static propTypes = {
    taskActions: PropTypes.object.isRequired,
    tasks: PropTypes.object.isRequired
  };

  app = new DiagramApplication();

  componentDidMount() {
    this.props.taskActions.fetchTasks(`${BASE_SERVICE_URL}/tasks`);
  }

  componentWillUnmount() {
    const { taskActions } = this.props;
    if (taskActions.isFetching) {
      taskActions.cancelFetchPosts();
    }
  }

  onHandleSave = () => {
    const serialization = this.app
      .getDiagramEngine()
      .getDiagramModel()
      .serializeDiagram();
    /*console.log("we are saving");
    console.log(serialization);
    console.log(this.props.nodes.nodes);
    console.log(JSON.stringify(serialization));
    console.log(JSON.stringify(this.props.nodes.nodes));*/
    //placeholder for service call to export serialization and node configs

    /*
      TODO: create the task configuration structure to be passed back. 
      -need to turn object of objects into array of objects
      -grab workflow id

    */
    //let task_configurations = this.props.nodes.nodes;
    const task_configurations = Object.values(this.props.nodes.nodes.entities);
    const workflowId = this.app.getDiagramEngine().getDiagramModel().id;
    const task_configurations_output = { nodes: task_configurations, workflowId: workflowId };
    console.log(task_configurations_output);
    //task_configurations_output to be passed to service call

    console.log("task_configurations");
    console.log(task_configurations);
    console.log(task_configurations.map(({ id }) => ({ nodeId: id })));
  };

  render() {
    const { tasks } = this.props;
    if (tasks.isFetching) {
      return "...";
    }

    if (tasks.status === REQUEST_STATUSES.SUCCESS) {
      return (
        <>
          <ActionBar onSave={this.onHandleSave} />
          <Editor tasks={tasks} app={this.props.app} />
        </>
      );
    }

    return null;
  }
}

const mapStateToProps = state => ({
  tasks: state.tasks
});

const mapDispatchToProps = dispatch => ({
  taskActions: bindActionCreators(taskActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowEditorContainer);
