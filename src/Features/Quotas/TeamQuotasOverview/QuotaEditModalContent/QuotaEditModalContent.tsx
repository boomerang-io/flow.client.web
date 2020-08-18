import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useMutation, queryCache } from "react-query";
import {
  Button,
  Loading,
  ModalBody,
  ModalFooter,
  ModalFlowForm,
  notify,
  NumberInput,
  ToastNotification,
  InlineNotification,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { FlowTeamQuotas } from "Types";
import styles from "./QuotaEditModalContent.module.scss";

interface QuotaEditProps {
  closeModal: () => void;
  detailedData: string;
  detailedTitle: string;
  inputLabel: string;
  inputUnits: string;
  stepValue: number;
  teamId: string;
  quotaProperty: string;
  quotaValue: number;
  minValue: number;
  teamQuotasData: FlowTeamQuotas;
}

const QuotaEditModalContent: React.FC<QuotaEditProps> = ({
  closeModal,
  detailedData,
  detailedTitle,
  inputLabel,
  inputUnits,
  stepValue,
  teamId,
  quotaProperty,
  quotaValue,
  minValue,
  teamQuotasData,
}) => {
  const cancelRequestRef = React.useRef<{} | null>();

  const [putQuotaMutator, { isLoading, error }] = useMutation(
    (args: { body: {}; id: string }) => {
      const { promise, cancel } = resolver.putTeamQuotas(args);
      if (cancelRequestRef?.current) {
        cancelRequestRef.current = cancel;
      }
      return promise;
    },
    {
      onSuccess: () => {
        queryCache.invalidateQueries(serviceUrl.getTeamQuotas({ id: teamId }));
        queryCache.invalidateQueries(serviceUrl.getTeams());
      },
    }
  );

  const handleOnSubmit = async (values: { quotaFormValue: number | string }) => {
    let body = { ...teamQuotasData, [quotaProperty]: values.quotaFormValue };
    try {
      putQuotaMutator({ id: teamId, body });
      closeModal();
      notify(
        <ToastNotification kind="success" title="Update Team Quotas" subtitle="Team quota successfully updated" />
      );
    } catch {
      notify(<ToastNotification kind="error" subtitle="Failed to update team quota" title="Something's Wrong" />);
    }
  };

  let buttonText = "Save";
  if (isLoading) {
    buttonText = "Saving...";
  } else if (error) {
    buttonText = "Try again";
  }

  return (
    <Formik
      initialValues={{
        quotaFormValue: quotaValue,
      }}
      onSubmit={handleOnSubmit}
      validationSchema={Yup.object().shape({
        name: Yup.mixed().required(),
      })}
    >
      {(formikProps) => {
        const { values, setFieldValue, errors, touched, dirty } = formikProps;
        return (
          <ModalFlowForm>
            <ModalBody className={styles.modalBodyContainer}>
              <div className={styles.modalInputContainer}>
                {isLoading && <Loading />}
                <dt className={styles.detailedTitle}>{detailedTitle}</dt>
                <dt className={styles.detailedData}>{detailedData}</dt>
                <div className={styles.inputContainer}>
                  <NumberInput
                    id="team-update-name-id"
                    data-testid="text-input-team-name"
                    labelText={inputLabel}
                    value={values.quotaFormValue}
                    step={stepValue}
                    min={minValue}
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                      //@ts-ignore
                      setFieldValue("quotaFormValue", evt.imaginaryTarget.value);
                    }}
                    invalid={errors.quotaFormValue && !touched.quotaFormValue}
                    invalidText={errors.quotaFormValue}
                  />
                  {inputUnits && <h5 className={styles.inputUnits}>{inputUnits}</h5>}
                </div>

                {error && (
                  <InlineNotification
                    kind="error"
                    lowContrast
                    title="Quota changed failed!"
                    subtitle="Give it another go or try again later."
                  />
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button kind="secondary" type="button" onClick={closeModal}>
                Cancel
              </Button>
              <Button disabled={errors.quotaFormValue || isLoading || !dirty} onClick={() => handleOnSubmit(values)}>
                {buttonText}
              </Button>
            </ModalFooter>
          </ModalFlowForm>
        );
      }}
    </Formik>
  );
};

export default QuotaEditModalContent;
