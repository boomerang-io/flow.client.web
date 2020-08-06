import React from "react";
import { useAppContext } from "Hooks";
import { Button, AccordionItem, DynamicFormik } from "@boomerang-io/carbon-addons-boomerang-react";
import { Save16 } from "@carbon/icons-react";
import isEqual from "lodash/isEqual";
import { PlatformRoles } from "Config/permissionsConfig";
import styles from "./settingsSection.module.scss";

interface SettingsSection {
  config: any;
  onSave: () => void;
  index: string | number;
};

 const SettingsSection: React.FC<SettingsSection> = ({ config, onSave, index }) => {
  //Needed to format input keys since formik interprets keys with dots as nested props
  // and input type so we can display secured fields
  const { user: userData } = useAppContext();
  const isOperator = userData.type === PlatformRoles.operator;
  const formatedInputs = config.config.map((input) => ({
    ...input,
    "data-testid": input.key,
  }));
  return (
    <AccordionItem
      open={index === 0}
      title={<h1 className={styles.accordionTitle}>{config.name}</h1>}
      id={config.key}
      key={`${config.key}${index}`}
      data-testid="settings-section"
    >
      <DynamicFormik
        inputs={formatedInputs}
        onSubmit={(values, props) => onSave(values, config, props.setFieldError)}
        key={`${config.key}${index}`}
        initialErrors={{ initialerror: "required" }}
        toggleProps={({ input }) => {
          return {
            orientation: "vertical",
            "data-testid": input.key,
          };
        }}
        inputProps={isOperator ? { readOnly: true } : {}}
      >
        {({ inputs, formikProps }) => {
          return (
            <>
              {!isOperator && (
                <Button
                  className={styles.saveButton}
                  onClick={formikProps.handleSubmit}
                  disabled={!formikProps.isValid || isEqual(formikProps.values, formikProps.initialValues)}
                  iconDescription="Save settings"
                  renderIcon={Save16}
                  size="field"
                >
                  Save
                </Button>
              )}
              {inputs}
            </>
          );
        }}
      </DynamicFormik>
    </AccordionItem>
  );
}

export default SettingsSection;
