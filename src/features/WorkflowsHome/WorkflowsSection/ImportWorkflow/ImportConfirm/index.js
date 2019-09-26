import React, { Component } from "react";
import PropTypes from "prop-types";
import Body from "@boomerang/boomerang-components/lib/ModalContentBody";
import Header from "@boomerang/boomerang-components/lib/ModalContentHeader";
import Footer from "@boomerang/boomerang-components/lib/ModalContentFooter";
import ConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import ConfirmEdit from "@boomerang/boomerang-components/lib/ModalConfirmEdit";
import Error from "@boomerang/boomerang-components/lib/Error";
import { LoadingAnimation } from "@boomerang/carbon-addons-boomerang-react";
import { options } from "Constants/importWorkflowOptions";
import { REQUEST_STATUSES } from "Config/servicesConfig";

class ImportConfirm extends Component {
  static propTypes = {
    handleImportWorkflow: PropTypes.func,
    importWorkflowActions: PropTypes.object,
    importWorkflowState: PropTypes.object
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
      this.props.handleImportWorkflow(contents, this.props.formData.isUpdate, this.props.closeModal);
    };
    reader.readAsText(file);
  };

  render() {
    const confirmUpdate = [this.props.formData.isUpdate ? "Update Workflow" : "New Workflow"];
    const confirmAttachment = [this.props.formData.files[0].name];

    if (this.props.importWorkflowState.isPosting === true) {
      return (
        <Body
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
        </Body>
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
          <Body
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
          </Body>
          <Footer>
            <ConfirmButton text="Try again?" theme="bmrg-flow" />
          </Footer>
        </form>
      );
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <Header title="CONFIRM IMPORT" theme="bmrg-flow" />
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
            theme="bmrg-flow"
            style={{ marginBottom: "1rem" }}
          />
          <ConfirmEdit
            type="array"
            title={`Attachment`}
            onPencilClick={() => this.props.goToStep(options.IMPORT_WORKFLOW_ATTACHMENT)}
            arrayItems={confirmAttachment}
            theme="bmrg-flow"
          />
        </Body>
        <Footer>
          <ConfirmButton text="SUBMIT WORKFLOW" type="submit" theme="bmrg-flow" />
        </Footer>
      </form>
    );
  }
}

export default ImportConfirm;
