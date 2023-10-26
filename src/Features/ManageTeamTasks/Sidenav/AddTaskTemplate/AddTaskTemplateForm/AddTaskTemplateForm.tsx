//@ts-nocheck
import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import { useMutation } from "react-query";
import * as Yup from "yup";
import {
  Button,
  Creatable,
  FileUploaderDropContainer,
  FileUploaderItem,
  InlineNotification,
  Loading,
  ModalBody,
  ModalFooter,
  ModalFlowForm,
  TextInput,
  TextArea,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { useParams } from "react-router-dom";
import SelectIcon from "Components/SelectIcon";
import orderBy from "lodash/orderBy";
import { taskIcons } from "Utils/taskIcons";
import { requiredTaskProps } from "./constants";
import { resolver } from "Config/servicesConfig";
import styles from "./addTaskTemplateForm.module.scss";

AddTaskTemplateForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  taskTemplates: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  handleAddTaskTemplate: PropTypes.func.isRequired,
};

const FILE_UPLOAD_MESSAGE = "Choose a file or drag one here";

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
        // resolve(JSON.parse(reader.result));
        resolve(reader.result);
      } catch (e) {
        reject(new DOMException("Problem parsing input file as YAML"));
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
  const params: { teamId: string } = useParams();
  let taskTemplateNames = taskTemplates.map((taskTemplate) => taskTemplate.name);
  const orderedIcons = orderBy(taskIcons, ["name"]);

  const {
    mutateAsync: validateYamlMuatator,
    error: validateYamlError,
    isLoading: validateYamlIsLoading,
    reset: resetValidateYaml,
  } = useMutation(resolver.postValidateYaml);

  const handleSubmit = async (values) => {
    const hasFile = values.file;
    let newEnvs = values.envs.map((env) => {
      let index = env.indexOf(":");
      return { name: env.substring(0, index), value: env.substring(index + 1, env.length) };
    });
    let newRevisionConfig = {
      version: 1,
      arguments: Boolean(values.arguments) ? values.arguments.trim().split(/\n{1,}/) : [],
      image: values.image,
      command: Boolean(values.command) ? values.command.trim().split(/\n{1,}/) : [],
      script: values.script,
      workingDir: values.workingDir,
      envs: newEnvs,
      serviceAccountName: values.serviceAccountName,
      securityContext: values.securityContext,
      config: hasFile && Boolean(values.currentRevision) ? values.currentRevision.config : [],
      results: hasFile && Boolean(values.currentRevision) ? values.currentRevision.results : [],
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
      scope: "team",
      flowTeamId: params?.teamId,
    };
    await handleAddTaskTemplate({ body, closeModal });
  };
  const getTemplateData = async ({ file, setFieldValue, setFieldTouched }) => {
    try {
      const yamlData = await readFile(file);
      setFieldValue("file", file);
      const response = await validateYamlMuatator({ body: yamlData });
      const fileData = response?.data;
      const selectedIcon = orderedIcons.find((icon) => icon.name === fileData?.icon);
      if (checkIsValidTask(fileData)) {
        const currentRevision = fileData.revisions.find((revision) => revision.version === fileData.currentVersion);
        setFieldValue("name", fileData.name);
        setFieldTouched("name", true);
        setFieldValue("description", fileData.description);
        setFieldTouched("description", true);
        setFieldValue("category", fileData.category);
        setFieldTouched("category", true);
        selectedIcon &&
          setFieldValue("icon", { value: selectedIcon.name, label: selectedIcon.name, icon: selectedIcon.Icon });
        setFieldValue("image", currentRevision.image);
        setFieldValue("arguments", currentRevision.arguments?.join("\n") ?? "");
        setFieldValue("command", currentRevision.command.join("\n") ?? "");
        setFieldValue("script", currentRevision.script ?? "");
        const formattedEnvs = Array.isArray(currentRevision.envs)
          ? currentRevision.envs.map((env) => {
              return `${env.name}:${env.value}`;
            })
          : [];
        setFieldValue("envs", formattedEnvs);
        setFieldValue("workingDir", currentRevision?.workingDir);
        setFieldValue("serviceAccountName", currentRevision?.serviceAccountName);
        setFieldValue("securityContext", currentRevision?.securityContext);
        setFieldValue("currentRevision", currentRevision);
        setFieldValue("fileData", fileData);
      }
    } catch (e) {
      // noop
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
        script: "",
        workingDir: "",
        serviceAccountName: "",
        securityContext: "",
        envs: [],
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
          .max(200, "The description must be less than 200 characters")
          .required("Description is required"),
        icon: Yup.object().shape({
          value: Yup.string().required(),
          label: Yup.string().required(),
        }),
        arguments: Yup.string(),
        command: Yup.string(),
        script: Yup.string().nullable(),
        workingDir: Yup.string().nullable(),
        image: Yup.string().nullable(),
        serviceAccountName: Yup.string().nullable(),
        securityContext: Yup.string().nullable(),
        file: Yup.mixed().test(
          "fileSize",
          "File is larger than 1MiB",
          // If it's bigger than 1MiB will display the error (1048576 bytes = 1 mebibyte)
          (file) => (file?.size ? file.size < 1048576 : true)
        ),
        // .test("validFile", "File is invalid", async (file) => {
        //   let isValid = true;
        //   if (file) {
        //     try {
        //       let contents = await readFile(file);
        //       isValid = checkIsValidTask(contents);
        //     } catch (e) {
        //       console.error(e);
        //       isValid = false;
        //     }
        //   }
        //   // Need to return promise for yup to do async validation
        //   return Promise.resolve(isValid);
        // }),
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
          setFieldTouched,
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
                <p className={styles.fileUploaderHelper}>File type .yaml, can only upload one file</p>
                <FileUploaderDropContainer
                  id="uploadTemplate"
                  className={styles.fileUploader}
                  accept={[".yaml"]}
                  labelText={FILE_UPLOAD_MESSAGE}
                  name="Workflow"
                  multiple={false}
                  onAddFiles={(event, { addedFiles }) => {
                    getTemplateData({ file: addedFiles[0], setFieldValue, setFieldTouched });
                  }}
                />
                {values.file && (
                  <FileUploaderItem
                    name={values.file.name}
                    status={validateYamlIsLoading ? "uploading" : "edit"}
                    onDelete={() => {
                      setFieldValue("file", undefined);
                      if (validateYamlError) {
                        resetValidateYaml();
                      }
                      if (!errors.file) {
                        resetForm();
                      }
                    }}
                  />
                )}
                {Boolean(errors.file || validateYamlError) && (
                  <InlineNotification
                    className={styles.fileUploaderNotification}
                    lowContrast
                    kind="error"
                    title="Oops there was a problem with the upload. Delete it and try again."
                    subtitle="The file should contain the required fields in this form."
                  />
                )}
                {Boolean(values.file) && !Boolean(errors.file) && !validateYamlError && !validateYamlIsLoading && (
                  <InlineNotification
                    className={styles.fileUploaderNotification}
                    lowContrast
                    kind="success"
                    title="Task file successfully imported!"
                    subtitle="Check the details below. Task Definition fields were also imported, you can view them once you’ve saved this task."
                  />
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
                helperText="Categories have strict matching, type as you want to see it"
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
              <div className={styles.description}>
                <p className={styles.descriptionLength}>{values.description?.length ?? 0}/200</p>
                <TextArea
                  id="description"
                  invalid={errors.description && touched.description}
                  invalidText={errors.description}
                  labelText="Description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                />
              </div>
              <TextInput
                id="image"
                labelText="Image (optional)"
                helperText="Path to container image. If not specified, will use the systems default."
                name="image"
                value={values.image}
                onBlur={handleBlur}
                onChange={handleChange}
                invalid={errors.image && touched.image}
                invalidText={errors.image}
              />
              <TextArea
                id="command"
                labelText="Command (optional)"
                helperText="Overrides the entry point of the container. Delimited by a new line."
                name="command"
                value={values.command}
                onBlur={handleBlur}
                onChange={handleChange}
                invalid={errors.command && touched.command}
                invalidText={errors.command}
              />
              <TextArea
                id="arguments"
                labelText="Arguments (optional)"
                helperText="Enter arguments delimited by a new line"
                placeholder="e.g. system sleep"
                name="arguments"
                value={values.arguments}
                onBlur={handleBlur}
                onChange={handleChange}
                invalid={errors.arguments && touched.arguments}
                invalidText={errors.arguments}
              />
              <TextArea
                id="script"
                invalid={errors.script && touched.script}
                invalidText={errors.script}
                labelText="Script (optional)"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.script}
              />
              <TextInput
                id="workingDir"
                invalid={errors.workingDir && touched.workingDir}
                invalidText={errors.workingDir}
                labelText="Working Directory (optional)"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.workingDir}
              />
              <Creatable
                createKeyValuePair
                id="envs"
                onChange={(createdItems: string[]) => setFieldValue("envs", createdItems)}
                keyLabelText="Environments (optional)"
                placeholder="Enter env"
                values={values.envs || []}
              />
              <TextInput
                id="serviceAccountName"
                invalid={errors.serviceAccountName && touched.serviceAccountName}
                invalidText={errors.serviceAccountName}
                labelText="Service Account Name (optional)"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.serviceAccountName}
              />
              <TextArea
                id="securityContext"
                invalid={errors.securityContext && touched.securityContext}
                invalidText={errors.securityContext}
                labelText="Security Context (optional)"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.securityContext}
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
