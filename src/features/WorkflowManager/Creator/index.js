import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as tasksActions } from "State/tasks";
import { actions as workflowConfigActions } from "State/workflowConfig/fetch";
import { DiagramWidget } from "@boomerang/boomerang-dag";
import ActionBar from "Features/WorkflowManager/components/ActionBar";
import TaskTray from "Features/WorkflowManager/components/TaskTray";
import "./styles.scss";

class WorkflowCreatorContainer extends Component {
  static PropTypes = {
    createNode: PropTypes.func.isRequired,
    diagramApp: PropTypes.object.isRequired,
    handleOnCreate: PropTypes.func.isRequired,
    handleOnUpdate: PropTypes.func.isRequired
  };

  state = {
    hasCreated: false
  };

  handleOnAction = () => {
    if (this.state.hasCreated) {
      this.props.handleOnUpdate();
    } else {
      this.props.handleOnCreate();
    }
  };

  handleOnCreate = () => {
    this.props.handleOnCreate().then(workflowConfigId => {
      this.setState({
        hasCreated: true,
        workflowConfigId
      });
    });
  };

  handleOnUpdate = () => {
    this.props.handleOnUpdate({ workflowConfigId: this.state.workflowConfigId });
  };

  render() {
    return (
      <>
        <ActionBar
          actionButtonText={this.state.hasCreated ? "Update" : "Create"}
          onClick={this.handleOnAction}
          diagramApp={this.props.diagramApp}
        />
        <TaskTray />
        <div className="content">
          <div
            className="diagram-layer"
            onDrop={this.props.createNode}
            onDragOver={event => {
              event.preventDefault();
            }}
          >
            <DiagramWidget
              className="srd-demo-canvas"
              diagramEngine={this.props.diagramApp.getDiagramEngine()}
              maxNumberPointsPerLink={0}
              //smartRouting={true}
              deleteKeys={[]}
            />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  tasks: state.tasks,
  workflowConfig: state.workflowConfig.fetch
});

const mapDispatchToProps = dispatch => ({
  tasksActions: bindActionCreators(tasksActions, dispatch),
  workflowConfigActions: bindActionCreators(workflowConfigActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowCreatorContainer);
