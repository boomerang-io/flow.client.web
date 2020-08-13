import React from "react";
import classNames from "classnames/bind";
import {
  ComboBox,
  InlineNotification,
  Loading,
  ModalFlowForm,
  TextArea,
  TextInput,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, ModalBody, ModalFooter } from "@boomerang-io/carbon-addons-boomerang-react";
import workflowIcons from "Assets/workflowIcons";
import { defaultWorkflowConfig } from "./constants";
import { ComboBoxItem, FlowTeam, CreateWorkflowSummary } from "Types";
import styles from "./createWorkflow.module.scss";

let classnames = classNames.bind(styles);

interface CreateWorkflowContentProps {
  closeModal: () => void;
  createError: object;
  createWorkflow: (workflowSummary: CreateWorkflowSummary) => Promise<void>;
  existingWorkflowNames: string[];
  isLoading: boolean;
  team: FlowTeam;
  teams: FlowTeam[];
}

const CreateWorkflowContent: React.FC<CreateWorkflowContentProps> = ({
  closeModal,
  createError,
  createWorkflow,
  existingWorkflowNames = [],
  isLoading,
  team,
  teams,
}) => {
  const handleSubmit = (values: any) => {
    const requestBody = {
      ...defaultWorkflowConfig,
      flowTeamId: values.selectedTeam.id,
      name: values.name,
      shortDescription: values.summary,
      description: values.description,
      icon: values.icon,
    };
    createWorkflow(requestBody);
  };

  return (
    <Formik
      initialErrors={{ name: "Name is required" }}
      initialValues={{
        selectedTeam: team,
        name: "",
        summary: "",
        description: "",
        icon: workflowIcons[0].name,
      }}
      onSubmit={handleSubmit}
      validationSchema={Yup.object().shape({
        selectedTeam: Yup.string().required("Team is required"),
        name: Yup.string()
          .required("Name is required")
          .max(64, "Name must not be greater than 64 characters")
          .notOneOf(existingWorkflowNames, "This name already exists"),
        summary: Yup.string().max(128, "Summary must not be greater than 128 characters"),
        description: Yup.string().max(250, "Description must not be greater than 250 characters"),
      })}
    >
      {(props) => {
        const { values, touched, errors, isValid, handleChange, handleBlur, handleSubmit, setFieldValue } = props;

        return (
          <ModalFlowForm onSubmit={handleSubmit}>
            {isLoading && <Loading />}
            <ModalBody aria-label="inputs" className={styles.formBody}>
              <div className={styles.teamAndName}>
                <ComboBox
                  id="selectedTeam"
                  styles={{ marginBottom: "2.5rem" }}
                  onChange={({ selectedItem }: { selectedItem: ComboBoxItem }) =>
                    setFieldValue("selectedTeam", selectedItem ? selectedItem : "")
                  }
                  items={teams}
                  initialSelectedItem={values.selectedTeam}
                  value={values.selectedTeam}
                  itemToString={(item: ComboBoxItem) => (item ? item.name : "")}
                  titleText="Team"
                  placeholder="Select a team"
                  invalid={errors.selectedTeam}
                  invalidText={errors.selectedTeam}
                  shouldFilterItem={({ item, inputValue }: { item: ComboBoxItem; inputValue: string }) =>
                    item && item.name.toLowerCase().includes(inputValue.toLowerCase())
                  }
                />
                <TextInput
                  id="name"
                  labelText="Workflow Name"
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
                value={values.summary}
                onBlur={handleBlur}
                onChange={handleChange}
                invalid={errors.summary && touched.summary}
                invalidText={errors.summary}
              />
              <TextArea
                id="description"
                labelText="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                invalid={errors.description && touched.description}
                invalidText={errors.description}
                style={{ resize: "none", width: "100%" }}
                value={values.description}
              />
              <h2 className={styles.iconsTitle}>Pick an icon (any icon)</h2>
              <div className={styles.icons}>
                {workflowIcons.map(({ name, Icon }, index) => (
                  <label
                    key={index}
                    className={classnames({
                      icon: true,
                      "--active": values.icon === name,
                    })}
                  >
                    <input
                      type="radio"
                      value={name}
                      readOnly
                      onClick={() => setFieldValue("icon", name)}
                      checked={values.icon === name}
                    />
                    <Icon key={`${name}-${index}`} alt={`${name} icon`} />
                  </label>
                ))}
              </div>
              {createError && (
                <InlineNotification
                  lowContrast
                  kind="error"
                  title="Something's Wrong"
                  subtitle="Request to create workflow failed"
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button kind="secondary" onClick={closeModal} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid || isLoading} data-testid="workflows-create-workflow-submit">
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </ModalFooter>
          </ModalFlowForm>
        );
      }}
    </Formik>
  );
};

export default CreateWorkflowContent;
