import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as workflowActions } from "State/workflow";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import { ModalFlow, notify, ToastNotification, RadioGroup } from "@boomerang/carbon-addons-boomerang-react";
import { Add32 } from "@carbon/icons-react";
import CreateWorkflowContent from "./CreateWorkflowContent";
import ImportWorkflowContent from "./ImportWorkflowContent";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import DiagramApplication, { createWorkflowRevisionBody } from "Utilities/DiagramApplication";
import styles from "./createWorkflow.module.scss";

const NEW_WORKFLOW = "Start from scratch";
const IMPORT_WORKFLOW = "Import a Workflow";

const radioWorkflowOptions = [
  {
    id: "create-workflow-radio-id",
    label: NEW_WORKFLOW,
    value: NEW_WORKFLOW
  },
  {
    id: "import-workflow-radio-id",
    label: IMPORT_WORKFLOW,
    value: IMPORT_WORKFLOW
  }
];

export class CreateWorkflow extends Component {
  static propTypes = {
    fetchTeams: PropTypes.func.isRequired,
    team: PropTypes.object.isRequired,
    workflowActions: PropTypes.object.isRequired,
    workflowRevisionActions: PropTypes.object.isRequired,
    onCloseModal: PropTypes.bool.isRequired
  };

  state = {
    selectedOption: NEW_WORKFLOW
  };

  diagramApp = new DiagramApplication({ dag: null, isLocked: false });

  handleChangeElem = e => {
    this.setState({ selectedOption: e });
  };

  createWorkflow = workflowData => {
    const { workflowActions, workflowRevisionActions, fetchTeams } = this.props;
    let workflowId;
    return workflowActions
      .create(`${BASE_SERVICE_URL}/workflow`, workflowData)
      .then(res => {
        workflowId = res.data.id;
        const dagProps = createWorkflowRevisionBody(this.diagramApp, "Create workflow");
        const workflowRevision = {
          ...dagProps,
          workflowId
        };
        fetchTeams();
        return workflowRevisionActions.create(`${BASE_SERVICE_URL}/workflow/${workflowId}/revision`, workflowRevision);
      })
      .then(res => {
        notify(
          <ToastNotification
            kind="success"
            title="Create Workflow"
            subtitle="Successfully created workflow and version"
          />
        );
        this.props.history.push(`/editor/${workflowId}/designer`);
      })
      .catch(err => {
        notify(
          <ToastNotification kind="error" title="Something's wrong" subtitle="Failed to create workflow and version" />
        );
        return Promise.reject();
      });
  };
  render() {
    const { team, teams, isCreating } = this.props;

    return (
      <ModalFlow
        modalTrigger={({ openModal }) => (
          <button className={styles.container} onClick={openModal}>
            <Add32 className={styles.addIcon} />
            <p className={styles.text}>Create a new workflow</p>
          </button>
        )}
        confirmModalProps={{
          title: "Close this?",
          children: "Your request will not be saved"
        }}
        modalHeaderProps={{
          title: "Create a new Workflow",
          subtitle: "Get started with these basics, then proceed to designing it out."
        }}
        // onCloseModal={this.props.onCloseModal}
      >
        <div className={styles.modalBody}>
          <RadioGroup
            options={radioWorkflowOptions}
            onChange={e => this.handleChangeElem(e)}
            defaultSelected={NEW_WORKFLOW}
          />
          {this.state.selectedOption === NEW_WORKFLOW ? (
            <CreateWorkflowContent
              createWorkflow={this.createWorkflow}
              team={team}
              teams={teams}
              isCreating={isCreating}
            />
          ) : (
            <ImportWorkflowContent
              formData={{
                files: []
              }}
            />
          )}
        </div>
      </ModalFlow>
    );
  }
}

const mapStateToProps = state => {
  return {
    teams: state.teams.data,
    isCreating: state.workflow.isCreating
  };
};

const mapDispatchToProps = dispatch => {
  return {
    workflowActions: bindActionCreators(workflowActions, dispatch),
    workflowRevisionActions: bindActionCreators(workflowRevisionActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWorkflow);
