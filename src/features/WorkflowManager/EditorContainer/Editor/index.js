import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Switch, withRouter } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import get from "lodash.get";
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
    workflow: PropTypes.object.isRequired,
    workflowRevision: PropTypes.object.isRequired,
    isModalOpen: PropTypes.bool.isRequired
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
      isModalOpen,
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
              <Formik
                initialValues={{
                  name: get(workflow, "data.name", ""),
                  shortDescription: get(workflow, "data.shortDescription", ""),
                  description: get(workflow, "data.description", ""),
                  webhook: get(workflow, "data.triggers.webhook.enable", false),
                  token: get(workflow, "data.triggers.webhook.token", ""),
                  schedule: get(workflow, "data.triggers.scheduler.enable", false),
                  event: get(workflow, "data.triggers.event.enable", false),
                  topic: get(workflow, "data.triggers.event.topic", ""),
                  persistence: get(workflow, "data.enablePersistentStorage", false)
                }}
                validationSchema={Yup.object().shape({
                  name: Yup.string()
                    .required("Enter a name")
                    .max(64, "Name must not be greater than 64 characters"),
                  shortDescription: Yup.string().max(128, "Summary must not be greater than 128 characters"),
                  description: Yup.string().max(256, "Description must not be greater than 256 characters"),
                  webhook: Yup.boolean(),
                  token: Yup.string(),
                  schedule: Yup.boolean(),
                  event: Yup.boolean(),
                  topic: Yup.string(),
                  persistence: Yup.boolean()
                })}
              >
                {formikProps => (
                  <>
                    <ActionBar
                      diagramApp={this.diagramApp}
                      performActionButtonText="Update Overview"
                      performAction={this.updateWorkflow}
                      isValidOverview={formikProps.isValid}
                      loading={workflowLoading}
                      {...props}
                    />
                    <Overview workflow={workflow} formikProps={formikProps} />
                  </>
                )}
              </Formik>
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
                    allowCanvasZoom={!isModalOpen}
                    allowCanvasTranslation={!isModalOpen}
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
