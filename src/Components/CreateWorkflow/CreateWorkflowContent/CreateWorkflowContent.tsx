import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames/bind";
import {
  ComboBox,
  InlineNotification,
  Loading,
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
  isLoading: boolean;
  isSystem: boolean;
  team: FlowTeam | null;
  teams: FlowTeam[] | null;
}

const CreateWorkflowContent: React.FC<CreateWorkflowContentProps> = ({
  closeModal,
  createError,
  createWorkflow,
  isLoading,
  isSystem,
  team,
  teams,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<FlowTeam | null>(team);
  const formikRef = useRef<any>();

  const existingWorkflowNames = selectedTeam?.workflows.map((workflow) => workflow.name) ?? [];

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
      scope: isSystem ? "system" : "team",
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
        icon: workflowIcons[0].name,
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
              {!isSystem ? (
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
                    invalid={!(isSystem || Boolean(selectedTeam))}
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
                {workflowIcons.map(({ name, Icon }, index) => (
                  <label
                    key={index}
                    //@ts-ignore
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
              <Button
                data-testid="workflows-create-workflow-submit"
                disabled={!isValid || isLoading}
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
