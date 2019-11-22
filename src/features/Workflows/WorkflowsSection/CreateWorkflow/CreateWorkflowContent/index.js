import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import { TextInput, ComboBox, TextArea, ModalFlowForm } from "@boomerang/carbon-addons-boomerang-react";
import Loading from "Components/Loading";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, ModalBody, ModalFooter } from "carbon-components-react";
import workflowIcons from "Assets/workflowIcons";
import { defaultWorkflowConfig } from "./constants.js";
import styles from "./createWorkflow.module.scss";

let classnames = classNames.bind(styles);

class CreateEditModeModalContent extends Component {
  static propTypes = {
    createWorkflow: PropTypes.func.isRequired,
    isCreating: PropTypes.bool,
    teams: PropTypes.array.isRequired
  };

  handleSubmit = values => {
    const requestBody = {
      ...defaultWorkflowConfig,
      flowTeamId: values.selectedTeam.id,
      name: values.name,
      shortDescription: values.summary,
      description: values.description,
      icon: values.icon
    };
    this.props.createWorkflow(requestBody);
  };

  render() {
    const { team, teams, isCreating } = this.props;
    return (
      <Formik
        initialValues={{
          selectedTeam: team,
          name: "",
          summary: "",
          description: "",
          icon: workflowIcons[0].name
        }}
        onSubmit={this.handleSubmit}
        validationSchema={Yup.object().shape({
          selectedTeam: Yup.string().required("Team is required"),
          name: Yup.string()
            .required("Name is required")
            .max(64, "Name must not be greater than 64 characters")
            .notOneOf(this.props.names, "This name already exists"),
          summary: Yup.string().max(128, "Summary must not be greater than 128 characters"),
          description: Yup.string().max(250, "Description must not be greater than 250 characters")
        })}
      >
        {props => {
          const { values, touched, errors, isValid, handleChange, handleBlur, handleSubmit, setFieldValue } = props;

          if (isCreating) {
            return <Loading />;
          }

          return (
            <ModalFlowForm onSubmit={handleSubmit}>
              <ModalBody className={styles.formBody}>
                <div className={styles.teamAndName}>
                  <ComboBox
                    id="selectedTeam"
                    styles={{ marginBottom: "2.5rem" }}
                    onChange={({ selectedItem }) => setFieldValue("selectedTeam", selectedItem ? selectedItem : "")}
                    items={teams}
                    initialSelectedItem={values.selectedTeam}
                    value={values.selectedTeam}
                    itemToString={item => (item ? item.name : "")}
                    titleText="Team"
                    placeholder="Select a team"
                    invalid={errors.selectedTeam}
                    invalidText={errors.selectedTeam}
                    shouldFilterItem={({ item, inputValue }) =>
                      item && item.name.toLowerCase().includes(inputValue.toLowerCase())
                    }
                  />
                  <TextInput
                    id="name"
                    labelText="Name"
                    placeholder="Name"
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    invalid={errors.name && touched.name}
                    invalidText={errors.name}
                  />
                </div>
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
                <TextArea
                  id="description"
                  labelText="Description"
                  placeholder="Description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  invalid={errors.description && touched.description}
                  invalidText={errors.description}
                  resize={false}
                  style={{ resize: "none", width: "100%" }}
                  value={values.description}
                />
                <h2 className={styles.iconsTitle}>Pick an icon (any icon)</h2>
                <div className={styles.icons}>
                  {workflowIcons.map((image, index) => (
                    <label
                      key={index}
                      className={classnames({
                        icon: true,
                        "--active": values.icon === image.name
                      })}
                    >
                      <input
                        type="radio"
                        value={image.name}
                        readOnly
                        onClick={() => setFieldValue("icon", image.name)}
                        checked={values.icon === image.name}
                      />
                      <image.src key={`${image.name}-${index}`} alt={`${image.name} icon`} />
                    </label>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button kind="secondary" onClick={this.props.closeModal} type="button">
                  Cancel
                </Button>
                <Button type="submit" disabled={!isValid || isCreating}>
                  Create
                </Button>
              </ModalFooter>
            </ModalFlowForm>
          );
        }}
      </Formik>
    );
  }
}

export default CreateEditModeModalContent;
