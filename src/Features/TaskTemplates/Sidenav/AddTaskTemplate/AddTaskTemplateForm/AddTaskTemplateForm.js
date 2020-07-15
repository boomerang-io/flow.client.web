import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  ModalFlowForm,
  TextInput,
  TextArea,
  FileUploaderDropContainer,
  FileUploaderItem,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter, Loading } from "@boomerang-io/carbon-addons-boomerang-react";
import { ErrorFilled32, CheckmarkFilled32 } from "@carbon/icons-react";
import SelectIcon from "Components/SelectIcon";
import orderBy from "lodash/orderBy";
import { taskIcons } from "Utils/taskIcons";
import { requiredTaskProps } from "./constants";
import styles from "./addTaskTemplateForm.module.scss";

AddTaskTemplateForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  taskTemplates: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  handleAddTaskTemplate: PropTypes.func.isRequired,
};

const FILE_UPLOAD_MESSAGE = "Choose a file or drag one here";
const createInvalidTextMessage = `Oops there was a problem with the upload, delete it and try again. The file should contain the required fields in this form and.`;
const createValidTextMessage = `Task file successfully imported!`;

function checkIsValidTask(data) {
  // Only check if the .json file contain the required key data
  // This validate can be improved
  let isValid = true;
  requiredTaskProps.forEach((prop) => {
    if (!data.hasOwnProperty(prop)) {
      isValid = false;
    }
  });
  return isValid;
}
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

// const categories = [
//   {value:"github" , label: "GitHub"},
//   {value:"boomerang" , label: "Boomerang"},
//   {value:"artifactory" , label: "Artifactory"},
//   {value:"utilities" , label: "Utilities"}
// ];

