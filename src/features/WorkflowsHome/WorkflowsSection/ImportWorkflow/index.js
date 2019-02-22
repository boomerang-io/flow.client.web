import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import { Icon } from "carbon-components-react";
import ImportAttachment from "./ImportAttachment";
import ImportConfirm from "./ImportConfirm";
import ImportResult from "./ImportResult";
import ImportType from "./ImportType";
import "./styles.scss";

class ImportWorkflow extends Component {
  static propTypes = {
    importWorkflow: PropTypes.object.isRequired,
    fetchTeams: PropTypes.func.isRequired,
    handleImportWorkflow: PropTypes.func.isRequired
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
        ModalTrigger={() => <Icon className="b-workflow-import__icon" name="icon--upload" alt="Import Workflow" />}
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
            <ImportConfirm handleImportWorkflow={this.props.handleImportWorkflow} />
            <ImportResult importWorkflow={this.props.importWorkflow} fetchTeams={this.props.fetchTeams} />
          </ModalFlow>
        )}
      />
    );
  }
}

export default ImportWorkflow;
