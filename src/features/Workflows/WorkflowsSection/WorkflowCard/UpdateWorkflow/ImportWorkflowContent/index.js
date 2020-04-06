import React, { Component } from "react";
import PropTypes from "prop-types";
import { ModalBody, ModalFooter, Button, FileUploaderDropContainer, FileUploaderItem } from "carbon-components-react";
import { ModalFlowForm } from "@boomerang/carbon-addons-boomerang-react";
import { CheckmarkFilled32, ErrorFilled32 } from "@carbon/icons-react";
import Loading from "Components/Loading";
import DelayedRender from "Components/DelayedRender";
import { requiredWorkflowProps } from "./constants";
import styles from "./importWorkflowContent.module.scss";

class ImportWorkflowContent extends Component {
  state = {
    files: this.props.formData.files.length > 0 ? this.props.formData.files : [],
    isBiggerThanLimit: false,
    processedFile: {},
    isImporting: false,
    isValidWorkflow: undefined
  };

  static propTypes = {
    confirmButtonText: PropTypes.string.isRequired,
    closeModal: PropTypes.func,
    formData: PropTypes.object,
    handleImportWorkflow: PropTypes.func,
    isLoading: PropTypes.bool,
    title: PropTypes.string.isRequired,
    workflowId: PropTypes.string.isRequired
  };

  addFile = file => {
    this.setState({ isBiggerThanLimit: false, isImporting: true });

    if (file.addedFiles[0].size > 1000000) {
      this.setState({ isBiggerThanLimit: true });
    }
    this.setState({ files: [...file.addedFiles] });

    const fileTest = file.addedFiles[0];

    let reader = new FileReader();
    reader.onload = e => {
      let contents = JSON.parse(e.target.result);
      let isValidWorkflow = this.checkIsValidWorkflow(contents);
      this.setState({ processedFile: contents, isImporting: false, isValidWorkflow });
    };
    reader.readAsText(fileTest);
  };
  checkIsValidWorkflow = data => {
    // Only check if the .json file contain the required key data
    // This validate can be improved
    let isValid = true;
    requiredWorkflowProps.forEach(prop => {
      if (!data.hasOwnProperty(prop)) {
        isValid = false;
      }
    });

    if (data.id !== this.props.workflowId) {
      isValid = false;
    }
    //Validate if workflow has the latest structure for dag
    if (!data.latestRevision?.dag?.tasks) {
      isValid = false;
    }
    return isValid;
  };

  deleteFile = () => {
    this.setState({ files: [], isBiggerThanLimit: false });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.handleImportWorkflow(this.state.processedFile, this.props.closeModal);
  };

  render() {
    const buttonMessage = "Choose a file or drag one here";
    const validText = "All set! This Workflow is valid, and will fully replace the existing Workflow.";
    const invalidText = "Whoops! This Workflow is invalid, please choose a different file.";
    const { isLoading, title, confirmButtonText } = this.props;
    const { isImporting, files, isBiggerThanLimit, isValidWorkflow } = this.state;

    return (
      <ModalFlowForm title={title} onSubmit={e => e.preventDefault()}>
        <ModalBody
          style={{
            height: "21rem",
            width: "100%"
          }}
        >
          {isLoading && <Loading />}
          <FileUploaderDropContainer
            accept={[".json"]}
            labelText={buttonMessage}
            name="Workflow"
            multiple={false}
            onAddFiles={(event, file) => {
              this.addFile(file);
            }}
          />
          {files.length ? (
            <FileUploaderItem
              name={files[0].name}
              status="edit"
              invalid={isBiggerThanLimit}
              errorSubject="Please select a file less than 1MB"
              onDelete={(event, element) => {
                this.deleteFile();
              }}
            />
          ) : (
            ""
          )}
          {isImporting ? (
            <DelayedRender>
              <div>
                <p className={styles.message}>Validating Workflow...</p>
              </div>
            </DelayedRender>
          ) : null}
          {files.length ? (
            isValidWorkflow === true ? (
              <div className={styles.validMessage}>
                <CheckmarkFilled32 aria-label="success-import-icon" className={styles.successIcon} />
                <p className={styles.message}>{validText}</p>
              </div>
            ) : isValidWorkflow === false ? (
              <div className={styles.validMessage}>
                <ErrorFilled32 aria-label="error-import-icon" className={styles.errorIcon} />
                <p className={styles.message}>{invalidText}</p>
              </div>
            ) : null
          ) : null}
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.props.closeModal} kind="secondary">
            Cancel
          </Button>
          <Button
            onClick={this.handleSubmit}
            disabled={
              this.state.isBiggerThanLimit ||
              this.state.files.length === 0 ||
              isImporting ||
              !isValidWorkflow ||
              isLoading
            }
            kind="primary"
          >
            {confirmButtonText}
          </Button>
        </ModalFooter>
      </ModalFlowForm>
    );
  }
}

export default ImportWorkflowContent;
