import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Switch, withRouter } from "react-router-dom";
import { DiagramWidget } from "@boomerang/boomerang-dag";
import ActionBar from "Features/WorkflowManager/components/ActionBar";
import Inputs from "Features/WorkflowManager/components/Inputs";
import Navigation from "Features/WorkflowManager/components/Navigation";
import Overview from "Features/WorkflowManager/components/Overview";
import ChangeLog from "Features/WorkflowManager/components/ChangeLog";
import TasksSidenav from "Features/WorkflowManager/components/TasksSidenav";
import DiagramApplication from "Utilities/DiagramApplication";

class WorkflowEditor extends Component {
  static propTypes = {
    createNode: PropTypes.func.isRequired,
    createWorkflowRevision: PropTypes.func.isRequired,
    fetchWorkflowRevisionNumber: PropTypes.func.isRequired,
    handleChangeLogReasonChange: PropTypes.func.isRequired,
    isValidOverview: PropTypes.bool.isRequired,
    setIsValidOveriew: PropTypes.func.isRequired,
    workflow: PropTypes.object.isRequired,
    workflowRevision: PropTypes.object.isRequired,
    modalOpen: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.diagramApp = new DiagramApplication({ dag: props.workflowRevision.dag, isLocked: false });
    this.state = {
      diagramBoundingClientRect: {}
    };
    this.diagramRef = React.createRef();
  }

  componentDidMount() {
    if (this.diagramRef.current) {
      this.setState({
        diagramBoundingClientRect: this.diagramRef.current.getBoundingClientRect()
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.workflowRevision.version !== prevProps.workflowRevision.version) {
      const { revisionCount } = this.props.workflow.data;
      const { version } = this.props.workflowRevision;
      const isLocked = version < revisionCount;
      this.diagramApp = new DiagramApplication({ dag: this.props.workflowRevision.dag, isLocked });
      this.diagramApp.getDiagramEngine().repaintCanvas();
      this.forceUpdate();
    }
  }

  createWorkflowRevision = () => {
    return this.props.createWorkflowRevision(this.diagramApp);
  };

  updateWorkflow = () => {
    return this.props.updateWorkflow(this.diagramApp);
  };

  render() {
    const {
      createNode,
      fetchWorkflowRevisionNumber,
      handleChangeLogReasonChange,
      isValidOverview,
      match,
      modalOpen,
      overviewData,
      setIsValidOveriew,
      workflow,
      workflowRevision
    } = this.props;
    const { revisionCount } = workflow.data;
    const { version } = workflowRevision;
    const workflowLoading = workflowRevision.isFetching || workflowRevision.isCreating;

    return (
      <>
        <Navigation />
        <Switch>
          <Route
            path={`${match.path}/overview`}
            render={props => (
              <>
                <ActionBar
                  performActionButtonText="Update Overview"
                  performAction={this.updateWorkflow}
                  diagramApp={this.diagramApp}
                  isValidOverview={isValidOverview}
                  loading={workflowLoading}
                  {...props}
                />
                <Overview workflow={workflow} overviewData={overviewData} setIsValidOveriew={setIsValidOveriew} />
              </>
            )}
          />
          <Route
            path={`${match.path}/inputs`}
            render={props => (
              <>
                <ActionBar
                  diagramApp={this.diagramApp}
                  isValidOverview={isValidOverview}
                  showActionButton={false}
                  loading={workflowLoading}
                  {...props}
                />
                <Inputs updateInputs={this.props.updateInputs} loading={workflow.isUpdating} />
              </>
            )}
          />
          <Route
            path={`${match.path}/designer`}
            render={props => (
              <>
                <ActionBar
                  performActionButtonText={version < revisionCount ? "Set Version to Latest" : "Create New Version"}
                  performAction={this.createWorkflowRevision}
                  diagramApp={this.diagramApp}
                  diagramBoundingClientRect={this.state.diagramBoundingClientRect}
                  handleChangeLogReasonChange={handleChangeLogReasonChange}
                  includeCreateNewVersionComment={true || version === revisionCount}
                  includeResetVersionAlert={version < revisionCount}
                  includeVersionSwitcher
                  includeZoom
                  isValidOverview={isValidOverview}
                  revisionCount={workflow.data.revisionCount}
                  currentRevision={workflowRevision.version}
                  fetchWorkflowRevisionNumber={fetchWorkflowRevisionNumber}
                  loading={workflowLoading}
                  {...props}
                />
                <TasksSidenav />
                <div
                  ref={this.diagramRef}
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
                    allowCanvasZoom={!modalOpen}
                    allowCanvasTranslation={!modalOpen}
                  />
                </div>
              </>
            )}
          />
          <Route
            path={`${match.path}/changes`}
            render={() => (
              <>
                <ChangeLog workflow={workflow} />
              </>
            )}
          />
        </Switch>
      </>
    );
  }
}

export default withRouter(WorkflowEditor);
