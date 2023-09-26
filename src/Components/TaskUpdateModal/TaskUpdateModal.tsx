import React from "react";
import cx from "classnames";
import { Button, ModalBody, ModalFooter } from "@carbon/react";
import { DataDrivenInput, DynamicFormik, ModalForm } from "@boomerang-io/carbon-addons-boomerang-react";
import EmptyState from "Components/EmptyState";
import TextEditorModal from "Components/TextEditorModal";
import { TEXT_AREA_TYPES } from "Constants/formInputTypes";
import { WarningFilled, WarningAlt } from "@carbon/react/icons";
import styles from "./taskUpdateModal.module.scss";
import { TaskTemplate, WorkflowNode } from "Types";

interface TaskUpdateModalProps {
  closeModal: any;
  currentTaskTemplateVersion: TaskTemplate;
  inputProperties?: Array<string>;
  latestTaskTemplateVersion: TaskTemplate;
  node: WorkflowNode["data"];
  onSave: ({ inputs, version }: { inputs: Record<string, string>; version: number }) => void;
}

const UpdateType = {
  Add: "add",
  Remove: "remove",
  NoChange: "none",
} as const;

const TextEditorInput = (props: any) => {
  return (
    <div key={props.id} style={{ position: "relative", cursor: "pointer", paddingBottom: "1rem" }}>
      <TextEditorModal {...props} {...props.item} />
    </div>
  );
};

const formatAutoSuggestProperties = (inputProperties: Array<string> = []) => {
  return inputProperties.map((parameter) => ({
    value: `$(${parameter})`,
    label: parameter,
  }));
};

const textAreaProps =
  (inputProperties?: Array<string>) =>
  ({ input, formikProps }: any) => {
    const { values, setFieldValue } = formikProps;
    const { key, type, ...rest } = input;
    const itemConfig = TEXT_AREA_TYPES[type];

    return {
      autoSuggestions: formatAutoSuggestProperties(inputProperties),
      formikSetFieldValue: (value: string) => setFieldValue(key, value),
      initialValue: values[key],
      inputProperties: inputProperties,
      item: input,
      ...itemConfig,
      ...rest,
    };
  };

const toggleProps = () => {
  return {
    orientation: "vertical",
  };
};

export default function TaskUpdateModal(props: TaskUpdateModalProps) {
  const { currentTaskTemplateVersion, latestTaskTemplateVersion, closeModal, inputProperties, node, onSave } = props;

  // Handle edge case of not finding the versions for some reason
  if (!currentTaskTemplateVersion?.config || !latestTaskTemplateVersion?.config) {
    return (
      <ModalForm>
        <EmptyState
          title="Something's off here"
          message="We couldn't find ones of the tasks needed for the upgrade. Please contact support for assistance upgrading."
        />
      </ModalForm>
    );
  }

  const removedInputs = currentTaskTemplateVersion.config
    .filter((input) => !latestTaskTemplateVersion.config.find((newInput) => newInput.key === input.key))
    .map((input) => input?.key);

  const addedInputs = latestTaskTemplateVersion.config
    .filter((input) => !currentTaskTemplateVersion.config.find((currentInput) => currentInput.key === input.key))
    .map((input) => `['${input?.key}']`);

  const handleSubmit = (values: Record<string, string>) => {
    onSave({ version: latestTaskTemplateVersion.version, inputs: values });
    closeModal();
  };

  const initValues = { taskName: node.name };
  currentTaskTemplateVersion.config.forEach((input) => {
    const initialValue = node.params.find((param) => param.name === input.key)?.["value"] ?? "";
    initValues[input.key] = Boolean(initialValue) ? initialValue : input.defaultValue;
  });

  return (
    <DynamicFormik
      allowCustomPropertySyntax
      validateOnMount
      dataDrivenInputProps={{
        TextEditor: TextEditorInput,
      }}
      initialValues={initValues}
      inputs={latestTaskTemplateVersion.config}
      onSubmit={handleSubmit}
      textEditorProps={textAreaProps(inputProperties)}
      toggleProps={toggleProps}
    >
      {({ inputs, formikProps }) => {
        return (
          <ModalForm noValidate onSubmit={formikProps.handleSubmit}>
            <ModalBody ModalBody className={styles.versionsContainer}>
              <VersionSection subtitle="Current version in this workflow" version={currentTaskTemplateVersion.version}>
                {currentTaskTemplateVersion.config.map((input) => (
                  <StateHighlighter
                    key={input.key}
                    type={removedInputs.includes(input.key) ? UpdateType.Remove : UpdateType.NoChange}
                  >
                    <DataDrivenInput
                      {...input}
                      readOnly
                      id={`${input.key}-current`}
                      orientation={input.type === "boolean" ? "vertical" : undefined}
                      value={Boolean(node.params[input.key]) ? node.params[input.key] : input.defaultValue}
                    />
                  </StateHighlighter>
                ))}
              </VersionSection>
              <div style={{ width: "1rem" }} />
              <VersionSection latest subtitle="Latest version available" version={latestTaskTemplateVersion.version}>
                {inputs.map((input) => (
                  <StateHighlighter
                    key={input.props.id}
                    type={addedInputs.includes(input.props.id) ? UpdateType.Add : UpdateType.NoChange}
                  >
                    {input}
                  </StateHighlighter>
                ))}
              </VersionSection>
            </ModalBody>
            <ModalFooter>
              <Button kind="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button disabled={Boolean(Object.values(formikProps.errors).length)} type="submit">
                Update task
              </Button>
            </ModalFooter>
          </ModalForm>
        );
      }}
    </DynamicFormik>
  );
}

interface VersionSectionProps {
  children: React.ReactNode;
  latest?: boolean;
  subtitle: string;
  version: number;
}

function VersionSection({ children, latest = false, subtitle, version }: VersionSectionProps) {
  return (
    <section className={styles.versionSection}>
      <header className={cx(styles.versionHeader, { [styles.latest]: latest })}>
        <h2 className={styles.versionSubtitle}>{`Version ${version}`}</h2>
        <h1 className={styles.versionTitle}>{subtitle}</h1>
      </header>
      <div className={styles.versionInputsContainer}>{children}</div>
    </section>
  );
}

const ChangeToAppearanceMap = {
  [UpdateType.Add]: {
    icon: <WarningFilled fill="#F1C21B" />,
    className: "add",
    text: "This field has been added.",
  },
  [UpdateType.Remove]: {
    icon: <WarningAlt fill="#DA1E28" />,
    className: "remove",
    text: "This field has been removed.",
  },
};

function StateHighlighter({ children, hidden, type }: any) {
  const { className, icon, text } = ChangeToAppearanceMap[type] ?? {};

  if (hidden) {
    return <div className={styles.stateHighlighter}>{children}</div>;
  }

  return (
    <>
      <div className={cx(styles.stateHighlighter, styles[className])}>{children}</div>
      {text && (
        <p className={styles.stateHighlighterText}>
          {icon}
          <span>{text}</span>
        </p>
      )}
    </>
  );
}
