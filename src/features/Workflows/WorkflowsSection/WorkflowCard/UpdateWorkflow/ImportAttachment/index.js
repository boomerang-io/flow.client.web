import React, { Component } from "react";
import PropTypes from "prop-types";
import { ModalBody, ModalFooter, Button, FileUploaderDropContainer, FileUploaderItem } from "carbon-components-react";
import { ModalFlowForm } from "@boomerang/carbon-addons-boomerang-react";
import DropZone from "./Dropzone";

class WorkflowAttachment extends Component {
  state = {
    files: this.props.formData.files.length > 0 ? this.props.formData.files : [],
    isBiggerThanLimit: false
  };

  static propTypes = {
    formData: PropTypes.object,
    closeModal: PropTypes.func,
    handleImportWorkflow: PropTypes.func
  };

  addFile = file => {
    this.setState({ isBiggerThanLimit: false });

    if (file.addedFiles[0].size > 1000000) {
      this.setState({ isBiggerThanLimit: true });
    }
    this.setState({ files: [...file.addedFiles] });
  };

  deleteFile = () => {
    this.setState({ files: [], isBiggerThanLimit: false });
  };

  handleSubmit = event => {
    event.preventDefault();

    const file = this.state.files.length === 0 ? "" : this.state.files[0];
    let reader = new FileReader();
    reader.onload = e => {
      let contents = e.target.result;
      this.props.handleImportWorkflow(contents, this.props.formData.isUpdate, this.props.closeModal);
    };
    reader.readAsText(file);
  };

  render() {
    const buttonMessage = "Choose a file or drag one here";
    return (
      <ModalFlowForm
        title="Update the Workflow file"
        subtitle="File must be .json under 1MB"
        onSubmit={e => e.preventDefault()}
      >
        <ModalBody
          style={{
            height: "22rem",
            width: "100%"
          }}
        >
          {/* <DropZone
            appendFile={this.appendFile}
            removeFile={this.removeFile}
            loadedFile={this.loadedFile}
            dragEnter={this.dragEnter}
            dragLeave={this.dragLeave}
            files={this.state.files}
            goToStep={this.props.requestNextStep}
            state={this.state}
          /> */}

          <FileUploaderDropContainer
            accept={[".json"]}
            labelText={buttonMessage}
            name="Workflow"
            multiple={false}
            onAddFiles={(event, file) => {
              this.addFile(file);
            }}
          />
          {this.state.files.length ? (
            <FileUploaderItem
              name={this.state.files[0].name}
              status="edit"
              invalid={this.state.isBiggerThanLimit}
              errorSubject="Please select a file less than 1MB"
              onDelete={(event, element) => {
                this.deleteFile();
              }}
            />
          ) : (
            ""
          )}
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" type="button" onClick={this.props.closeModal}>
            Cancel
          </Button>
          <Button
            onClick={this.handleSubmit}
            disabled={this.state.isBiggerThanLimit || this.state.files.length === 0}
            kind="primary"
          >
            Update
          </Button>
        </ModalFooter>
      </ModalFlowForm>
    );
  }
}

export default WorkflowAttachment;
