import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import {
  //AutoSuggest,
  Button,
  DataDrivenInput,
  DynamicFormik,
  Error404,
  ModalForm,
  ModalBody,
  ModalFooter,
  //TextInput,
} from "@boomerang-io/carbon-addons-boomerang-react";
import TextEditorModal from "Components/TextEditorModal";
import { TEXT_AREA_TYPES } from "Constants/formInputTypes";
import { WarningFilled16, WarningAlt16 } from "@carbon/icons-react";
import styles from "./taskUpdateModal.module.scss";

TaskUpdateModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

const UpdateType = {
  Add: "add",
  Remove: "remove",
  NoChange: "none",
};

// const AutoSuggestInput = (props) => {
//   return (
//     <div key={props.id} style={{ paddingBottom: "1rem", position: "relative" }}>
//       <AutoSuggest {...props}>
//         <TextInput tooltipContent={props.tooltipContent} />
//       </AutoSuggest>
//     </div>
//   );
// };

const TextEditorInput = (props) => {
  return (
    <div key={props.id} style={{ position: "relative", cursor: "pointer", paddingBottom: "1rem" }}>
      <TextEditorModal {...props} {...props.item} />
    </div>
  );
};

/**
 * @param {property} inputProperties - property object for workflow
 * {
 *   defaultValue: String
 *   description: String
 *   key: String
 *   label: String
 *   required: Bool
 *   type: String
 * }
 */
function formatAutoSuggestProperties(inputProperties) {
  return inputProperties.map((property) => ({
    value: `\${p:${property.key}}`,
    label: property.key,
  }));
}

const formikSetFieldValue = (value, id, setFieldValue) => {
  setFieldValue(id, value);
};

const textAreaProps = (inputProperties) => ({ input, formikProps }) => {
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

// const textInputProps = (inputProperties) => ({ formikProps, input }) => {
//   const { errors, handleBlur, touched, values, setFieldValue } = formikProps;
//   const { key, ...rest } = input;

//   return {
//     autoSuggestions: formatAutoSuggestProperties(inputProperties),
//     onChange: (value) => formikSetFieldValue(value, key, setFieldValue),
//     initialValue: values[key],
//     inputProps: {
//       id: key,
//       onBlur: handleBlur,
//       invalid: touched[key] && errors[key],
//       invalidText: errors[key],
//       ...rest,
//     },
//   };
// };

const toggleProps = ({ input, formikProps }) => {
  return {
    orientation: "vertical",
  };
};

export default function TaskUpdateModal({ closeModal, inputProperties, nodeConfig, onSave, task }) {
  const currentTaskTemplateVersion = task.revisions.find((revision) => revision.version === nodeConfig.taskVersion);
  const newTaskTemplateVersion = task.revisions[task.revisions.length - 1];
  console.log({
    currentTaskTemplateVersion,
    newTaskTemplateVersion,
    nodeConfigVersion: nodeConfig.taskVersion,
    revisions: task.revisions,
  });

  // Handle edge case of not finding the versions for some reason
  if (!currentTaskTemplateVersion?.config || !newTaskTemplateVersion?.config) {
    return (
      <ModalForm>
        <Error404
          header={null}
          title="Something's off here"
          message="We couldn't find ones of the tasks needed for the upgrade. Please contact support for assistance upgrading."
        />
      </ModalForm>
    );
  }

  const removedInputs = currentTaskTemplateVersion.config
    .filter((input) => !newTaskTemplateVersion.config.find((newInput) => newInput.key === input.key))
    .map((input) => input?.key);

  const addedInputs = newTaskTemplateVersion.config
    .filter((input) => !currentTaskTemplateVersion.config.find((currentInput) => currentInput.key === input.key))
    .map((input) => input?.key);

  const handleSubmit = (values) => {
    onSave({ version: newTaskTemplateVersion.version, inputs: values });
    closeModal();
  };

  return (
    <DynamicFormik
      allowCustomPropertySyntax
      validateOnMount
      initialValues={nodeConfig.inputs}
      inputs={newTaskTemplateVersion.config}
      onSubmit={handleSubmit}
      dataDrivenInputProps={{
        //TextInput: AutoSuggestInput,
        TextEditor: TextEditorInput,
      }}
      //textAreaProps={textAreaProps(inputProperties)}
      textEditorProps={textAreaProps(inputProperties)}
      //textInputProps={textInputProps(inputProperties)}
      toggleProps={toggleProps}
    >
      {({ inputs, formikProps }) => {
        return (
          <ModalForm noValidate onSubmit={formikProps.handleSubmit}>
            <ModalBody className={styles.versionsContainer}>
              <VersionSection
                description={currentTaskTemplateVersion.description}
                name={currentTaskTemplateVersion.name}
                subtitle="Current version in this workflow"
                version={currentTaskTemplateVersion.version}
              >
                {currentTaskTemplateVersion.config.map((input) => (
                  <StateHilighter
                    key={input.key}
                    type={removedInputs.includes(input.key) ? UpdateType.Remove : UpdateType.NoChange}
                  >
                    <DataDrivenInput
                      {...input}
                      readOnly
                      value={nodeConfig.inputs[input.key]}
                      id={`${input.key}-current`}
                    />
                  </StateHilighter>
                ))}
              </VersionSection>
              <div style={{ width: "1rem" }} />
              <VersionSection
                latest
                description={newTaskTemplateVersion.description}
                name={newTaskTemplateVersion.name}
                subtitle="Latest version available"
                version={newTaskTemplateVersion.version}
              >
                {inputs.map((input) => (
                  <StateHilighter
                    key={input.props.id}
                    type={addedInputs.includes(input.props.id) ? UpdateType.Add : UpdateType.NoChange}
                  >
                    {input}
                  </StateHilighter>
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

function VersionSection({ children, description, latest, name, subtitle, version }) {
  return (
    <section className={styles.versionSection}>
      <header className={cx(styles.versionHeader, { [styles.latest]: latest })}>
        <h2 className={styles.versionSubtitle}>{`Version ${version}`}</h2>
        <h1 className={styles.versionTitle}>{subtitle}</h1>
      </header>
      <div className={styles.versionInputsContainer}>
        {/* <section className={styles.versionMetadata}>
          <h1 className={styles.versionName}>{name}</h1>
          <p className={styles.versionDescription}>{description}</p>
        </section> */}
        {children}
      </div>
    </section>
  );
}

const ChangeToAppearanceMap = {
  [UpdateType.Add]: {
    icon: <WarningAlt16 fill="#DA1E28" />,
    className: "add",
    text: "This field has been added.",
  },
  [UpdateType.Remove]: {
    icon: <WarningFilled16 fill="#F1C21B" />,
    className: "remove",
    text: "This field has been removed.",
  },
};
function StateHilighter({ children, hidden, type }) {
  const { className, icon, text } = ChangeToAppearanceMap[type] ?? {};

  if (hidden) {
    return <div className={styles.stateHilighter}>{children}</div>;
  }
  return (
    <>
      <div className={cx(styles.stateHilighter, styles[className])}>{children}</div>
      {text && (
        <p className={styles.stateHilighterText}>
          {icon}
          <span>{text}</span>
        </p>
      )}
    </>
  );
}
