//@ts-nocheck
import React from "react";
import cx from "classnames";
import {
  //AutoSuggest,
  Button,
  ModalBody,
  ModalFooter,
  //TextInput,
} from "@carbon/react";
import { DataDrivenInput, DynamicFormik, ModalForm } from "@boomerang-io/carbon-addons-boomerang-react";
import EmptyState from "Components/EmptyState";
import TextEditorModal from "Components/TextEditorModal";
import { TEXT_AREA_TYPES } from "Constants/formInputTypes";
import { WarningFilled, WarningAlt } from "@carbon/react/icons";
import styles from "./taskUpdateModal.module.scss";
import { TaskTemplate, WorkflowNode, WorkflowParameter } from "Types";

interface TaskUpdateModalProps {
  closeModal: any;
  currentTaskTemplateVersion: TaskTemplate;
  inputProperties: Record<string, any>;
  latestTaskTemplateVersion: TaskTemplate;
  node: WorkflowNode["data"];
  onSave: ({ inputs: any, version: string }) => void;
}

const UpdateType = {
  Add: "add",
  Remove: "remove",
  NoChange: "none",
} as const;

const TextEditorInput = (props) => {
  return (
    <div key={props.id} style={{ position: "relative", cursor: "pointer", paddingBottom: "1rem" }}>
      <TextEditorModal {...props} {...props.item} />
    </div>
  );
};

const formatAutoSuggestProperties = (inputProperties: Array<WorkflowParameter>) => {
  return inputProperties.map((parameter) => ({
    value: `$(${parameter})`,
    label: parameter,
  }));
};

const formikSetFieldValue = (value, id, setFieldValue) => {
  setFieldValue(id, value);
};

const textAreaProps =
  (inputProperties) =>
  ({ input, formikProps }) => {
    const { values, setFieldValue } = formikProps;
    const { key, type, ...rest } = input;
    const itemConfig = TEXT_AREA_TYPES[type];

    return {
      autoSuggestions: formatAutoSuggestProperties(inputProperties),
      formikSetFieldValue: (value) => formikSetFieldValue(value, key, setFieldValue),
      initialValue: values[key],
      inputProperties: inputProperties,
      item: input,
      ...itemConfig,
      ...rest,
    };
  };

const toggleProps = ({ input, formikProps }) => {
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

  const handleSubmit = (values) => {
    onSave({ version: latestTaskTemplateVersion.version, inputs: values });
    closeModal();
  };

  const initValues = {};
  latestTaskTemplateVersion.config.forEach((input) => {
    const initialValue = node.params[input.key];
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
              <VersionSection
                description={currentTaskTemplateVersion.description}
                name={currentTaskTemplateVersion.name}
                subtitle="Current version in this workflow"
                version={currentTaskTemplateVersion.version}
              >
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
              <VersionSection
                latest
                description={latestTaskTemplateVersion.description}
                name={latestTaskTemplateVersion.name}
                subtitle="Latest version available"
                version={latestTaskTemplateVersion.version}
              >
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
  latest: string;
  subtitle: string;
  version: string;
}

function VersionSection({ children, latest, subtitle, version }: VersionSectionProps) {
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

function StateHighlighter({ children, hidden, type }) {
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
