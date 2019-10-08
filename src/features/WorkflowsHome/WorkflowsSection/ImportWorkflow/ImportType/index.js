import React, { Component } from "react";
import { Button, ModalBody, ModalFooter } from "carbon-components-react";
import { ModalFlowForm } from "@boomerang/carbon-addons-boomerang-react";
import "./styles.scss";

class ImportType extends Component {
  handleNextStep = ({ isUpdate }) => {
    const formData = {
      isUpdate
    };
    this.props.saveValues(formData);
    this.props.requestNextStep();
  };

  render() {
    return (
      <ModalFlowForm onSubmit={e => e.preventDefault()}>
        <ModalBody style={{ display: "flex", flexDirection: "column" }}>
          <Button
            onClick={() => this.handleNextStep({ isUpdate: false })}
            style={{ marginBottom: "1rem", maxWidth: "100%" }}
          >
            New Workflow
          </Button>
          <Button onClick={() => this.handleNextStep({ isUpdate: true })} style={{ maxWidth: "100%" }}>
            Update Workflow
          </Button>
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" type="button" onClick={this.props.closeModal}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalFlowForm>
    );
  }
}

export default ImportType;
