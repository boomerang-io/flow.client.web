import React, { useRef } from "react";
import classNames from "classnames/bind";
import { Loading, TextArea, TextInput } from "@boomerang-io/carbon-addons-boomerang-react";
import { Formik } from "formik";
import * as Yup from "yup";
import capitalize from "lodash/capitalize";
import { Button, InlineNotification, ModalBody, ModalFooter } from "@carbon/react";
import { ModalFlowForm, TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import workflowIcons from "Assets/workflowIcons";
import { FlowTeam, Workflow } from "Types";
import styles from "./createWorkflow.module.scss";

let classnames = classNames.bind(styles);

interface CreateWorkflowContentProps {
  closeModal: () => void;
  createError: any;
  createWorkflow: (selectedTemplateId: string, requestBody: any) => Promise<void>;
  isLoading: boolean;
  team: FlowTeam;
  formData: any;
  saveValues: any;
  requestPreviousStep: any;
  workflowQuotasEnabled: boolean;
  workflowList: Array<Workflow>;
}

const CreateWorkflowContent: React.FC<CreateWorkflowContentProps> = ({
  formData,
  requestPreviousStep,
  createError,
  createWorkflow,
  isLoading,
  team,
  workflowQuotasEnabled,
  workflowList,
}) => {
  const formikRef = useRef<any>();
  const hasReachedWorkflowLimit = team.quotas.maxWorkflowCount <= team.quotas.currentWorkflowCount;
  const createWorkflowsDisabled = workflowQuotasEnabled && hasReachedWorkflowLimit;
  const existingWorkflowNames = workflowList.map((workflow) => workflow.name) ?? [];

  const handleSubmit = (values: any) => {
    const requestBody = {
      name: values.name,
      description: values.description,
      icon: values.icon,
      teamId: team.id,
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
        description: formData.selectedWorkflow?.description ?? "",
        icon: formData.selectedWorkflow.icon,
      }}
      onSubmit={handleSubmit}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required("Name is required")
          .max(64, "Name must not be greater than 64 characters")
          .notOneOf(existingWorkflowNames, "This name already exists"),
        description: Yup.string().max(250, "Description must not be greater than 250 characters"),
      })}
    >
      {(props) => {
        const { values, touched, errors, isValid, handleChange, handleBlur, handleSubmit, setFieldValue } = props;
        return (
          <ModalFlowForm>
            {isLoading && <Loading />}
            <ModalBody aria-label="inputs" className={styles.formBody}>
              <TextInput
                id="name"
                labelText="Workflow Name"
                value={values.name}
                onBlur={handleBlur}
                onChange={handleChange}
                invalid={Boolean(errors.name && touched.name)}
                invalidText={errors.name}
              />
              <TextArea
                id="description"
                labelText="Description (optional)"
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
              {createWorkflowsDisabled && (
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
                disabled={!isValid || isLoading || createWorkflowsDisabled}
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
