import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Switch, Route, Redirect } from "react-router-dom";
import { actions as tasksActions } from "State/tasks";
import ActionBar from "Features/WorkflowManager/components/ActionBar";
import Navigation from "Features/WorkflowManager/components/Navigation";
import Overview from "Features/WorkflowManager/components/Overview";
import DiagramApplication from "Utilities/DiagramApplication";

class WorkflowCreatorContainer extends Component {
  static propTypes = {
    createNode: PropTypes.func.isRequired,
    diagramApp: PropTypes.object.isRequired,
    createWorkflow: PropTypes.func.isRequired,
    createWorkflowRevision: PropTypes.func.isRequired,
    handleOnOverviewChange: PropTypes.func.isRequired,
    isValidOverview: PropTypes.bool.isRequired,
    setIsValidOveriew: PropTypes.func.isRequired,
    updateWorkflow: PropTypes.func.isRequired
  };

  diagramApp = new DiagramApplication({ dag: null, isLocked: false });

  createWorkflow = () => {
    this.props.createWorkflow(this.diagramApp);
  };

  render() {
    const { match, workflow, isValidOverview, setIsValidOveriew } = this.props;

    return (
      <>
        <Navigation onlyShowOverviewLink />
        <Switch>
          <Route
            path={`${match.path}/overview`}
            render={props => (
              <>
                <ActionBar
                  diagramApp={this.diagramApp}
                  performActionButtonText="Create Workflow"
                  performAction={this.createWorkflow}
                  isValidOverview={isValidOverview}
                  {...props}
                />
                <Overview workflow={workflow} setIsValidOveriew={setIsValidOveriew} />
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
  tasks: state.tasks,
  workflow: state.workflow
});

const mapDispatchToProps = dispatch => ({
  tasksActions: bindActionCreators(tasksActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowCreatorContainer);
