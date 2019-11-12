import React, { Component } from "react";
import PropTypes from "prop-types";
import { ModalBody, ModalFooter, Button, FileUploaderDropContainer, FileUploaderItem } from "carbon-components-react";
import { ModalFlowForm } from "@boomerang/carbon-addons-boomerang-react";
import { CheckmarkFilled32, ErrorFilled32 } from "@carbon/icons-react";
import Loading from "Components/Loading";
import { requiredWorkflowProps } from "./constants";
import styles from "./importWorkflowContent.module.scss";

class ImportWorkflowContent extends Component {
  state = {
    files: this.props.formData.files.length > 0 ? this.props.formData.files : [],
    isBiggerThanLimit: false,
    processedFile: {},
    isImporting: false,
    isValidWorkflow: false
  };

  static propTypes = {
    formData: PropTypes.object,
    closeModal: PropTypes.func,
    isLoading: PropTypes.bool,
    handleImportWorkflow: PropTypes.func,
    title: PropTypes.string.isRequired,
    confirmButtonText: PropTypes.string.isRequired
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

    if (isLoading) {
      return <Loading />;
    }

    return (
      <ModalFlowForm title={title} onSubmit={e => e.preventDefault()}>
        <ModalBody
          style={{
            height: "21rem",
            width: "100%"
          }}
        >
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
            <div>
              <p className={styles.message}>Validating Workflow...</p>
            </div>
          ) : null}
          {files.length ? (
            isValidWorkflow ? (
              <div className={styles.validMessage}>
                <CheckmarkFilled32 aria-label="success-import-icon" className={styles.successIcon} />
                <p className={styles.message}>{validText}</p>
              </div>
            ) : (
              <div className={styles.validMessage}>
                <ErrorFilled32 aria-label="error-import-icon" className={styles.errorIcon} />
                <p className={styles.message}>{invalidText}</p>
              </div>
            )
          ) : null}
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.props.closeModal} kind="secondary">
            Cancel
          </Button>
          <Button
            onClick={this.handleSubmit}
            disabled={this.state.isBiggerThanLimit || this.state.files.length === 0 || isImporting || !isValidWorkflow}
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