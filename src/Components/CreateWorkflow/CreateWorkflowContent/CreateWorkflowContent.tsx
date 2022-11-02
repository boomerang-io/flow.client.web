import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames/bind";
import {
  ComboBox,
  InlineNotification,
  Loading,
  TextArea,
  TextInput,
} from "@carbon/react";
import { Formik } from "formik";
import * as Yup from "yup";
import capitalize from "lodash/capitalize";
import { Button, ModalBody, ModalFooter } from "@carbon/react";
import {  TooltipHover} from "@boomerang-io/carbon-addons-boomerang-react";
import workflowIcons from "Assets/workflowIcons";
import { defaultWorkflowConfig } from "./constants";
import { ComboBoxItem, FlowTeam, CreateWorkflowSummary } from "Types";
import { WorkflowScope } from "Constants";
import styles from "./createWorkflow.module.scss";

let classnames = classNames.bind(styles);

interface CreateWorkflowContentProps {
  closeModal: () => void;
  createError: object;
  createWorkflow: (workflowSummary: CreateWorkflowSummary) => Promise<void>;
  isLoading: boolean;
  scope: string;
  team?: FlowTeam | null;
  teams?: FlowTeam[] | null;
  workflowQuotasEnabled: boolean;
}

const CreateWorkflowContent: React.FC<CreateWorkflowContentProps> = ({
  closeModal,
  createError,
  createWorkflow,
  isLoading,
  scope,
  team,
  teams,
  workflowQuotasEnabled,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<FlowTeam | null>(team ?? null);
  const formikRef = useRef<any>();

  const existingWorkflowNames = selectedTeam?.workflows.map((workflow) => workflow.name) ?? [];

  const hasReachedTeamWorkflowLimit = selectedTeam && selectedTeam.workflowQuotas.maxWorkflowCount <= selectedTeam.workflowQuotas.currentWorkflowCount;
  const createTeamWorkflowsDisabled = workflowQuotasEnabled && hasReachedTeamWorkflowLimit;

  useEffect(() => {
    formikRef.current?.validateForm();
  }, [selectedTeam]);

  const handleSubmit = (values: any) => {
    const requestBody = {
      ...defaultWorkflowConfig,
      flowTeamId: selectedTeam?.id,
      name: values.name,
      shortDescription: values.summary,
      description: values.description,
      icon: values.icon,
      scope,
    };
    createWorkflow(requestBody);
  };

  return (
    <Formik
      innerRef={formikRef}
      initialErrors={{ name: "Name is required" }}
      initialValues={{
        name: "",
        summary: "",
        description: "",
        icon: workflowIcons[2].name,
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
          <>
            {isLoading && <Loading />}
            <ModalBody aria-label="inputs" className={styles.formBody}>
              {scope === WorkflowScope.Team ? (
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
                    invalid={scope === WorkflowScope.Team && !Boolean(selectedTeam)}
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
                  labelText={scope === WorkflowScope.Template ? "Template Name" : "Workflow Name"}
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
                  subtitle={`Request to create ${scope === WorkflowScope.Template ? "template" : "workflow"} failed`}
                />
              )}
              {createTeamWorkflowsDisabled && (
                <InlineNotification
                  lowContrast
                  kind="error"
                  title="Quotas exceeded"
                  subtitle="You cannot create new workflows for this team."
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button kind="secondary" onClick={closeModal} type="button">
                Cancel
              </Button>
              <Button
                data-testid="workflows-create-workflow-submit"
                disabled={!isValid || isLoading || createTeamWorkflowsDisabled}
                onClick={handleSubmit}
              >
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </ModalFooter>
          </>
        );
      }}
    </Formik>
  );
};

export default CreateWorkflowContent;
