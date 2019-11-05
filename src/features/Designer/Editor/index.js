import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Switch, withRouter } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import get from "lodash.get";
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
    teams: PropTypes.object.isRequired,
    updateWorkflow: PropTypes.func.isRequired,
    updateWorkflowProperties: PropTypes.func.isRequired,
    workflow: PropTypes.object.isRequired,
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
      activeTeamId,
      createNode,
      fetchWorkflowRevisionNumber,
      handleChangeLogReasonChange,
      location,
      match,
      isModalOpen,
      tasks,
      teams,
      workflow,
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
          loading={workflowLoading}
          onDesigner={location.pathname.endsWith("/designer")}
          performAction={this.createWorkflowRevision}
          performActionButtonText={version < revisionCount ? "Set version to latest" : "Create new version"}
          revisionCount={workflow.data.revisionCount}
          workflowName={get(workflow, "data.name", "")}
        />
        <Switch>
          <Route
            path={`${match.path}/settings`}
            render={() => (
              <Formik
                initialValues={{
                  description: get(workflow, "data.description", ""),
                  enableACCIntegration: get(workflow, "data.enableACCIntegration", false),
                  event: get(workflow, "data.triggers.event.enable", false),
                  name: get(workflow, "data.name", ""),
                  persistence: get(workflow, "data.enablePersistentStorage", false),
                  schedule: get(workflow, "data.triggers.scheduler.enable", false),
                  selectedTeam: activeTeamId ? teams.data.find(team => team.id === activeTeamId) : teams.data[0],
                  shortDescription: get(workflow, "data.shortDescription", ""),
                  token: get(workflow, "data.triggers.webhook.token", ""),
                  topic: get(workflow, "data.triggers.event.topic", ""),
                  webhook: get(workflow, "data.triggers.webhook.enable", false)
                }}
                validationSchema={Yup.object().shape({
                  description: Yup.string().max(250, "Description must not be greater than 250 characters"),
                  enableACCIntegration: Yup.boolean(),
                  event: Yup.boolean(),
                  name: Yup.string()
                    .required("Name is required")
                    .max(64, "Name must not be greater than 64 characters"),
                  persistence: Yup.boolean(),
                  selectedTeam: Yup.object().required(),
                  schedule: Yup.boolean(),
                  shortDescription: Yup.string().max(128, "Summary must not be greater than 128 characters"),
                  token: Yup.string(),
                  topic: Yup.string(),
                  webhook: Yup.boolean()
                })}
              >
                {formikProps => (
                  <>
                    <Overview
                      formikProps={formikProps}
                      teams={teams.data}
                      updateWorkflow={this.props.updateWorkflow}
                      workflow={workflow}
                    />
                  </>
                )}
              </Formik>
            )}
          />
          <Route
            path={`${match.path}/properties`}
            render={props => (
              <WorkflowProperties
                updateWorkflowProperties={this.props.updateWorkflowProperties}
                loading={workflow.isUpdating}
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
