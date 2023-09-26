import React from "react";
import { AutoSuggest, TextInput, TextArea, Creatable } from "@boomerang-io/carbon-addons-boomerang-react";
import TextEditorModal from "Components/TextEditorModal";
import { SUPPORTED_AUTOSUGGEST_TYPES } from "Constants/formInputTypes";
import { DataDrivenInput } from "Types";
import styles from "./inputs.module.scss";
import { FormikProps } from "formik";

export const AutoSuggestInput = (props: any) => {
  if (!SUPPORTED_AUTOSUGGEST_TYPES.includes(props.type)) {
    return <TextInput {...props} onChange={(e) => props.onChange(e.target.value)} />;
  }
  const { item, ...rest } = props;
  return (
    <div key={props.id}>
      <AutoSuggest {...rest} initialValue={Boolean(props?.initialValue) ? props?.initialValue : item?.defaultValue}>
        <TextInput
          disabled={props?.item?.readOnly}
          helperText={props?.item?.helperText}
          id={`['${props.id}']`}
          labelText={props?.label}
          placeholder={props?.item?.placeholder}
          tooltipContent={props.tooltipContent}
        />
      </AutoSuggest>
    </div>
  );
};

export const TextAreaSuggestInput = (props: any) => {
  const { item, ...rest } = props;
  return (
    <div key={props.id}>
      <AutoSuggest
        {...rest}
        initialValue={Boolean(props?.initialValue) ? props?.initialValue : props?.item?.defaultValue}
      >
        <TextArea
          disabled={props?.item?.readOnly}
          helperText={props?.item?.helperText}
          id={`['${props.id}']`}
          labelText={props?.label}
          placeholder={props?.item?.placeholder}
          tooltipContent={props.tooltipContent}
        />
      </AutoSuggest>
    </div>
  );
};

export const TextEditorInput = (props: any) => {
  return <TextEditorModal {...props} {...props.item} />;
};

export const TaskNameTextInput = ({ formikProps, ...otherProps }: any) => {
  const { errors, touched } = formikProps;
  const error = errors[otherProps.id];
  const touch = touched[otherProps.id];
  return (
    <>
      <TextInput
        {...otherProps}
        invalid={error && touch}
        id={`['${otherProps.id}']`}
        invalidText={error}
        onChange={formikProps.handleChange}
      />
      <hr className={styles.divider} />
      <h2 className={styles.inputsTitle}>Specifics</h2>
    </>
  );
};

export const ResultsInput = ({ formikProps, ...input }: DataDrivenInput & { formikProps: FormikProps<any> }) => {
  return (
    <>
      <hr className={styles.divider} />
      <h2 className={styles.inputsTitle}>Result Parameters</h2>
      <Creatable
        {...input}
        createKeyValuePair
        keyLabelText="Name"
        valueLabelText="Description"
        onChange={(value) => formikProps.setFieldValue("results", value)}
      />
    </>
  );
};

export function formatAutoSuggestParameters(availableParameters: Array<string>) {
  return availableParameters.map((parameter) => ({
    value: `$(${parameter})`,
    label: parameter,
  }));
}
