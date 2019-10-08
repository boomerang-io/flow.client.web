import React, { Component } from "react";
import PropTypes from "prop-types";
import { ModalBody, ModalFooter, Button } from "carbon-components-react";
import Error from "@boomerang/boomerang-components/lib/Error";
import { LoadingAnimation, ModalConfirmEdit, ModalFlowForm } from "@boomerang/carbon-addons-boomerang-react";
import { options } from "Constants/importWorkflowOptions";
import { REQUEST_STATUSES } from "Config/servicesConfig";

class ImportConfirm extends Component {
  static propTypes = {
    handleImportWorkflow: PropTypes.func,
    importWorkflowActions: PropTypes.object,
    importWorkflowState: PropTypes.object
  };

  componentDidMount() {
    this.props.setShouldConfirmModalClose(true);
  }

  handleSubmit = event => {
    event.preventDefault();
    const file = this.props.formData.files.length === 0 ? "" : this.props.formData.files[0];
    let reader = new FileReader();
    reader.onload = e => {
      let contents = e.target.result;
      this.props.handleImportWorkflow(contents, this.props.formData.isUpdate, this.props.closeModal);
    };
    reader.readAsText(file);
  };

  render() {
    const confirmUpdate = [this.props.formData.isUpdate ? "Update Workflow" : "New Workflow"];
    const confirmAttachment = [this.props.formData.files[0].name];

    if (this.props.importWorkflowState.isPosting === true) {
      return (
        <ModalBody>
          <LoadingAnimation />
        </ModalBody>
      );
    }

    if (this.props.importWorkflowState.status === REQUEST_STATUSES.FAILURE) {
      return (
        <ModalFlowForm
          onSubmit={() => {
            this.props.importWorkflowActions.reset();
            this.props.goToStep(options.IMPORT_WORKFLOW_TYPE);
          }}
        >
          <ModalBody>
            <Error theme="bmrg-flow" />
          </ModalBody>
          <ModalFooter>
            <Button type="submit">Try again</Button>
          </ModalFooter>
        </ModalFlowForm>
      );
    }

    return (
      <ModalFlowForm onSubmit={this.handleSubmit}>
        <ModalBody
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <ModalConfirmEdit
            type="array"
            title="Import Type"
            onPencilClick={() => this.props.goToStep(options.IMPORT_WORKFLOW_TYPE)}
            arrayItems={confirmUpdate}
            style={{ marginBottom: "1rem" }}
          />
          <ModalConfirmEdit
            type="array"
            title={`Attachment`}
            onPencilClick={() => this.props.goToStep(options.IMPORT_WORKFLOW_ATTACHMENT)}
            arrayItems={confirmAttachment}
          />
        </ModalBody>
        <ModalFooter>
          <Button type="submit">Import</Button>
        </ModalFooter>
      </ModalFlowForm>
    );
  }
}

export default ImportConfirm;
