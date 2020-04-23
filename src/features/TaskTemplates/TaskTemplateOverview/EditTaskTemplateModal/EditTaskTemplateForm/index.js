import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import cx from "classnames";
import { ModalFlowForm, TextInput, TextArea } from "@boomerang/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter } from "carbon-components-react";
import taskTemplateIcons from "Assets/taskTemplateIcons";
import styles from "./editTaskTemplateForm.module.scss";

EditTaskTemplateForm.propTypes = {
  closeModal: PropTypes.func,
  handleEditTaskTemplateModal: PropTypes.func,
  taskTemplates: PropTypes.array,
  values: PropTypes.object
};

// const categories = [
//   {value:"github" , label: "GitHub"},
//   {value:"boomerang" , label: "Boomerang"},
//   {value:"artifactory" , label: "Artifactory"},
//   {value:"utilities" , label: "Utilities"}
// ];

function EditTaskTemplateForm({ closeModal, taskTemplates, handleEditTaskTemplateModal, templateData }) {
  let taskTemplateNames = taskTemplates
    .map(taskTemplate => taskTemplate.name)
    .filter(templateName => templateName !== templateData.name);
  const handleSubmit = async values => {
    await handleEditTaskTemplateModal({ newValues: values });
    closeModal();
  };
  return (
    <Formik
      initialValues={{
        name: templateData.name,
        category: templateData.category,
        icon: templateData.icon,
        description: templateData.description,
        arguments: templateData.arguments,
        command: templateData.command,
        image: templateData.image
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required("Enter a name")
          .notOneOf(taskTemplateNames, "Enter a unique value for component name"),
        category: Yup.string().required("Select a category"),
        description: Yup.string()
          .lowercase()
          .min(4, "The description must be at least 4 characters")
          .max(200, "The description must be less than 60 characters")
          .required("Enter a desccription"),
        arguments: Yup.string(),
        // .required("Enter some arguments")
        command: Yup.string(),
        // .required("Enter a command")
        image: Yup.string()
        // .required("Enter a image")
      })}
      onSubmit={handleSubmit}
      initialErrors={[{ name: "Name required" }]}
    >
      {props => {
        const { handleSubmit, isValid, values, errors, touched, handleChange, setFieldValue, handleBlur } = props;
        return (
          <ModalFlowForm onSubmit={handleSubmit}>
            <ModalBody>
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
                labelText="Command"
                helperText="Helper text for command"
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
              <Button disabled={!isValid} type="submit">
                Update
              </Button>
            </ModalFooter>
          </ModalFlowForm>
        );
      }}
    </Formik>
  );
}

export default EditTaskTemplateForm;
