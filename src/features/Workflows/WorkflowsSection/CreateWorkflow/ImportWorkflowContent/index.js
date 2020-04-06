import React, { Component } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
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

const FILE_UPLOAD_MESSAGE = "Choose a file or drag one here";
const createInvalidTextMessage = message => `Whoops! ${message}. Please choose a different one.`;

function checkIsValidWorkflow(data) {
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
}

class ImportWorkflowContent extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
    isLoading: PropTypes.bool,
    handleImportWorkflow: PropTypes.func,
    title: PropTypes.string.isRequired,
    confirmButtonText: PropTypes.string.isRequired,
    teams: PropTypes.array.isRequired,
    names: PropTypes.array.isRequired,
    team: PropTypes.object
  };

  state = {
    names: this.props.names
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

  handleChangeTeam = selectedItem => {
    let names = [];
    if (selectedItem?.workflows?.length) {
      names = selectedItem.workflows.map(item => item.name);
    }
    this.setState({ selectedTeam: selectedItem, names: names });
  };

  handleSubmit = async values => {
    const fileData = await this.readFile(values.file);
    this.props.handleImportWorkflow(
      {
        ...fileData,
        shortDescription: values.summary,
        name: values.name,
        flowTeamId: values.selectedTeam?.id ?? values.file.flowTeamId
      },
      this.props.closeModal,
      values.selectedTeam
    );
  };

  render() {
    const { isLoading, title, confirmButtonText, team, teams } = this.props;

    return (
      <Formik
        initialValues={{
          selectedTeam: team,
          name: "",
          summary: "",
          file: undefined
        }}
        validateOnMount
        onSubmit={this.handleSubmit}
        validationSchema={Yup.object().shape({
          selectedTeam: Yup.string().required("Team is required"),
          name: Yup.string()
            .required("Please enter a name for your Workflow")
            .max(64, "Name must not be greater than 64 characters")
            .notOneOf(
              this.state.names,
              "There’s already a Workflow with that name in this team, consider giving this one a different name."
            ),
          summary: Yup.string().max(128, "Summary must not be greater than 128 characters"),
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
                  isValid = checkIsValidWorkflow(contents);
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
          const { values, touched, errors, isValid, handleChange, handleBlur, handleSubmit, setFieldValue } = props;
          return (
            <ModalFlowForm title={title} onSubmit={handleSubmit}>
              <ModalBody className={styles.body}>
                <FileUploaderDropContainer
                  accept={[".json"]}
                  labelText={FILE_UPLOAD_MESSAGE}
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
                    <div className={styles.confirmInfoForm}>
                      <ComboBox
                        id="selectedTeam"
                        styles={{ marginBottom: "2.5rem" }}
                        onBlur={handleBlur}
                        onChange={({ selectedItem }) => {
                          setFieldValue("selectedTeam", selectedItem ? selectedItem : "");
                          this.handleChangeTeam(selectedItem);
                        }}
                        items={teams}
                        initialSelectedItem={values.selectedTeam}
                        value={values.selectedTeam}
                        itemToString={item => (item ? item.name : "")}
                        titleText="Team"
                        placeholder="Select a team"
                        invalid={errors.selectedTeam}
                        invalidText={errors.selectedTeam}
                      />
                      <TextInput
                        id="name"
                        labelText="Workflow Name"
                        placeholder="Workflow Name"
                        name="name"
                        value={values.name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        invalid={errors.name && touched.name}
                        invalidText={errors.name}
                      />
                      <TextInput
                        id="summary"
                        labelText="Summary"
                        placeholder="Summary"
                        value={values.summary}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        invalid={errors.summary && touched.summary}
                        invalidText={errors.summary}
                      />
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
