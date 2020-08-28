import React, { useState } from "react";
import { Formik, FormikProps } from "formik";
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
import { requiredWorkflowProps } from "./constants";
import { ErrorFilled32 } from "@carbon/icons-react";
import { FlowTeam, WorkflowExport, WorkflowSummary } from "Types";
import styles from "./importWorkflowContent.module.scss";

const FILE_UPLOAD_MESSAGE = "Choose a file or drag one here";
const createInvalidTextMessage = (message: string | undefined) => `Whoops! ${message}. Please choose a different one.`;

function checkIsValidWorkflow(data: any) {
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

interface ImportWorkflowContentProps {
  closeModal(): void;
  existingWorkflowNames: string[];
  isLoading: boolean;
  importError: any;
  importWorkflow: (workflowExport: WorkflowExport, closeModal: () => void, team: FlowTeam) => Promise<void>;
  teams: FlowTeam[];
  team: FlowTeam;
}

interface FormProps {
  selectedTeam: FlowTeam;
  name: string;
  summary: string;
  file: WorkflowExport | undefined;
}

const ImportWorkflowContent: React.FC<ImportWorkflowContentProps> = ({
  closeModal,
  existingWorkflowNames,
  isLoading,
  importError,
  importWorkflow,
  team,
  teams,
}) => {
  const [existingNames, setExistingNames] = useState(existingWorkflowNames);

  /**
   * Return promise for reading file
   * @param file {File}
   * @return {Promise}
   */
  const readFile = (file: any): Promise<WorkflowExport> => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onerror = () => {
        reader.abort();
        reject(new DOMException("Problem parsing input file"));
      };

      reader.onload = () => {
        try {
          if (typeof reader.result === "string") {
            resolve(JSON.parse(reader.result));
          } else {
            throw new Error();
          }
        } catch (e) {
          reject(new DOMException("Problem parsing input file as JSON"));
          return;
        }
      };

      reader.readAsText(file);
    });
  };

  const handleChangeTeam = (selectedItem: FlowTeam) => {
    let existingWorkflowNames: any = [];
    if (selectedItem?.workflows?.length) {
      existingWorkflowNames = selectedItem.workflows.map((item: WorkflowSummary) => item.name);
    }
    setExistingNames(existingWorkflowNames);
  };

  const handleSubmit = async (values: any) => {
    const fileData: WorkflowExport = await readFile(values.file);
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
      {(props: FormikProps<FormProps>) => {
        const { values, touched, errors, isValid, handleChange, handleBlur, handleSubmit, setFieldValue } = props;
        return (
          <>
            {isLoading && <Loading />}
            <ModalBody className={styles.body}>
              <p>Add a Workflow - Select the Workflow file you want to upload</p>
              <FileUploaderDropContainer
                accept={[".json"]}
                labelText={FILE_UPLOAD_MESSAGE}
                name="Workflow"
                multiple={false}
                onAddFiles={(event: React.SyntheticEvent, { addedFiles }: { addedFiles: { name: string }[] }) =>
                  setFieldValue("file", addedFiles[0])
                }
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
                      onChange={({ selectedItem }: { selectedItem: FlowTeam }) => {
                        setFieldValue("selectedTeam", selectedItem ? selectedItem : "");
                        handleChangeTeam(selectedItem);
                      }}
                      items={teams}
                      initialSelectedItem={values.selectedTeam}
                      value={values.selectedTeam}
                      itemToString={(item: FlowTeam) => (item ? item.name : "")}
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
              <Button disabled={!isValid || !Boolean(values.file)} kind="primary" onClick={handleSubmit}>
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </ModalFooter>
          </>
        );
      }}
    </Formik>
  );
};

export default ImportWorkflowContent;
