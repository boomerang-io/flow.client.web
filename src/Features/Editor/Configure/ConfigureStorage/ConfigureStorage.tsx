import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextInput, ModalFlowForm } from "@boomerang-io/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter } from "@boomerang-io/carbon-addons-boomerang-react";

type Props = {
  size: string | number;
  mountPath: string;
  handleOnChange: (...values: any) => void;
  closeModal: (...args: any) => void;
};


export default function ConfigureStorage({size, mountPath, handleOnChange, closeModal}: Props) {

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
        } = formikProps;

        return (
          <ModalFlowForm onSubmit={handleSubmit}>
            <ModalBody>
              <TextInput
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
              />
              <TextInput
                id="mountPath"
                data-testid="mountPath"
                helperText={"Type a Mount path for your storage"}
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
