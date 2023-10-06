import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { ModalFlowForm, TextInput } from "@boomerang-io/carbon-addons-boomerang-react";
import { serviceUrl } from "Config/servicesConfig";
import { Button, ModalBody, ModalFooter, CodeSnippet } from "@carbon/react";
import copy from "copy-to-clipboard";
import { ConfigureWorkflowFormValues } from "Types";
import styles from "./ConfigureEventTrigger.module.scss";

const EXAMPLE_CLOUD_EVENT = `"specversion": "1.0",
"type": "io.boomerang.event",
"subject": "Hello World",
"source": "/origin",
...
`;

type Props = {
  values: ConfigureWorkflowFormValues;
  handleOnChange: (...values: any) => void;
  closeModal: (...args: any) => void;
  workflowId: string;
};

export default function ConfigureStorage({ values, handleOnChange, closeModal, workflowId }: Props) {
  const resourceUrl = serviceUrl.resourceTriggers();
  const webhookURL = `${resourceUrl}/event?workflow=${workflowId}`;

  const handleOnSave = (values: any) => {
    const { subject, type } = values;
    handleOnChange({ enable: true, subject, type });
    closeModal();
  };

  return (
    <Formik
      validateOnMount
      onSubmit={handleOnSave}
      initialValues={{
        subject: values.triggers.event.subject || "",
        type: values.triggers.event.type || "",
      }}
      validationSchema={Yup.object().shape({
        subject: Yup.string(),
        type: Yup.string(),
      })}
    >
      {(formikProps: any) => {
        const { values, touched, errors, handleBlur, handleChange, handleSubmit, isValid } = formikProps;

        return (
          <ModalFlowForm onSubmit={handleSubmit}>
            <ModalBody>
              <section>
                <p>In the following example CloudEvent the filters apply to the 'Type' and 'Subject' fields.</p>
                <CodeSnippet type="multi" hideCopyButton className={styles.codeSnippet}>
                  {EXAMPLE_CLOUD_EVENT}
                </CodeSnippet>
              </section>
              <TextInput
                id="type"
                label="Type Filter"
                invalid={Boolean(errors.type && touched.type)}
                invalidText={errors.type}
                placeholder="io.boomerang.[event|phase|status]"
                helperText="A regular expression."
                value={values.type}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <TextInput
                id="subject"
                label="Subject Filter"
                invalid={Boolean(errors.subject && touched.subject)}
                invalidText={errors.subject}
                placeholder="Hello World"
                helperText="A regular expression."
                value={values.subject}
                onBlur={handleBlur}
                onChange={handleChange}
              />

              <p>
                Forward events from external systems with the following URL. Add a token to the URL using
                '&access_token='. Actual tokens are only shown at token creation time.
              </p>
              <CodeSnippet
                type="single"
                copyButtonDescription="test"
                feedback="Copied to clipboard"
                onClick={() => copy(webhookURL)}
              >
                {`${resourceUrl}/event?workflow=${workflowId}&access_token=TOKEN`}
              </CodeSnippet>
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
