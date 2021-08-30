//@ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames/bind";
import {
  ComboBox,
  InlineNotification,
  Loading,
  RadioGroup,
  TextArea,
  TextInput,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { Formik } from "formik";
import * as Yup from "yup";
import capitalize from "lodash/capitalize";
import { Button, ModalBody, ModalFooter, ModalFlowForm, TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import workflowIcons from "Assets/workflowIcons";
import { defaultWorkflowConfig } from "./constants";
import { ComboBoxItem, FlowTeam, WorkflowTemplate, WorkflowSummary } from "Types";
import { WorkflowScope } from "Constants";
import styles from "./createWorkflow.module.scss";

let classnames = classNames.bind(styles);

const MY_WORKFLOWS = "My Workflows";
const TEAM_WORKFLOWS = "Team Workflows";

export const radioWorkflowOptions = [
  {
    id: "my-workflows-radio-id",
    labelText: MY_WORKFLOWS,
    value: MY_WORKFLOWS,
  },
  {
    id: "team-workflows-radio-id",
    labelText: TEAM_WORKFLOWS,
    value: TEAM_WORKFLOWS,
  },
];

interface CreateWorkflowContentProps {
  closeModal: () => void;
  createError: any;
  createWorkflow: (workflowSummary: WorkflowTemplate) => Promise<void>;
  isLoading: boolean;
  team?: FlowTeam | null;
  teams?: FlowTeam[] | null;
  formData: any;
  saveValues: any;
  requestPreviousStep: any;
  userWorkflows: WorkflowSummary[];
  scope?: string;
}

const CreateWorkflowContent: React.FC<CreateWorkflowContentProps> = ({
  formData,
  saveValues,
  requestPreviousStep,
  userWorkflows,
  closeModal,
  createError,
  createWorkflow,
  isLoading,
  team,
  teams,
  scope,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<FlowTeam | null>(team ?? null);
  const [selectedOption, setSelectedOption] = React.useState(MY_WORKFLOWS);
  const formikRef = useRef<any>();

  const existingWorkflowNames = selectedTeam?.workflows.map((workflow) => workflow.name) ?? [];

  useEffect(() => {
    formikRef.current?.validateForm();
  }, [selectedTeam]);

  const handleSubmit = (values: any) => {
    const requestBody = {
      scope: scope ? scope : selectedOption === MY_WORKFLOWS? "user" : "team",
      icon: selectedTeam,
    };
    //@ts-ignore
    createWorkflow(requestBody);
  };

  return (
    <Formik
      validateOnMount
      innerRef={formikRef}
      initialValues={{
        name: formData.selectedWorkflow.name,
        summary: formData.selectedWorkflow?.summary ?? "",
        description: formData.selectedWorkflow?.description ?? "",
        icon: formData.selectedWorkflow.icon,
      }}
      onSubmit={handleSubmit}
      validationSchema={Yup.object().shape({
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
          <ModalFlowForm>
            {isLoading && <Loading />}
            <ModalBody aria-label="inputs" className={styles.formBody}>
              <div className={styles.typeRadio}>
                <RadioGroup
                  name="workflow-options"
                  options={radioWorkflowOptions}
                  onChange={setSelectedOption}
                  value={selectedOption}
                />
              </div>
              {selectedOption === TEAM_WORKFLOWS ? (
                <div className={styles.teamAndName}>
                  <ComboBox
                    id="selectedTeam"
                    styles={{ marginBottom: "2.5rem" }}
                    onChange={({ selectedItem }: { selectedItem: FlowTeam }) =>
                      setSelectedTeam(selectedItem ? selectedItem : null)
                    }
                    items={teams}
                    initialSelectedItem={selectedTeam}
                    value={selectedTeam}
                    itemToString={(item: ComboBoxItem) => (item ? item.name : "")}
                    titleText="Team"
                    placeholder="Select a team"
                    invalid={selectedOption === TEAM_WORKFLOWS && !Boolean(selectedTeam)}
                    invalidText="Team is required"
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
              ) : (
                <TextInput
                  id="name"
                  labelText="Workflow Name"
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  invalid={errors.name && touched.name}
                  invalidText={errors.name}
                />
              )}
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
                {workflowIcons.map(({ name, Icon }: any, index) => (
                  <TooltipHover direction="top" tooltipText={capitalize(name)}>
                    <label
                      key={index}
                      className={classnames(styles.icon, {
                        [styles.activeIcon]: values.icon === name,
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
                  </TooltipHover>
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
              <Button kind="secondary" onClick={requestPreviousStep} type="button">
                Back
              </Button>
              <Button
                data-testid="workflows-create-workflow-submit"
                disabled={!isValid || isLoading}
                onClick={handleSubmit}
              >
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
