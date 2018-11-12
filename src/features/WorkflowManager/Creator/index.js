import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Switch, Route, Redirect } from "react-router-dom";
import { actions as tasksActions } from "State/tasks";
import { DiagramWidget } from "@boomerang/boomerang-dag";
import ActionBar from "Features/WorkflowManager/components/ActionBar";
import Navigation from "Features/WorkflowManager/components/Navigation";
import Overview from "Features/WorkflowManager/components/Overview";
import TasksSidenav from "Features/WorkflowManager/components/TasksSidenav";
import DiagramApplication from "Utilities/DiagramApplication";

class WorkflowCreatorContainer extends Component {
  static propTypes = {
    createNode: PropTypes.func.isRequired,
    diagramApp: PropTypes.object.isRequired,
    createWorkflow: PropTypes.func.isRequired,
    createWorkflowRevision: PropTypes.func.isRequired,
    handleOnOverviewChange: PropTypes.func.isRequired,
    updateWorkflow: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.diagramApp = new DiagramApplication({ dag: null, isLocked: false });
    this.state = {
      hasCreatedWorkflow: false
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.workflowRevision.version !== prevProps.workflowRevision.version) {
      this.diagramApp = new DiagramApplication({ dag: this.props.workflowRevision.dag, isLocked: false });
    }
  }

  overviewAction = () => {
    if (this.state.hasCreatedWorkflow) {
      this.props.updateWorkflow();
    } else {
      this.createWorkflow();
    }
  };

  designerAction = () => {
    if (this.state.hasCreatedWorkflow) {
      this.props.createWorkflowRevision(this.diagramApp);
    } else {
      this.createWorkflow();
    }
  };

  createWorkflow = () => {
    this.props
      .createWorkflow(this.diagramApp)
      .then(() => {
        this.setState({
          hasCreatedWorkflow: true
        });
      })
      .catch(() => console.error("Failed to create workflow and revision"));
  };

  render() {
    const {
      createNode,
      fetchWorkflowRevisionNumber,
      handleOnOverviewChange,
      match,
      workflow,
      workflowRevision
    } = this.props;

    const { hasCreatedWorkflow } = this.state;
    return (
      <>
        <Navigation includeChangeLog={false} />
        <Switch>
          <Route
            path={`${match.path}/overview`}
            component={props => (
              <>
                <ActionBar
                  actionButtonText={hasCreatedWorkflow ? "Update Overview" : "Create Workflow"}
                  performAction={this.overviewAction}
                  diagramApp={this.diagramApp}
                  {...props}
                />
                <Overview handleOnChange={handleOnOverviewChange} workflow={workflow} />
              </>
            )}
          />
          <Route
            path={`${match.path}/designer`}
            render={props => (
              <>
                <ActionBar
                  actionButtonText={hasCreatedWorkflow ? "Create New Version" : "Create Workflow"}
                  performAction={this.designerAction}
                  diagramApp={this.diagramApp}
                  handleChangeLogReasonChange={this.props.handleChangeLogReasonChange}
                  includeCreateNewVersionComment={
                    hasCreatedWorkflow ? workflowRevision.version === workflow.data.revisionCount : false
                  }
                  includeResetVersionAlert={
                    hasCreatedWorkflow ? workflowRevision.version < workflow.data.revisionCount : false
                  }
                  includeVersionSwitcher={hasCreatedWorkflow}
                  includeZoom
                  revisionCount={hasCreatedWorkflow ? workflow.data.revisionCount : undefined}
                  currentRevision={hasCreatedWorkflow ? workflowRevision.version : undefined}
                  fetchWorkflowRevisionNumber={fetchWorkflowRevisionNumber}
                  {...props}
                />
                <TasksSidenav />
                <div
                  className="c-workflow-diagram-designer"
                  onDrop={event => createNode(this.diagramApp, event)}
                  onDragOver={event => {
                    event.preventDefault();
                  }}
                >
                  <DiagramWidget
                    className="srd-demo-canvas"
                    diagramEngine={this.diagramApp.getDiagramEngine()}
                    maxNumberPointsPerLink={0}
                    deleteKeys={[]}
                  />
                </div>
              </>
            )}
          />
          <Redirect from={`${match.path}`} to={`${match.path}/overview`} />
        </Switch>
      </>
    );
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
)(WorkflowCreatorContainer);
