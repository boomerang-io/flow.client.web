import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames/bind";
import {
  ComboBox,
  Loading,
  RadioGroup,
  TextArea,
  TextInput,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { Formik } from "formik";
import * as Yup from "yup";
import capitalize from "lodash/capitalize";
import { Button, InlineNotification, ModalBody, ModalFooter  } from "@carbon/react";
import { ModalFlowForm, TooltipHover} from "@boomerang-io/carbon-addons-boomerang-react";
import workflowIcons from "Assets/workflowIcons";
import { ComboBoxItem, FlowTeam, WorkflowSummary, UserWorkflow } from "Types";
import { WorkflowScope } from "Constants";
import styles from "./createWorkflow.module.scss";

let classnames = classNames.bind(styles);

export const radioWorkflowOptions = [
  {
    id: "my-workflows-radio-id",
    labelText: "My Workflows",
    value: WorkflowScope.User,
  },
  {
    id: "team-workflows-radio-id",
    labelText: "Team Workflows",
    value: WorkflowScope.Team,
  },
];

interface CreateWorkflowContentProps {
  closeModal: () => void;
  createError: any;
  createWorkflow: (selectedTemplateId: string, requestBody: any) => Promise<void>;
  isLoading: boolean;
  team?: FlowTeam | null;
  teams?: FlowTeam[] | null;
  formData: any;
  saveValues: any;
  requestPreviousStep: any;
  userWorkflows?: UserWorkflow;
  systemWorkflows?: WorkflowSummary[];
  scope: string;
  workflowQuotasEnabled: boolean;
}

const CreateWorkflowContent: React.FC<CreateWorkflowContentProps> = ({
  formData,
  requestPreviousStep,
  userWorkflows,
  createError,
  createWorkflow,
  isLoading,
  systemWorkflows,
  team,
  teams,
  scope,
  workflowQuotasEnabled,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<FlowTeam | null>(team ?? null);
  const [teamTouched, setTeamTouched] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = React.useState(scope);
  const formikRef = useRef<any>();
  const hasReachedUserWorkflowLimit = userWorkflows && userWorkflows.userQuotas.maxWorkflowCount <= userWorkflows.userQuotas.currentWorkflowCount;
  const hasReachedTeamWorkflowLimit = selectedTeam && selectedTeam.workflowQuotas.maxWorkflowCount <= selectedTeam.workflowQuotas.currentWorkflowCount;

  const createUserWorkflowsDisabled = workflowQuotasEnabled && hasReachedUserWorkflowLimit && selectedOption === WorkflowScope.User;
  const createTeamWorkflowsDisabled = workflowQuotasEnabled && hasReachedTeamWorkflowLimit && selectedOption === WorkflowScope.Team;

  const existingUserWorkflowNames = userWorkflows?.workflows.map((workflow) => workflow.name) ?? [];
  const existingTeamWorkflowNames = selectedTeam?.workflows.map((workflow) => workflow.name) ?? [];
  const existingSystemWorkflowNames = systemWorkflows?.map((workflow) => workflow.name) ?? [];

  useEffect(() => {
    formikRef.current?.validateForm();
  }, [selectedTeam]);

  const handleSubmit = (values: any) => {
    const requestBody = {
      name: values.name,
      description: values.description,
      summary: values.summary,
      icon: values.icon,
      scope: scope === WorkflowScope.System ? scope : selectedOption,
      teamId: selectedTeam && selectedOption === WorkflowScope.Team ? selectedTeam.id : undefined,
    };
    //@ts-ignore
    createWorkflow(formData.selectedWorkflow.id, requestBody);
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
          .notOneOf(
            scope === WorkflowScope.System ?
              existingSystemWorkflowNames
            :
            selectedOption === WorkflowScope.User ?
              existingUserWorkflowNames
            : 
              existingTeamWorkflowNames,
            "This name already exists"),
        summary: Yup.string().max(128, "Summary must not be greater than 128 characters"),
        description: Yup.string().max(250, "Description must not be greater than 250 characters"),
      })}
    >
      {(props) => {
        const { values, touched, errors, isValid, handleChange, handleBlur, handleSubmit, setFieldValue } = props;
        const teamError = selectedOption === WorkflowScope.Team && !Boolean(selectedTeam);
        return (
          <ModalFlowForm>
            {isLoading && <Loading />}
            <ModalBody aria-label="inputs" className={styles.formBody}>
              {
                scope !== WorkflowScope.System && ( 
                  <div className={styles.typeRadio}>
                    <RadioGroup
                      name="workflow-options"
                      options={radioWorkflowOptions}
                      onChange={setSelectedOption}
                      value={selectedOption}
                    />
                  </div>
                )
              }
              {selectedOption === WorkflowScope.Team ? (
                <div className={styles.teamAndName}>
                  <ComboBox
                    id="selectedTeam"
                    styles={{ marginBottom: "2.5rem" }}
                    onChange={({ selectedItem }: { selectedItem: FlowTeam }) =>{
                      setTeamTouched(true);
                      setSelectedTeam(selectedItem ? selectedItem : null);
                    }}
                    items={teams}
                    initialSelectedItem={selectedTeam}
                    itemToString={(item: ComboBoxItem) => (item ? item.name : "")}
                    titleText="Team"
                    placeholder="Select a team"
                    invalid={teamError && teamTouched}
                    invalidText="Team is required"
                  />

                  <TextInput
                    id="name"
                    labelText="Workflow Name"
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    invalid={Boolean(errors.name && touched.name)}
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
                  invalid={Boolean(errors.name && touched.name)}
                  invalidText={errors.name}
                />
              )}
              <TextInput
                id="summary"
                labelText="Summary"
                value={values.summary}
                onBlur={handleBlur}
                onChange={handleChange}
                invalid={Boolean(errors.summary && touched.summary)}
                invalidText={errors.summary}
              />
              <TextArea
                id="description"
                labelText="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                invalid={Boolean(errors.description && touched.description)}
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
              {(createUserWorkflowsDisabled || createTeamWorkflowsDisabled) && (
                <InlineNotification
                  lowContrast
                  kind="error"
                  title="Quotas exceeded"
                  subtitle="You cannot create new workflows for this scope."
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button kind="secondary" onClick={requestPreviousStep} type="button">
                Back
              </Button>
              <Button
                data-testid="workflows-create-workflow-submit"
                disabled={!isValid || isLoading || createUserWorkflowsDisabled || createTeamWorkflowsDisabled || teamError}
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
