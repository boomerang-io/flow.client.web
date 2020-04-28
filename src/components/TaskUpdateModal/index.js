import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import {
  Button,
  DataDrivenInput,
  DynamicFormik,
  ModalForm,
  ModalBody,
  ModalFooter
} from "@boomerang/carbon-addons-boomerang-react";
import { WarningFilled16, WarningAlt16 } from "@carbon/icons-react";
import styles from "./taskUpdateModal.module.scss";

TaskUpdateModal.propTypes = {
  closeModal: PropTypes.func.isRequired
};

const UpdateType = {
  Add: "add",
  Remove: "remove",
  NoChange: "none"
};

export default function TaskUpdateModal({ closeModal, nodeConfig, task }) {
  const currentVersion = task.revisions[1];
  const newVersion = task.revisions[2];

  const removedInputs = currentVersion.config
    .filter(input => !newVersion.config.find(newInput => newInput.key === input.key))
    .map(input => input?.key);

  const addedInputs = newVersion.config
    .filter(input => !currentVersion.config.find(currentInput => currentInput.key === input.key))
    .map(input => input?.key);

  const handleSubmit = values => {
    console.log(values);
  };

  return (
    <DynamicFormik inputs={newVersion.config} onSubmit={handleSubmit}>
      {({ inputs, formikProps }) => {
        return (
          <ModalForm onSubmit={formikProps.handleSubmit}>
            <ModalBody className={styles.versionsContainer}>
              <VersionSection
                description={currentVersion.description}
                name={currentVersion.name}
                subtitle="Current version in this workflow"
                version={currentVersion.version}
              >
                {currentVersion.config.map(input => (
                  <StateHilighter type={removedInputs.includes(input.key) ? UpdateType.Remove : UpdateType.NoChange}>
                    <DataDrivenInput {...input} readOnly id={`${input.key}-current`} />
                  </StateHilighter>
                ))}
              </VersionSection>
              <div style={{ width: "1rem" }} />
              <VersionSection
                latest
                description={newVersion.description}
                name={newVersion.name}
                subtitle="Latest version available"
                version={newVersion.version}
              >
                {inputs.map(input => (
                  <StateHilighter type={addedInputs.includes(input.props.id) ? UpdateType.Add : UpdateType.NoChange}>
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
    text: "This field has been added."
  },
  [UpdateType.Remove]: {
    icon: <WarningFilled16 fill="#F1C21B" />,
    className: "remove",
    text: "This field has been removed."
  }
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
