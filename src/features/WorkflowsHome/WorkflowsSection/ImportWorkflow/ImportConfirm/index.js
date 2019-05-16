import React, { Component } from "react";
import PropTypes from "prop-types";
import Body from "@boomerang/boomerang-components/lib/ModalContentBody";
import Header from "@boomerang/boomerang-components/lib/ModalContentHeader";
import Footer from "@boomerang/boomerang-components/lib/ModalContentFooter";
import ConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import ConfirmEdit from "@boomerang/boomerang-components/lib/ModalConfirmEdit";
import { options } from "Constants/importWorkflowOptions";

class ImportConfirm extends Component {
  static propTypes = {
    handleImportWorkflow: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.shouldConfirmExit(true);
  }

  handleSubmit = event => {
    event.preventDefault();
    const file = this.props.formData.files.length === 0 ? "" : this.props.formData.files[0];
    let reader = new FileReader();
    reader.onload = e => {
      let contents = e.target.result;
      this.props.handleImportWorkflow(contents, this.props.formData.isUpdate);
    };
    reader.readAsText(file);
    this.props.shouldConfirmExit(false);
    this.props.requestNextStep();
  };

  render() {
    const confirmUpdate = [this.props.formData.isUpdate ? "Update Workflow" : "New Workflow"];
    const confirmAttachment = [this.props.formData.files[0].name];

    return (
      <form onSubmit={this.handleSubmit}>
        <Header title="CONFIRM IMPORT" theme="bmrg-white" />
        <Body
          style={{
            height: "21rem",
            width: "36rem",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <ConfirmEdit
            type="array"
            title="Import Type"
            onPencilClick={() => this.props.goToStep(options.IMPORT_WORKFLOW_TYPE)}
            arrayItems={confirmUpdate}
            theme="bmrg-white"
            style={{ marginBottom: "1rem" }}
          />
          <ConfirmEdit
            type="array"
            title={`Attachment`}
            onPencilClick={() => this.props.goToStep(options.IMPORT_WORKFLOW_ATTACHMENT)}
            arrayItems={confirmAttachment}
            theme="bmrg-white"
          />
        </Body>
        <Footer>
          <ConfirmButton text="SUBMIT WORKFLOW" type="submit" theme="bmrg-white" />
        </Footer>
      </form>
    );
  }
}

export default ImportConfirm;
