import React, { Component } from "react";
import PropTypes from "prop-types";
import { ModalBody, ModalFooter, Button, FileUploaderDropContainer, FileUploaderItem } from "carbon-components-react";
import { ModalFlowForm } from "@boomerang/carbon-addons-boomerang-react";
import DropZone from "./Dropzone";

class WorkflowAttachment extends Component {
  state = {
    dragEnter: false,
    empty: !this.props.formData.files.length,
    files: this.props.formData.files.length > 0 ? this.props.formData.files : [],
    loaded: this.props.formData.files.length,
    uploading: false
  };

  static propTypes = {
    formData: PropTypes.object,
    closeModal: PropTypes.func
  };

  // componentDidMount() {
  //   this.props.setShouldConfirmModalClose(true);
  // }

  appendFile = files => {
    this.setState({ files: [...files] });
    const formData = {
      files: [...files]
    };
    this.props.saveValues(formData);
  };

  removeFile = () => {
    this.setState(() => ({
      empty: true,
      uploading: false,
      loaded: false,
      dragEnter: false,
      files: []
    }));
  };

  uploadingFile = () => {
    this.setState(() => ({
      empty: false,
      uploading: true,
      loaded: false,
      dragEnter: false
    }));
  };

  loadedFile = () => {
    this.setState(() => ({
      empty: false,
      uploading: false,
      loaded: true,
      dragEnter: false
    }));
  };

  dragEnter = () => {
    this.setState(() => ({
      empty: false,
      uploading: false,
      loaded: false,
      dragEnter: true
    }));
  };

  dragLeave = () => {
    this.setState(() => ({
      empty: true,
      uploading: false,
      loaded: false,
      dragEnter: false
    }));
  };

  onClickBackButton = () => {
    this.props.requestPreviousStep();
  };

  addFile = file => {
    this.setState({ files: [...file.addedFiles] });
  };

  deleteFile = () => {
    this.setState({ files: [] });
  };

  handleSubmit = event => {
    event.preventDefault();
    // this.addFile(this.state.files);

    // if (this.state.loaded) {
    //   setTimeout(this.uploadingFile, 1);
    //   setTimeout(this.uploadingFile, 1);
    // } else {
    // this.props.requestNextStep();
    // }

    this.props.closeModal();
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
          {/* <FileUploader
            accept={[".json"]}
            labelText={buttonMessage}
            name="Workflow"
            multiple={false}
            onChange={file => {
              console.log("test");
              this.addFile(file);
            }}
          >
          </FileUploader> */}

          <FileUploaderDropContainer
            accept={[".json"]}
            labelText={buttonMessage}
            name="Workflow"
            multiple={false}
            onAddFiles={(event, file) => {
              this.addFile(file);
            }}
            // onChange={file => {
            //   console.log("test !!!!!!!");
            //   this.addFile(file);
            // }}
          />
          {this.state.files.length ? (
            <FileUploaderItem
              name={this.state.files[0].name}
              status="edit"
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
          <Button onClick={this.handleSubmit} disabled={this.state.files.length === 0} kind="primary">
            Update
          </Button>
        </ModalFooter>
      </ModalFlowForm>
    );
  }
}

export default WorkflowAttachment;
