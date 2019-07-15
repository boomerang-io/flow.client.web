import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as importWorkflowActions } from "State/importWorkflow";
import Modal from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import { notify, Notification } from "@boomerang/boomerang-components/lib/Notifications";
import { Icon } from "carbon-components-react";
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
    return this.props.importWorkflowActions
      .post(`${BASE_SERVICE_URL}/workflow/import?update=${isUpdate}`, JSON.parse(data))
      .then(() => {
        notify(
          <Notification
            type="success"
            title={` ${isUpdate ? "Update" : "Import"} Workflow`}
            message={`Workflow successfully ${isUpdate ? "updated" : "imported"}`}
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
      <Modal
        modalProps={{ shouldCloseOnOverlayClick: false }}
        ModalTrigger={() => (
          <button>
            <Icon
              data-tip
              data-for={this.props.teamId}
              className="b-workflow-import__icon"
              name="icon--upload"
              alt="Import Workflow"
            />
          </button>
        )}
        initialState={initialState}
        theme="bmrg-white"
        modalContent={(closeModal, rest) => (
          <ModalFlow
            headerTitle="Workflow Import"
            headerSubtitle="Import your own workflow"
            closeModal={closeModal}
            confirmModalProps={{ affirmativeAction: closeModal, theme: "bmrg-white" }}
            theme="bmrg-white"
            {...rest}
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
        )}
      />
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
