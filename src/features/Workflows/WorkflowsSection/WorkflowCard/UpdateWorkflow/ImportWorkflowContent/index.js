import React, { Component } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import { ModalBody, ModalFooter, Button, FileUploaderDropContainer, FileUploaderItem } from "carbon-components-react";
import { ModalFlowForm } from "@boomerang/carbon-addons-boomerang-react";
import { CheckmarkFilled32, ErrorFilled32 } from "@carbon/icons-react";
import Loading from "Components/Loading";
// import DelayedRender from "Components/DelayedRender";
import { requiredWorkflowProps } from "./constants";
import styles from "./importWorkflowContent.module.scss";

function checkIsValidWorkflow(data, workflowId) {
  // Only check if the .json file contain the required key data
  // This validate can be improved
  let isValid = true;
  requiredWorkflowProps.forEach(prop => {
    if (!data.hasOwnProperty(prop)) {
      isValid = false;
    }
  });

  if (data.id !== workflowId) {
    isValid = false;
  }
  //Validate if workflow has the latest structure for dag
  if (!data.latestRevision?.dag?.tasks) {
    isValid = false;
  }
  return isValid;
}

const buttonMessage = "Choose a file or drag one here";
const validText = "All set! This Workflow is valid, and will fully replace the existing Workflow.";
// const invalidText = "Whoops! This Workflow is invalid, please choose a different file.";
const createInvalidTextMessage = message => `Whoops! ${message}. Please choose a different one.`;

class ImportWorkflowContent extends Component {
  static propTypes = {
    confirmButtonText: PropTypes.string.isRequired,
    closeModal: PropTypes.func,
    handleImportWorkflow: PropTypes.func,
    isLoading: PropTypes.bool,
    title: PropTypes.string.isRequired,
    workflowId: PropTypes.string.isRequired
  };

  /**
   * Return promise for reading file
   * @param file {File}
   * @return {Promise}
   */
  readFile = file => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onerror = () => {
        reader.abort();
        reject(new DOMException("Problem parsing input file"));
      };

      reader.onload = () => {
        try {
          resolve(JSON.parse(reader.result));
        } catch (e) {
          reject(new DOMException("Problem parsing input file as JSON"));
        }
      };

      reader.readAsText(file);
    });
  };

  handleSubmit = async values => {
    const fileData = await this.readFile(values.file);
    this.props.handleImportWorkflow(fileData, this.props.closeModal);
  };

  // addFile = file => {
  //   this.setState({ isBiggerThanLimit: false, isImporting: true });

  //   if (file.addedFiles[0].size > 1000000) {
  //     this.setState({ isBiggerThanLimit: true });
  //   }
  //   this.setState({ files: [...file.addedFiles] });

  //   const fileTest = file.addedFiles[0];

  //   let reader = new FileReader();
  //   reader.onload = e => {
  //     let contents = JSON.parse(e.target.result);
  //     let isValidWorkflow = this.checkIsValidWorkflow(contents);
  //     this.setState({ processedFile: contents, isImporting: false, isValidWorkflow });
  //   };
  //   reader.readAsText(fileTest);
  // };

  // checkIsValidWorkflow = data => {
  //   // Only check if the .json file contain the required key data
  //   // This validate can be improved
  //   let isValid = true;
  //   requiredWorkflowProps.forEach(prop => {
  //     if (!data.hasOwnProperty(prop)) {
  //       isValid = false;
  //     }
  //   });

  //   if (data.id !== this.props.workflowId) {
  //     isValid = false;
  //   }
  //   //Validate if workflow has the latest structure for dag
  //   if (!data.latestRevision?.dag?.tasks) {
  //     isValid = false;
  //   }
  //   return isValid;
  // };

  render() {
    const { isLoading, title, confirmButtonText, workflowId } = this.props;

    if (isLoading) {
      return <Loading />;
    }

    return (
      <Formik
        initialValues={{
          file: undefined
        }}
        validateOnMount
        onSubmit={this.handleSubmit}
        validationSchema={Yup.object().shape({
          file: Yup.mixed()
            .test(
              "fileSize",
              "File is larger than 1MiB",
              // If it's bigger than 1MiB will display the error (1048576 bytes = 1 mebibyte)
              file => (file?.size ? file.size < 1048576 : true)
            )
            .test("validFile", "File is invalid", async file => {
              let isValid = true;
              if (file) {
                try {
                  let contents = await this.readFile(file);
                  isValid = checkIsValidWorkflow(contents, workflowId);
                } catch (e) {
                  console.error(e);
                  isValid = false;
                }
              }

              // Need to return promise for yup to do async validation
              return Promise.resolve(isValid);
            })
        })}
      >
        {props => {
          const { values, errors, isValid, handleSubmit, setFieldValue } = props;
          return (
            <ModalFlowForm title={title} onSubmit={handleSubmit}>
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
                  onAddFiles={(event, { addedFiles }) => setFieldValue("file", addedFiles[0])}
                />
                {values.file && (
                  <FileUploaderItem
                    name={values.file.name}
                    status="edit"
                    onDelete={() => {
                      setFieldValue("file", undefined);
                    }}
                  />
                )}
                {values.file ? (
                  Boolean(errors.file) ? (
                    <div className={styles.validMessage}>
                      <ErrorFilled32 aria-label="error-import-icon" className={styles.errorIcon} />
                      <p className={styles.message}>{createInvalidTextMessage(errors.file)}</p>
                    </div>
                  ) : (
                    <div className={styles.validMessage}>
                      <CheckmarkFilled32 aria-label="success-import-icon" className={styles.successIcon} />
                      <p className={styles.message}>{validText}</p>
                    </div>
                  )
                ) : null}
              </ModalBody>
              <ModalFooter>
                <Button onClick={this.props.closeModal} kind="secondary">
                  Cancel
                </Button>
                <Button type="submit" disabled={!isValid || !Boolean(values.file)} kind="primary">
                  {confirmButtonText}
                </Button>
              </ModalFooter>
            </ModalFlowForm>
          );
        }}
      </Formik>
    );
  }
}

export default ImportWorkflowContent;
