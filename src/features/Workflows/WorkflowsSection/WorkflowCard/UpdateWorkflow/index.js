import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import queryString from "query-string";
import { actions as importWorkflowActions } from "State/importWorkflow";
import { notify, ToastNotification, ModalFlow } from "@boomerang/carbon-addons-boomerang-react";
import ImportWorkflowContent from "./ImportWorkflowContent";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import styles from "./updateWorkflow.module.scss";

class UpdateWorkflow extends Component {
  static propTypes = {
    fetchTeams: PropTypes.func.isRequired,
    importWorkflowActions: PropTypes.object.isRequired,
    importWorkflowState: PropTypes.object.isRequired,
    onCloseModal: PropTypes.func,
    workflowId: PropTypes.string.isRequired
  };

  handleImportWorkflow = (data, closeModal) => {
    const query = queryString.stringify({ update: true, flowTeamId: this.props.teamId });
    return this.props.importWorkflowActions
      .post(`${BASE_SERVICE_URL}/workflow/import?${query}`, data)
      .then(() => {
        notify(<ToastNotification kind="success" title="Update Workflow" subtitle="Workflow successfullyupdated" />);
        closeModal();
        this.props.fetchTeams();
      })
      .catch(err => {
        //noop
      });
  };

  render() {
    const initialState = {
      step: 0,
      formData: {
        files: []
      }
    };
    const { isPosting, workflowId } = this.props;
    return (
      <ModalFlow
        isOpen
        confirmModalProps={{
          title: "Are you sure?",
          children: "Your request will not be saved"
        }}
        composedModalProps={{
          containerClassName: styles.container
        }}
        modalHeaderProps={{
          title: "Update .json file"
        }}
        initialState={initialState}
        onCloseModal={this.props.onCloseModal}
      >
        <ImportWorkflowContent
          confirmButtonText={isPosting ? "Updating..." : "Update"}
          handleImportWorkflow={this.handleImportWorkflow}
          isLoading={isPosting}
          title="Update a Workflow - Select the Workflow file you want to upload"
          workflowId={workflowId}
        />
      </ModalFlow>
    );
  }
}

const mapStateToProps = state => ({
  importWorkflowState: state.importWorkflow,
  isPosting: state.importWorkflow.isPosting
});

const mapDispatchToProps = dispatch => ({
  importWorkflowActions: bindActionCreators(importWorkflowActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateWorkflow);
