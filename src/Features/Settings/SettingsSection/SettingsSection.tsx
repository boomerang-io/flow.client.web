import React from "react";
import { useAppContext } from "Hooks";
import { AccordionItem, Button  , DynamicFormik } from "@boomerang-io/carbon-addons-boomerang-react";
import { Save16 } from "@carbon/icons-react";
import isEqual from "lodash/isEqual";
import { UserRole } from "Constants";
import { DataDrivenInput } from "Types";
import styles from "./settingsSection.module.scss";

interface SettingsSection {
  config: any;
  onSave: (values: any, config: any, error: any) => void;
  index: string | number;
};

 const SettingsSection: React.FC<SettingsSection> = ({ config, onSave, index }) => {
  //Needed to format input keys since formik interprets keys with dots as nested props
  // and input type so we can display secured fields
  const { user: userData } = useAppContext();
  const isOperator = userData.type === UserRole.Operator;

  const formatedInputs = config.config.map((input: any) => ({
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
        onSubmit={(values: any, props: any) => onSave(values, config, props.setFieldError)}
        key={`${config.key}${index}`}
        initialErrors={{ initialerror: "required" }}
        toggleProps={({ input }: { input: DataDrivenInput }) => {
          return {
            orientation: "vertical",
            "data-testid": input.key,
          };
        }}
        inputProps={isOperator ? { readOnly: true } : {}}
      >
        {({ inputs, formikProps }: { inputs: DataDrivenInput[], formikProps: any}) => {
          return (
            <>
              {!isOperator && (
                <Button
                  className={styles.saveButton}
                  disabled={!formikProps.isValid || isEqual(formikProps.values, formikProps.initialValues)}
                  iconDescription="Save settings"
                  onClick={formikProps.handleSubmit}
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
