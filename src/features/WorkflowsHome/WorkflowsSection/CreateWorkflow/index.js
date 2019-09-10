import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as workflowActions } from "State/workflow";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import ModalWrapper from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import { notify, Notification } from "@boomerang/boomerang-components/lib/Notifications";
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import Button from "@boomerang/boomerang-components/lib/Button";
import { Add32 } from "@carbon/icons-react";
import CreateWorkflowContent from "./CreateWorkflowContent";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import DiagramApplication, { createWorkflowRevisionBody } from "Utilities/DiagramApplication";

export class CreateWorkflow extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    workflowRevisionActions: PropTypes.object.isRequired,
    fetchTeams: PropTypes.func.isRequired,
    team: PropTypes.object.isRequired
  };

  diagramApp = new DiagramApplication({ dag: null, isLocked: false });

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
        workflowActions.setHasUnsavedWorkflowUpdates({ hasUpdates: false });
        fetchTeams();
        return workflowRevisionActions.create(`${BASE_SERVICE_URL}/workflow/${workflowId}/revision`, workflowRevision);
      })
      .then(res => {
        notify(
          <Notification type="success" title="Create Workflow" message="Successfully created workflow and version" />
        );
        this.props.history.push(`/editor/${workflowId}/designer`);
      })
      .catch(err => {
        notify(<Notification type="error" title="Something's wrong" message="Failed to create workflow and version" />);
        return Promise.reject();
      });
  };
  render() {
    const { team, teams, isCreating } = this.props;

    return (
      <ModalWrapper
        ModalTrigger={() => (
          <Button className="b-workflow-placeholder">
            <div className="b-workflow-placeholder__box">
              <Add32 data-tip data-for={team.id} className="b-workflow-placeholder__plus" />
            </div>
            <Tooltip id={team.id}>Create Workflow</Tooltip>
          </Button>
        )}
        modalContent={(closeModal, rest) => (
          <ModalFlow
            headerTitle="Create a new Workflow"
            headerSubtitle="Get started with these basics, then proceed to designing it out."
            closeModal={closeModal}
            createWorkflow={this.createWorkflow}
            confirmModalProps={{ affirmativeAction: closeModal }}
            team={team}
            teams={teams}
            isCreating={isCreating}
            theme="bmrg-white"
            {...rest}
          >
            <CreateWorkflowContent />
          </ModalFlow>
        )}
      />
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
