//@ts-nocheck
import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import orderBy from "lodash/orderBy";
import {
  Button,
  Creatable,
  ModalBody,
  ModalFooter,
  ModalForm,
  TextInput,
  TextArea,
} from "@boomerang-io/carbon-addons-boomerang-react";
import SelectIcon from "Components/SelectIcon";
import { taskIcons } from "Utils/taskIcons";

EditTaskTemplateForm.propTypes = {
  closeModal: PropTypes.func,
  handleEditTaskTemplateModal: PropTypes.func,
  nodeType: PropTypes.string,
  taskTemplates: PropTypes.array,
  templateData: PropTypes.object,
};

function EditTaskTemplateForm({ closeModal, handleEditTaskTemplateModal, nodeType, taskTemplates, templateData }) {
  let taskTemplateNames = taskTemplates
    .map((taskTemplate) => taskTemplate.name)
    .filter((templateName) => templateName !== templateData.name);
  const orderedIcons = orderBy(taskIcons, ["name"]);
  const selectedIcon = orderedIcons.find((icon) => icon.name === templateData.icon);
  const handleSubmit = async (values) => {
    await handleEditTaskTemplateModal({ newValues: values });
    closeModal();
  };

  const formattedEnvs = templateData.envs.map((env) => {
    return `${env.name}:${env.value}`;
  });

  return (
    <Formik
      initialValues={{
        name: templateData.name,
        category: templateData.category,
        icon: selectedIcon ? { value: selectedIcon.name, label: selectedIcon.name, icon: selectedIcon.icon } : {},
        description: templateData.description,
        arguments: templateData.arguments,
        command: templateData.command,
        image: templateData.image,
        nodeType: nodeType,
        script: templateData.script,
        workingDir: templateData.workingDir,
        envs: formattedEnvs,
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required("Name is required")
          .notOneOf(taskTemplateNames, "Enter a unique value for task name"),
        category: Yup.string().required("Enter a category"),
        icon: Yup.object().shape({
          value: Yup.string().required(),
          label: Yup.string().required(),
        }),
        description: Yup.string()
          .lowercase()
          .min(4, "Description must be at least four characters")
          .max(200, "Description must be less than 60 characters")
          .required("Description is required"),
        arguments: Yup.string().nullable(),
        command: Yup.string().nullable(),
        image: Yup.string().nullable(),
        script: Yup.string().nullable(),
        workingDir: Yup.string().nullable(),
      })}
      onSubmit={handleSubmit}
      initialErrors={[{ name: "Name required" }]}
    >
      {(props) => {
        const { handleSubmit, isValid, values, errors, touched, handleChange, setFieldValue, handleBlur } = props;
        return (
          <ModalForm onSubmit={handleSubmit}>
            <ModalBody aria-label="inputs">
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
              <TextArea
                id="description"
                invalid={errors.description && touched.description}
                invalidText={errors.description}
                labelText="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
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
              <TextInput
                id="workingDir"
                invalid={errors.workingDir && touched.workingDir}
                invalidText={errors.workingDir}
                labelText="Working Directory (optional)"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.workingDir}
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
              <TextArea
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
              <TextArea
                id="script"
                invalid={errors.script && touched.script}
                invalidText={errors.script}
                labelText="Script (optional)"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.script}
              />
              <Creatable
                createKeyValuePair
                id="envs"
                onChange={(createdItems: string[]) => setFieldValue("envs", createdItems)}
                keyLabelText="Environments (optional)"
                placeholder="Enter env"
                values={values.envs || []}
              />
            </ModalBody>
            <ModalFooter>
              <Button kind="secondary" onClick={closeModal} type="button">
                Cancel
              </Button>
              <Button disabled={!isValid} type="submit">
                Update
              </Button>
            </ModalFooter>
          </ModalForm>
        );
      }}
    </Formik>
  );
}

export default EditTaskTemplateForm;
