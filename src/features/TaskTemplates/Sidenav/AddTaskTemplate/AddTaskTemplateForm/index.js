import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import cx from "classnames";
import { ModalFlowForm, TextInput, TextArea, ComboBox } from "@boomerang/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter, Loading } from "carbon-components-react";
import workflowIcons from "Assets/workflowIcons";
import styles from "./addTaskTemplateForm.module.scss";

ModeProperties.propTypes = {
  closeModal: PropTypes.func,
  handleSelectMode: PropTypes.func,
  currentComponent: PropTypes.object,
  formData: PropTypes.object
};

const categories = [
  {value:"github" , label: "GitHub"},
  {value:"boomerang" , label: "Boomerang"},
  {value:"artifactory" , label: "Artifactory"},
  {value:"utilities" , label: "Utilities"}
];

function ModeProperties({ closeModal, taskTemplates, isLoading, handleAddTaskTemplate }) {
  let taskTemplateNames = taskTemplates.map(taskTemplate => taskTemplate.name);

  const handleSubmit = async values => {
    let newRevisionConfig = {
      version: 1,
      image: values.icon, 
      arguments: "",
      config: []
    };
    const body =  
    {
      name: values.name,
      description: values.description,
      category: values.category.value,
      key: values.name,
      currentVersion: 1,
      revisions:[newRevisionConfig],
      nodeType: "templateTask"
    };
    await handleAddTaskTemplate({body, closeModal});
  };
  return (
    <Formik
      initialValues={{
        name: "",
        category: categories[0],
        icon: workflowIcons[0].name,
        description: ""
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required("Enter a name")
          .notOneOf(
            taskTemplateNames,
            "Enter a unique value for component name"
          ),
        category: Yup.string()
          .required("Select a category"),
        description: Yup.string()
          .lowercase()
          .min(4, "The description must be at least 4 characters")
          .max(200, "The description must be less than 60 characters")
          .required("Enter a desccription")
      })}
      onSubmit={handleSubmit}
      initialErrors={[{name:"Name required"}]}
    >
      { props => {
        const { handleSubmit, isValid, values, errors, touched, handleChange, setFieldValue, handleBlur } = props;
        return (
          <ModalFlowForm onSubmit={handleSubmit}>
            <ModalBody>
              {isLoading && <Loading />}
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
              <ComboBox
                id="category"
                helperText="Choose which category it falls under"
                invalid={errors.category && touched.category}
                invalidText={errors.category}
                onBlur={handleBlur}
                items={categories}
                initialSelectedItem={values.category}
                onChange={({ selectedItem }) => setFieldValue("category", selectedItem)}
                className={styles.teamsDropdown}
              />
              <p className={styles.iconTitle}>Icon</p>
              <p className={styles.iconSubtitle}>Choose the icon that best fits this task</p>
              <div className={styles.iconsWrapper}>
                {workflowIcons.map((image, index) => (
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

export default ModeProperties;
