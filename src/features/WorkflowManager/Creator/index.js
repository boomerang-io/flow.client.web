import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Switch, Route, Redirect } from "react-router-dom";
import { actions as tasksActions } from "State/tasks";
import { DiagramWidget } from "@boomerang/boomerang-dag";
import ActionBar from "Features/WorkflowManager/components/ActionBar";
import ChangeLog from "Features/WorkflowManager/components/ChangeLog";
import Inputs from "Features/WorkflowManager/components/Inputs";
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

  diagramApp = new DiagramApplication({ dag: null, isLocked: false });

  createWorkflow = () => {
    this.props.createWorkflow(this.diagramApp);
  };

  render() {
    const { match, workflow } = this.props;

    return (
      <>
        <Navigation onlyShowOverviewLink />
        <Switch>
          <Route
            path={`${match.path}/overview`}
            render={props => (
              <>
                <ActionBar
                  performActionButtonText={"Create Workflow"}
                  performAction={this.createWorkflow}
                  diagramApp={this.diagramApp}
                  {...props}
                />
                <Overview workflow={workflow} />
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
