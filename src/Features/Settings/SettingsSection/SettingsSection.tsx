import React from "react";
import { useAppContext } from "Hooks";
import { AccordionItem, Button, DynamicFormik } from "@boomerang-io/carbon-addons-boomerang-react";
import { Save16 } from "@carbon/icons-react";
import { UserRole } from "Constants";
import { FormikProps } from "formik";
import { DataDrivenInput } from "Types";
import { SettingsGroup } from "../Settings";
import styles from "./settingsSection.module.scss";

interface SettingsSection {
  settingsGroup: SettingsGroup;
  onSave: (
    values: { [key: string]: any },
    settingsGroup: SettingsGroup,
    setFieldError: (key: string, value: string) => void
  ) => void;
  index: string | number;
}

const SettingsSection: React.FC<SettingsSection> = ({ onSave, index, settingsGroup }) => {
  //Needed to format input keys since formik interprets keys with dots as nested props
  // and input type so we can display secured fields
  const { user: userData } = useAppContext();
  const isOperator = userData.type === UserRole.Operator;

  const formatedInputs = settingsGroup.config.map((input: DataDrivenInput) => ({
    ...input,
    "data-testid": input.key,
  }));

  return (
    <AccordionItem
      open={index === 0}
      title={<h1 className={styles.accordionTitle}>{settingsGroup.name}</h1>}
      id={settingsGroup.key}
      key={`${settingsGroup.key}${index}`}
      data-testid="settings-section"
    >
      <DynamicFormik
        enableReinitialize
        inputs={formatedInputs}
        onSubmit={(values: {}, props: FormikProps<any>) => onSave(values, settingsGroup, props.setFieldError)}
        key={`${settingsGroup.key}${index}`}
        initialErrors={{ initialerror: "required" }}
        toggleProps={({ input }: { input: DataDrivenInput }) => {
          return {
            orientation: "vertical",
            "data-testid": input.key,
          };
        }}
        inputProps={isOperator ? { readOnly: true } : {}}
      >
        {({ inputs, formikProps }: { inputs: DataDrivenInput[]; formikProps: FormikProps<any> }) => {
          return (
            <>
              {!isOperator && (
                <Button
                  className={styles.saveButton}
                  disabled={!formikProps.isValid || !formikProps.dirty}
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
};

export default SettingsSection;
