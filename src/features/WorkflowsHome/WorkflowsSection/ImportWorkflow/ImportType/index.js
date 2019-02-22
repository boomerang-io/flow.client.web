import React, { Component } from "react";
import OptionButton from "@boomerang/boomerang-components/lib/ModalOptionButton";
import Body from "@boomerang/boomerang-components/lib/ModalContentBody";
import Header from "@boomerang/boomerang-components/lib/ModalContentHeader";

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
        <Header title="IMPORT TYPE" subtitle="What do you want to do?" theme="bmrg-white" />
        <Body>
          <OptionButton
            text="NEW WORKFLOW"
            theme="bmrg-white"
            onClick={() => this.handleNextStep({ isUpdate: false })}
          />
          <OptionButton
            text="UPDATE WORKFLOW"
            theme="bmrg-white"
            onClick={() => this.handleNextStep({ isUpdate: true })}
          />
        </Body>
      </form>
    );
  }
}

export default ImportType;
