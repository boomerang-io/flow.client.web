import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Switch, withRouter } from "react-router-dom";
import { DiagramWidget } from "@projectstorm/react-diagrams";
import ChangeLog from "Features/Designer/components/ChangeLog";
import DesignerHeader from "Features/Designer/components/DesignerHeader";
import WorkflowProperties from "Features/Designer/components/WorkflowProperties";
import Overview from "Features/Designer/components/Overview";
import Tasks from "Features/Designer/components/Tasks";
import WorkflowZoom from "Components/WorkflowZoom";
import DiagramApplication from "Utilities/DiagramApplication";
import styles from "./Editor.module.scss";

class WorkflowEditor extends Component {
  static propTypes = {
    createNode: PropTypes.func.isRequired,
    createWorkflowRevision: PropTypes.func.isRequired,
    fetchWorkflowRevisionNumber: PropTypes.func.isRequired,
    handleChangeLogReasonChange: PropTypes.func.isRequired,
    isModalOpen: PropTypes.bool.isRequired,
    tasks: PropTypes.object.isRequired,
    teams: PropTypes.array.isRequired,
    updateWorkflow: PropTypes.func.isRequired,
    updateWorkflowProperties: PropTypes.func.isRequired,
    workflow: PropTypes.object.isRequired,
    workflowFormikProps: PropTypes.object.isRequired,
    workflowRevision: PropTypes.object.isRequired
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
    if (this.props.location.pathname.endsWith("/designer")) {
      this.diagramApp.getDiagramEngine().zoomToFit();
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

    if (!prevProps.location.pathname.endsWith("/designer") && this.props.location.pathname.endsWith("/designer")) {
      this.diagramApp.getDiagramEngine().zoomToFit();
    }
  }

  createWorkflowRevision = () => {
    this.props.createWorkflowRevision(this.diagramApp);
  };

  render() {
    const {
      createNode,
      fetchWorkflowRevisionNumber,
      handleChangeLogReasonChange,
      location,
      match,
      isModalOpen,
      tasks,
      teams,
      workflow,
      workflowFormikProps,
      workflowRevision
    } = this.props;

    const { revisionCount } = workflow.data;
    const { version } = workflowRevision;
    const workflowLoading = workflowRevision.isFetching || workflowRevision.isCreating;

    return (
      <>
        <DesignerHeader
          currentRevision={workflowRevision.version}
          fetchWorkflowRevisionNumber={fetchWorkflowRevisionNumber}
          handleChangeLogReasonChange={handleChangeLogReasonChange}
          includeResetVersionAlert={version < revisionCount}
          isCreating={workflowRevision.isCreating}
          loading={workflowLoading}
          onDesigner={location.pathname.endsWith("/designer")}
          performAction={this.createWorkflowRevision}
          performActionButtonText={version < revisionCount ? "Set version to latest" : "Create new version"}
          revisionCount={workflow.data.revisionCount}
          workflowName={workflow?.data?.name ?? ""}
        />
        <Switch>
          <Route
            path={`${match.path}/settings`}
            render={() => (
              <>
                <Overview
                  formikProps={workflowFormikProps}
                  teams={teams}
                  updateWorkflow={this.props.updateWorkflow}
                  workflow={workflow}
                />
              </>
            )}
          />
          <Route
            path={`${match.path}/properties`}
            render={props => (
              <WorkflowProperties
                loading={workflow.isUpdating}
                properties={workflow.data.properties}
                updateWorkflowProperties={this.props.updateWorkflowProperties}
              />
            )}
          />
          <Route
            path={`${match.path}/designer`}
            render={props => (
              <div className={styles.container}>
                <Tasks tasks={tasks} />
                <main
                  className={styles.designer}
                  onDrop={event => createNode(this.diagramApp, event)}
                  onDragOver={event => {
                    event.preventDefault();
                  }}
                  ref={this.diagramRef}
                >
                  <WorkflowZoom
                    diagramApp={this.diagramApp}
                    diagramBoundingClientRect={this.state.diagramBoundingClientRect}
                  />
                  <DiagramWidget
                    allowCanvasTranslation={!isModalOpen}
                    allowCanvasZoom={!isModalOpen}
                    className={styles.diagram}
                    deleteKeys={[]}
                    diagramEngine={this.diagramApp.getDiagramEngine()}
                    maxNumberPointsPerLink={0}
                  />
                </main>
              </div>
            )}
          />
          <Route path={`${match.path}/changes`} render={() => <ChangeLog workflow={workflow} />} />
        </Switch>
      </>
    );
  }
}

export default withRouter(WorkflowEditor);
