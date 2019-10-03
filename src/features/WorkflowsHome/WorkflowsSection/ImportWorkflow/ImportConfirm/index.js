import React, { Component } from "react";
import PropTypes from "prop-types";
import { ModalBody, ModalFooter, Button } from "carbon-components-react";
import Error from "@boomerang/boomerang-components/lib/Error";
import { LoadingAnimation, ModalConfirmEdit } from "@boomerang/carbon-addons-boomerang-react";
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
        <ModalBody
          style={{
            height: "26rem",
            width: "36rem",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <LoadingAnimation />
        </ModalBody>
      );
    }

    if (this.props.importWorkflowState.status === REQUEST_STATUSES.FAILURE) {
      return (
        <form
          onSubmit={() => {
            this.props.importWorkflowActions.reset();
            this.props.goToStep(options.IMPORT_WORKFLOW_TYPE);
          }}
        >
          <ModalBody
            style={{
              height: "26rem",
              width: "36rem",
              margin: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <Error theme="bmrg-flow" />
          </ModalBody>
          <ModalFooter>
            <Button type="submit">Try again</Button>
          </ModalFooter>
        </form>
      );
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <ModalBody
          style={{
            height: "21.5rem",
            width: "36rem",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <ModalConfirmEdit
            type="array"
            title="Import Type"
            onPencilClick={() => this.props.goToStep(options.IMPORT_WORKFLOW_TYPE)}
            arrayItems={confirmUpdate}
            theme="bmrg-flow"
            style={{ marginBottom: "1rem" }}
          />
          <ModalConfirmEdit
            type="array"
            title={`Attachment`}
            onPencilClick={() => this.props.goToStep(options.IMPORT_WORKFLOW_ATTACHMENT)}
            arrayItems={confirmAttachment}
            theme="bmrg-flow"
          />
        </ModalBody>
        <ModalFooter>
          <Button type="submit">SUBMIT WORKFLOW</Button>
        </ModalFooter>
      </form>
    );
  }
}

export default ImportConfirm;