function AddTaskTemplateForm({ closeModal, taskTemplates, isLoading, handleAddTaskTemplate }) {
  let taskTemplateNames = taskTemplates.map((taskTemplate) => taskTemplate.name);
  const orderedIcons = orderBy(taskIcons, ["name"]);

  const handleSubmit = async (values) => {
    const hasFile = values.file;
    let newRevisionConfig = {
      version: 1,
      arguments: values.arguments.trim().split(/\s{1,}/),
      image: values.image,
      command: values.command,
      config: hasFile ? values.currentRevision.config : [],
      changelog: { reason: "" },
    };
    const body = {
      name: values.name,
      description: values.description,
      category: values.category,
      currentVersion: 1,
      revisions: [newRevisionConfig],
      icon: values.icon.value,
      nodeType: "templateTask",
      status: "active",
    };
    await handleAddTaskTemplate({ body, closeModal });
  };
  const getTemplateData = async (file, setFieldValue) => {
    const fileData = await readFile(file);
    const selectedIcon = orderedIcons.find((icon) => icon.name === fileData.icon);
    if (checkIsValidTask(fileData)) {
      const currentRevision = fileData.revisions.find((revision) => revision.version === fileData.currentVersion);
      setFieldValue("name", fileData.name);
      setFieldValue("description", fileData.description);
      setFieldValue("category", fileData.category);
      selectedIcon &&
        setFieldValue("icon", { value: selectedIcon.name, label: selectedIcon.name, icon: selectedIcon.Icon });
      setFieldValue("image", currentRevision.image);
      setFieldValue("arguments", currentRevision.arguments?.join(" ") ?? "");
      setFieldValue("command", currentRevision.command ?? "");
      setFieldValue("currentRevision", currentRevision);
      setFieldValue("fileData", fileData);
    }
  };

  return (
    <Formik
      initialValues={{
        name: "",
        category: "",
        // category: categories[0],
        icon: {},
        description: "",
        arguments: "",
        command: "",
        fileData: {},
        file: undefined,
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required("Name is required")
          .notOneOf(taskTemplateNames, "Enter a unique value for task name"),
        category: Yup.string().required("Enter a category"),
        description: Yup.string()
          .lowercase()
          .min(4, "Description must be at least four characters")
          .max(200, "The description must be less than 60 characters")
          .required("Description is required"),
        icon: Yup.object().shape({
          value: Yup.string().required(),
          label: Yup.string().required(),
        }),
        arguments: Yup.string().required("Arguments are required"),
        command: Yup.string(),
        // .required("Enter a command")
        image: Yup.string(),
        //.required("Image is required"),
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
                isValid = checkIsValidTask(contents);
              } catch (e) {
                console.error(e);
                isValid = false;
              }
            }
            // Need to return promise for yup to do async validation
            return Promise.resolve(isValid);
          }),
      })}
      onSubmit={handleSubmit}
      initialErrors={[{ name: "Name required" }]}
    >
      {(props) => {
        const {
          handleSubmit,
          isValid,
          values,
          errors,
          touched,
          handleChange,
          setFieldValue,
          handleBlur,
          resetForm,
        } = props;
        return (
          <ModalFlowForm onSubmit={handleSubmit} className={styles.container}>
            <ModalBody>
              {isLoading && <Loading />}
              <div>
                <label className={styles.fileUploaderLabel} htmlFor="uploadTemplate">
                  Import task file (optional)
                </label>
                <p className={styles.fileUploaderHelper}>File type .json, can only upload one file</p>
                <FileUploaderDropContainer
                  id="uploadTemplate"
                  className={styles.fileUploader}
                  accept={[".json"]}
                  labelText={FILE_UPLOAD_MESSAGE}
                  name="Workflow"
                  multiple={false}
                  onAddFiles={async (event, { addedFiles }) => {
                    await setFieldValue("file", addedFiles[0]);
                    getTemplateData(addedFiles[0], setFieldValue);
                  }}
                />
                {values.file && (
                  <FileUploaderItem
                    name={values.file.name}
                    status="edit"
                    onDelete={() => {
                      setFieldValue("file", undefined);
                      if (!errors.file) {
                        resetForm();
                      }
                    }}
                  />
                )}
                {Boolean(errors.file) && (
                  <div className={styles.validMessage}>
                    <ErrorFilled32 aria-label="error-import-icon" className={styles.errorIcon} />
                    <p className={styles.message}>{createInvalidTextMessage}</p>
                  </div>
                )}
                {Boolean(values.file) && !Boolean(errors.file) && (
                  <>
                    <div className={styles.validMessage}>
                      <CheckmarkFilled32 aria-label="error-import-icon" className={styles.successIcon} />
                      <p className={styles.message}>{createValidTextMessage}</p>
                    </div>
                    <p className={styles.successMessage}>
                      Check the details below. Task Definition fields were also imported, you can view them once you’ve
                      saved this task.
                    </p>
                  </>
                )}
              </div>
              <TextInput
                id="name"
                invalid={errors.name && touched.name}
                invalidText={errors.name}
                labelText="Name"
                helperText="Must be unique"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Enter a name"
                value={values.name}
              />
              <TextInput
                id="category"
                invalid={errors.category && touched.category}
                invalidText={errors.category}
                labelText="Category"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="e.g. communication"
                value={values.category}
              />
              <SelectIcon
                onChange={({ selectedItem }) => Boolean(selectedItem) && setFieldValue("icon", selectedItem)}
                selectedIcon={values.icon}
                iconOptions={orderedIcons}
              />
              <TextArea
                id="description"
                invalid={errors.description && touched.description}
                invalidText={errors.description}
                labelText="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
              />
              <TextInput
                id="arguments"
                labelText="Arguments"
                helperText="Enter arguments delimited by a space character"
                placeholder="e.g. system sleep"
                name="arguments"
                value={values.arguments}
                onBlur={handleBlur}
                onChange={handleChange}
                invalid={errors.arguments && touched.arguments}
                invalidText={errors.arguments}
              />

              <TextInput
                id="image"
                labelText="Image (optional)"
                helperText="Path to container image"
                name="image"
                value={values.image}
                onBlur={handleBlur}
                onChange={handleChange}
                invalid={errors.image && touched.image}
                invalidText={errors.image}
              />
              <TextInput
                id="command"
                labelText="Command (optional)"
                helperText="Override the entry point of the container"
                name="command"
                value={values.command}
                onBlur={handleBlur}
                onChange={handleChange}
                invalid={errors.command && touched.command}
                invalidText={errors.command}
              />
            </ModalBody>
            <ModalFooter>
              <Button kind="secondary" onClick={closeModal} type="button">
                Cancel
              </Button>
              <Button disabled={!isValid || isLoading} type="submit">
                {!isLoading ? "Create" : "...Creating"}
              </Button>
            </ModalFooter>
          </ModalFlowForm>
        );
      }}
    </Formik>
  );
}

export default AddTaskTemplateForm;
