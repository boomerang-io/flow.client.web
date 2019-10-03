import React, { Component } from "react";
import { ModalBody } from "carbon-components-react";
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
      <form onSubmit={e => e.preventDefault()}>
        <ModalBody>
          <button
            className="bmrg--b-flow-export-options-button --bmrg-flow"
            onClick={() => this.handleNextStep({ isUpdate: false })}
          >
            NEW WORKFLOW
          </button>
          <button
            className="bmrg--b-flow-export-options-button --bmrg-flow"
            onClick={() => this.handleNextStep({ isUpdate: true })}
          >
            UPDATE WORKFLOW
          </button>
        </ModalBody>
      </form>
    );
  }
}

export default ImportType;
