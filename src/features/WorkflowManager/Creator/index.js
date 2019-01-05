import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as tasksActions } from "State/tasks";
import ActionBar from "Features/WorkflowManager/components/ActionBar";
import Navigation from "Features/WorkflowManager/components/Navigation";
import Overview from "Features/WorkflowManager/components/Overview";
import DiagramApplication from "Utilities/DiagramApplication";

class WorkflowCreatorContainer extends Component {
  static propTypes = {
    createWorkflow: PropTypes.func.isRequired,
    isValidOverview: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    setIsValidOveriew: PropTypes.func.isRequired,
    workflow: PropTypes.object.isRequired
  };

  diagramApp = new DiagramApplication({ dag: null, isLocked: false });

  createWorkflow = () => {
    this.props.createWorkflow(this.diagramApp);
  };

  render() {
    const { workflow, isValidOverview, setIsValidOveriew } = this.props;

    return (
      <>
        <Navigation onlyShowBackLink />
        <ActionBar
          diagramApp={this.diagramApp}
          performActionButtonText="Create Workflow"
          performAction={this.createWorkflow}
          isValidOverview={isValidOverview}
        />
        <Overview workflow={workflow} setIsValidOveriew={setIsValidOveriew} />
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
