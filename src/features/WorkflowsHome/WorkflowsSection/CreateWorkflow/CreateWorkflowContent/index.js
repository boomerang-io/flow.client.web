import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import { TextInput, ComboBox, TextArea } from "@boomerang/carbon-addons-boomerang-react";
import { Formik } from "formik";
import * as Yup from "yup";
import Body from "@boomerang/boomerang-components/lib/ModalContentBody";
import ConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import Footer from "@boomerang/boomerang-components/lib/ModalContentFooter";
import LoadingAnimation from "@boomerang/boomerang-components/lib/LoadingAnimation";
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
            .max(64, "Name must not be greater than 64 characters"),
          summary: Yup.string().max(128, "Summary must not be greater than 128 characters"),
          description: Yup.string().max(256, "Description must not be greater than 256 characters")
        })}
      >
        {props => {
          const { values, touched, errors, isValid, handleChange, handleBlur, handleSubmit, setFieldValue } = props;

          if (isCreating) {
            return <LoadingAnimation theme="bmrg-white" message="We'll be right with you" />;
          }

          return (
            <form onSubmit={handleSubmit}>
              <Body className={styles.formBody}>
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
                <h2 className={styles.iconsTitle}>Icon</h2>
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
                      <img key={`${image.name}-${index}`} src={image.src} alt={`${image.name} icon`} />
                    </label>
                  ))}
                </div>
              </Body>
              <Footer>
                <ConfirmButton text="SAVE" type="submit" disabled={!isValid || isCreating} theme="bmrg-white" />
              </Footer>
            </form>
          );
        }}
      </Formik>
    );
  }
}

export default CreateEditModeModalContent;
