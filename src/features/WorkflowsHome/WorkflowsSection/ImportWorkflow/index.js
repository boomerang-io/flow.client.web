import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import queryString from "query-string";
import { actions as importWorkflowActions } from "State/importWorkflow";
import { notify, ToastNotification, ModalFlow } from "@boomerang/carbon-addons-boomerang-react";
import { Upload16 } from "@carbon/icons-react";
import ImportAttachment from "./ImportAttachment";
import ImportConfirm from "./ImportConfirm";
import ImportType from "./ImportType";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import "./styles.scss";

class ImportWorkflow extends Component {
  static propTypes = {
    fetchTeams: PropTypes.func.isRequired,
    importWorkflowActions: PropTypes.object.isRequired,
    importWorkflowState: PropTypes.object.isRequired
  };

  handleImportWorkflow = (data, isUpdate, closeModal) => {
    const query = queryString.stringify({ update: isUpdate, flowTeamId: isUpdate ? undefined : this.props.teamId });
    return this.props.importWorkflowActions
      .post(`${BASE_SERVICE_URL}/workflow/import?${query}`, JSON.parse(data))
      .then(() => {
        notify(
          <ToastNotification
            kind="success"
            title={` ${isUpdate ? "Update" : "Import"} Workflow`}
            subtitle={`Workflow successfully ${isUpdate ? "updated" : "imported"}`}
          />
        );
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
        files: [],
        isUpdate: false
      }
    };

    return (
      <ModalFlow
        confirmModalProps={{
          title: "Close this?",
          children: <div>You request will not be saved</div>
        }}
        modalHeaderProps={{
          title: "Workflow Import",
          subtitle: "Import your own workflow"
        }}
        modalTrigger={({ openModal }) => (
          <button>
            <Upload16
              data-tip
              data-for={this.props.teamId}
              className="b-workflow-import__icon"
              alt="Import Workflow"
              onClick={openModal}
            />
          </button>
        )}
        progressSteps={[{ label: "Type" }, { label: "Attachment" }, { label: "Confirm" }]}
        initialState={initialState}
      >
        <ImportType />
        <ImportAttachment />
        <ImportConfirm
          fetchTeams={this.props.fetchTeams}
          handleImportWorkflow={this.handleImportWorkflow}
          importWorkflowActions={this.props.importWorkflowActions}
          importWorkflowState={this.props.importWorkflowState}
        />
      </ModalFlow>
    );
  }
}

const mapStateToProps = state => ({
  importWorkflowState: state.importWorkflow
});

const mapDispatchToProps = dispatch => ({
  importWorkflowActions: bindActionCreators(importWorkflowActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportWorkflow);
