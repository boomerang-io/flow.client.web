import React, { useState } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Button,
  ComboBox,
  FileUploaderDropContainer,
  FileUploaderItem,
  Loading,
  ModalBody,
  ModalFooter,
  TextInput,
  InlineNotification,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { ModalFlowForm } from "@boomerang-io/carbon-addons-boomerang-react";
import { ErrorFilled32 } from "@carbon/icons-react";
import { requiredWorkflowProps } from "./constants";
import styles from "./importWorkflowContent.module.scss";

const FILE_UPLOAD_MESSAGE = "Choose a file or drag one here";
const createInvalidTextMessage = (message) => `Whoops! ${message}. Please choose a different one.`;

function checkIsValidWorkflow(data) {
  // Only check if the .json file contain the required key data
  // This validate can be improved
  let isValid = true;
  requiredWorkflowProps.forEach((prop) => {
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

ImportWorkflowContent.propTypes = {
  closeModal: PropTypes.func,
  existingWorkflowNames: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  importError: PropTypes.bool,
  importWorkflow: PropTypes.func,
  teams: PropTypes.array.isRequired,
  team: PropTypes.object,
};

function ImportWorkflowContent({
  closeModal,
  existingWorkflowNames,
  isLoading,
  importError,
  importWorkflow,
  team,
  teams,
}) {
  const [existingNames, setExistingNames] = useState(existingWorkflowNames);

  /**
   * Return promise for reading file
   * @param file {File}
   * @return {Promise}
   */
  const readFile = (file) => {
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

  const handleChangeTeam = (selectedItem) => {
    let existingWorkflowNames = [];
    if (selectedItem?.workflows?.length) {
      existingWorkflowNames = selectedItem.workflows.map((item) => item.name);
    }
    setExistingNames(existingWorkflowNames);
  };

  const handleSubmit = async (values) => {
    const fileData = await readFile(values.file);
    importWorkflow(
      {
        ...fileData,
        shortDescription: values.summary,
        name: values.name,
        flowTeamId: values.selectedTeam?.id ?? values.file.flowTeamId,
      },
      closeModal,
      values.selectedTeam
    );
  };

  return (
    <Formik
      initialValues={{
        selectedTeam: team,
        name: "",
        summary: "",
        file: undefined,
      }}
      validateOnMount
      onSubmit={handleSubmit}
      validationSchema={Yup.object().shape({
        selectedTeam: Yup.string().required("Team is required"),
        name: Yup.string()
          .required("Please enter a name for your Workflow")
          .max(64, "Name must not be greater than 64 characters")
          .notOneOf(
            existingNames,
            "There’s already a Workflow with that name in this team, consider giving this one a different name."
          ),
        summary: Yup.string().max(128, "Summary must not be greater than 128 characters"),
        file: Yup.mixed()
          .test(
            "fileSize",
            "File is larger than 1MiB",
            // If it's bigger than 1MiB will display the error (1048576 bytes = 1 mebibyte)
            (file) => (file?.size ? file.size < 1048576 : true)
          )
          .test("validFile", "File is invalid", async (file) => {
            let isValid = true;
            if (file) {
              try {
                let contents = await readFile(file);
                isValid = checkIsValidWorkflow(contents);
              } catch (e) {
                console.error(e);
                isValid = false;
              }
            }

            // Need to return promise for yup to do async validation
            return Promise.resolve(isValid);
          }),
      })}
    >
      {(props) => {
        const { values, touched, errors, isValid, handleChange, handleBlur, handleSubmit, setFieldValue } = props;
        return (
          <ModalFlowForm title={"Add a Workflow - Select the Workflow file you want to upload"} onSubmit={handleSubmit}>
            <ModalBody className={styles.body}>
              {isLoading && <Loading />}
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
                        handleChangeTeam(selectedItem);
                      }}
                      items={teams}
                      initialSelectedItem={values.selectedTeam}
                      value={values.selectedTeam}
                      itemToString={(item) => (item ? item.name : "")}
                      titleText="Team"
                      placeholder="Select a team"
                      invalid={errors.selectedTeam}
                      invalidText={errors.selectedTeam}
                    />
                    <TextInput
                      id="name"
                      labelText="Workflow Name"
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
                      value={values.summary}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      invalid={errors.summary && touched.summary}
                      invalidText={errors.summary}
                    />
                  </div>
                )
              ) : null}
              {importError && (
                <InlineNotification
                  lowContrast
                  kind="error"
                  title="Something's Wrong"
                  subtitle="Request to import workflow failed"
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={closeModal} kind="secondary">
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid || !Boolean(values.file)} kind="primary">
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </ModalFooter>
          </ModalFlowForm>
        );
      }}
    </Formik>
  );
}

export default ImportWorkflowContent;
