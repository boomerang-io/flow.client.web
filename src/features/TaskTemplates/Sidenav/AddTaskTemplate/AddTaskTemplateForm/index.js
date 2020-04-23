import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import cx from "classnames";
import {
  ModalFlowForm,
  TextInput,
  TextArea,
  FileUploaderDropContainer,
  FileUploaderItem
} from "@boomerang/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter, Loading } from "carbon-components-react";
import { ErrorFilled32, CheckmarkFilled32 } from "@carbon/icons-react";
import taskTemplateIcons from "Assets/taskTemplateIcons";
import { requiredTaskProps } from "./constants";
import styles from "./addTaskTemplateForm.module.scss";

AddTaskTemplateForm.propTypes = {
  closeModal: PropTypes.func,
  handleSelectMode: PropTypes.func,
  currentComponent: PropTypes.object,
  formData: PropTypes.object
};

const FILE_UPLOAD_MESSAGE = "Choose a file or drag one here";
const createInvalidTextMessage = `Oops there was a problem with the upload, delete it and try again. The file should contain the required fields in this form and.`;
const createValidTextMessage = `Task file successfully imported!`;

function checkIsValidTask(data) {
  // Only check if the .json file contain the required key data
  // This validate can be improved
  let isValid = true;
  requiredTaskProps.forEach(prop => {
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
const readFile = file => {
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
  let taskTemplateNames = taskTemplates.map(taskTemplate => taskTemplate.name);
  let taskTemplateKeys = taskTemplates.map(taskTemplate => taskTemplate.key);

  const handleSubmit = async values => {
    const hasFile = values.file;
    let newRevisionConfig = {
      version: 1,
      icon: values.icon,
      arguments: values.arguments.trim().split(/\s{1,}/),
      image: values.image,
      command: values.command,
      config: hasFile ? values.currentRevision.config : []
    };
    const body = {
      name: values.name,
      description: values.description,
      category: values.category,
      key: values.key,
      currentVersion: 1,
      revisions: [newRevisionConfig],
      nodeType: "templateTask",
      status: "active"
    };
    await handleAddTaskTemplate({ body, closeModal });
  };
  const getTemplateData = async (file, setFieldValue) => {
    const fileData = await readFile(file);
    if (checkIsValidTask(fileData)) {
      const currentRevision = fileData.revisions.find(revision => revision.version === fileData.currentVersion);
      setFieldValue("key", `new.${fileData.key}`);
      setFieldValue("name", fileData.name);
      setFieldValue("description", fileData.description);
      setFieldValue("category", fileData.category);
      setFieldValue("icon", currentRevision.icon);
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
        key: "",
        name: "",
        category: "",
        // category: categories[0],
        icon: taskTemplateIcons[0].name,
        description: "",
        arguments: "",
        command: "",
        fileData: {},
        file: undefined
      }}
      validationSchema={Yup.object().shape({
        key: Yup.string()
          .required("Enter a Key")
          .notOneOf(taskTemplateKeys, "Enter a unique value for key"),
        name: Yup.string()
          .required("Enter a name")
          .notOneOf(taskTemplateNames, "Enter a unique value for component name"),
        category: Yup.string().required("Enter a category"),
        description: Yup.string()
          .lowercase()
          .min(4, "The description must be at least 4 characters")
          .max(200, "The description must be less than 60 characters")
          .required("Enter a desccription"),
        arguments: Yup.string(),
        // .required("Enter some arguments")
        command: Yup.string(),
        // .required("Enter a command")
        image: Yup.string(),
        // .required("Enter a image")
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
                let contents = await readFile(file);
                isValid = checkIsValidTask(contents);
              } catch (e) {
                console.error(e);
                isValid = false;
              }
            }
            // Need to return promise for yup to do async validation
            return Promise.resolve(isValid);
          })
      })}
      onSubmit={handleSubmit}
      initialErrors={[{ name: "Name required" }]}
    >
      {props => {
        const {
          handleSubmit,
          isValid,
          values,
          errors,
          touched,
          handleChange,
          setFieldValue,
          handleBlur,
          resetForm
        } = props;
        return (
          <ModalFlowForm onSubmit={handleSubmit} className={styles.container}>
            <ModalBody>
              {isLoading && <Loading />}
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
              <TextInput
                id="key"
                labelText="Key"
                placeholder="Key"
                name="key"
                value={values.key}
                onBlur={handleBlur}
                onChange={handleChange}
                invalid={errors.key && touched.key}
                invalidText={errors.key}
              />
              <TextInput
                id="name"
                invalid={errors.name && touched.name}
                invalidText={errors.name}
                labelText="Name"
                helperText="Must be unique"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Name"
                value={values.name}
              />
              <TextInput
                id="category"
                invalid={errors.category && touched.category}
                invalidText={errors.category}
                labelText="Category"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Category"
                value={values.category}
              />
              {/* <ComboBox
                id="category"
                helperText="Choose which category it falls under"
                invalid={errors.category && touched.category}
                invalidText={errors.category}
                onBlur={handleBlur}
                items={categories}
                initialSelectedItem={values.category}
                onChange={({ selectedItem }) => setFieldValue("category", selectedItem)}
                className={styles.teamsDropdown}
              /> */}
              <TextInput
                id="image"
                labelText="Image"
                // helperText="Helper text for image"
                placeholder="Image"
                name="image"
                value={values.image}
                onBlur={handleBlur}
                onChange={handleChange}
                invalid={errors.image && touched.image}
                invalidText={errors.image}
              />
              <TextInput
                id="command"
                labelText="Comand"
                // helperText="Helper text for command"
                placeholder="Command"
                name="command"
                value={values.command}
                onBlur={handleBlur}
                onChange={handleChange}
                invalid={errors.command && touched.command}
                invalidText={errors.command}
              />
              <TextInput
                id="arguments"
                labelText="Arguments"
                helperText="Type the argument with spaces - e.g., slack message mail"
                placeholder="Arguments"
                name="arguments"
                value={values.arguments}
                onBlur={handleBlur}
                onChange={handleChange}
                invalid={errors.arguments && touched.arguments}
                invalidText={errors.arguments}
              />
              <p className={styles.iconTitle}>Icon</p>
              <p className={styles.iconSubtitle}>Choose the icon that best fits this task</p>
              <div className={styles.iconsWrapper}>
                {taskTemplateIcons.map((image, index) => (
                  <label
                    className={cx(styles.iconLabel, {
                      [styles.active]: values.icon === image.name
                    })}
                    key={`icon-number-${index}`}
                  >
                    <input
                      id={image.taskTemplateNames}
                      readOnly
                      checked={values.icon === image.name}
                      onClick={() => setFieldValue("icon", image.name)}
                      value={image.name}
                      type="radio"
                    />
                    <image.src key={`${image.name}-${index}`} alt={`${image.name} icon`} className={styles.icon} />
                  </label>
                ))}
              </div>
              <TextArea
                id="description"
                invalid={errors.description && touched.description}
                invalidText={errors.description}
                labelText="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Description"
                value={values.description}
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
