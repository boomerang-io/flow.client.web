import React, { Component } from "react";
import PropTypes from "prop-types";
// import { Formik } from "formik";
// import * as Yup from "yup";
import {
  ModalBody,
  ModalFooter,
  Button,
  FileUploaderDropContainer,
  FileUploaderItem,
  ComboBox,
  TextInput
} from "carbon-components-react";
import { ModalFlowForm } from "@boomerang/carbon-addons-boomerang-react";
import { ErrorFilled32 } from "@carbon/icons-react";
import Loading from "Components/Loading";
import { requiredWorkflowProps } from "./constants";
import styles from "./importWorkflowContent.module.scss";

class ImportWorkflowContent extends Component {
  state = {
    files: this.props.formData.files.length > 0 ? this.props.formData.files : [],
    isBiggerThanLimit: false,
    processedFile: {},
    isValidWorkflow: undefined,
    selectedTeam: this.props.team || {},
    workflowName: "",
    summary: "",
    names: this.props.names || []
  };

  static propTypes = {
    formData: PropTypes.object,
    closeModal: PropTypes.func,
    isLoading: PropTypes.bool,
    handleImportWorkflow: PropTypes.func,
    title: PropTypes.string.isRequired,
    confirmButtonText: PropTypes.string.isRequired,
    teams: PropTypes.array.isRequired,
    names: PropTypes.array.isRequired,
    team: PropTypes.object
  };

  addFile = file => {
    this.setState({ isBiggerThanLimit: false });

    if (file.addedFiles[0].size > 1000000) {
      this.setState({ isBiggerThanLimit: true });
    }
    this.setState({ files: [...file.addedFiles] });

    const fileTest = file.addedFiles[0];

    let reader = new FileReader();
    reader.onload = e => {
      let contents = JSON.parse(e.target.result);
      let isValidWorkflow = this.checkIsValidWorkflow(contents);
      this.setState({
        processedFile: contents,
        isValidWorkflow,
        workflowName: contents.name,
        summary: contents.shortDescription
      });
    };
    reader.readAsText(fileTest);
  };

  checkForInvalidName = () => {
    return this.state.names.includes(this.state.workflowName);
  };

  handleChangeTeam = selectedItem => {
    let names = [];
    if (selectedItem?.workflows && selectedItem.workflows.length) {
      names = selectedItem.workflows.map(item => item.name);
    }
    this.setState({ selectedTeam: selectedItem, names: names });
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
    const { selectedTeam, workflowName, summary, processedFile } = this.state;
    this.props.handleImportWorkflow(
      {
        ...this.state.processedFile,
        shortDescription: summary,
        name: workflowName,
        flowTeamId: selectedTeam?.id ?? processedFile.flowTeamId
      },
      this.props.closeModal,
      this.state.selectedTeam
    );
  };

  renderConfirmForm = file => {
    const { teams } = this.props;
    const { workflowName, summary } = this.state;

    return (
      <>
        <ComboBox
          id="selectedTeam"
          styles={{ marginBottom: "2.5rem" }}
          onChange={({ selectedItem }) => this.handleChangeTeam(selectedItem)}
          items={teams}
          initialSelectedItem={this.state.selectedTeam}
          itemToString={item => (item ? item.name : "")}
          titleText="Team"
          placeholder="Select a team"
          // shouldFilterItem={({ item, inputValue }) =>
          //   item && item.name.toLowerCase().includes(inputValue.toLowerCase())
          // }
        />
        <TextInput
          id="name"
          labelText="Workflow Name"
          placeholder="Workflow Name"
          value={workflowName}
          onChange={event => this.setState({ workflowName: event.target.value })}
          invalid={!workflowName || this.checkForInvalidName()}
          invalidText={
            !workflowName
              ? "Please enter a name for your Workflow"
              : "There’s already a Workflow with that name in this team, you'll need to give this workflow a unique name."
          }
        />
        <TextInput
          id="summary"
          labelText="Summary"
          placeholder="Summary"
          value={summary}
          onChange={e => this.setState({ summary: e.target.value })}
        />
      </>
    );
  };

  render() {
    const buttonMessage = "Choose a file or drag one here";
    // const validText = "All set! This Workflow is valid, and will fully replace the existing Workflow.";
    const invalidText = "Whoops! This Workflow is invalid, please choose a different file.";
    const { isLoading, title, confirmButtonText } = this.props;
    const { files, isBiggerThanLimit, isValidWorkflow, processedFile } = this.state;

    return (
      <ModalFlowForm title={title} onSubmit={e => e.preventDefault()}>
        <ModalBody
          style={{
            height: "20.25rem",
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
          {files.length ? (
            isValidWorkflow === true ? (
              //Form
              <div className={styles.confirmInfoForm}>
                {/* <CheckmarkFilled32 aria-label="success-import-icon" className={styles.successIcon} />           
                  <p className={styles.message}>{validText}</p> */}
                {this.renderConfirmForm(processedFile)}
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
              !this.state.workflowName ||
              !this.state.selectedTeam ||
              this.state.files.length === 0 ||
              !isValidWorkflow ||
              this.checkForInvalidName() ||
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
