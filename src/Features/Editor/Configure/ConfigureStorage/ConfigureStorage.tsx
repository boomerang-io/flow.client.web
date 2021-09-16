import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import {  Button, ModalBody, ModalFooter, TextInput, ModalFlowForm } from "@boomerang-io/carbon-addons-boomerang-react";
import BasicSlider from "Components/Slider";

type Props = {
  size: number;
  mountPath: string;
  handleOnChange: (...values: any) => void;
  closeModal: (...args: any) => void;
  storageQuotas: number;
};


export default function ConfigureStorage({size, mountPath, handleOnChange, closeModal, storageQuotas}: Props) {
  const thresholdRef = React.createRef();
  const handleOnSave = (values: any) => {
    const { size, mountPath } = values;
    handleOnChange({enabled: true, size, mountPath});
    closeModal();
  };

  return (
    <Formik
      validateOnMount
      onSubmit={handleOnSave}
      initialValues={{
        size: size || 1,
        mountPath: mountPath || "",
      }}
      validationSchema={Yup.object().shape({
        size: Yup.number().required(),
        mountPath: Yup.string(),
      })}
    >
      {(formikProps) => {
        const {
          values,
          touched,
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isValid,
          setFieldValue,
        } = formikProps;

        return (
          <ModalFlowForm onSubmit={handleSubmit}>
            <ModalBody>
              <BasicSlider
                id="storage-config-size-slider"
                min={0}
                max={storageQuotas}
                inputType="text"
                sliderRef={thresholdRef}
                sliderValue={values.size}
                onChange={(value: number) => setFieldValue("size", value)}
                data-testid="storage-config-size-slider"
              />
              {/* <TextInput
                id="size"
                data-testid="size"
                helperText="Size in Gigabytes"
                invalid={errors.size && touched.size}
                invalidText={errors.size}
                labelText={"Storage Size"}
                min={0}
                name="size"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Size"
                style={{ minWidth: "10rem" }}
                type="number"
                value={values.size}
              /> */}
              <TextInput
                id="mountPath"
                data-testid="mountPath"
                helperText={"The Mount path for your storage"}
                invalid={errors.mountPath && touched.mountPath}
                invalidText={errors.mountPath}
                labelText={"Mount path"}
                name="mountPath"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Mount Path"
                style={{ minWidth: "10rem" }}
                type="mountPath"
                value={values.mountPath}
              />
            </ModalBody>
            <ModalFooter style={{ bottom: "0", position: "absolute", width: "100%" }}>
              <Button kind="secondary" type="button" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                disabled={!isValid} //disable if the form is invalid or if there is an error message
                type="submit"
              >
                Save
              </Button>
            </ModalFooter>
          </ModalFlowForm>
        );
      }}
    </Formik>
  );
}
