// @ts-nocheck
import React from "react";
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
import styles from "./QuotaEditModalContent.module.scss";
import { Formik } from "formik";
import * as Yup from "yup";

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
}) => {
  const cancelRequestRef = React.useRef<{} | null>();

  const [patchQuotaMutator, { isLoading, error }] = useMutation(
    (args) => {
      const { promise, cancel } = resolver.patchTeamQuotas(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => {
        queryCache.invalidateQueries(serviceUrl.getTeamQuotas({ id: teamId }));
      },
    }
  );

  const handleOnSubmit = async (values: { quotaFormValue: number | string }) => {
    try {
      patchQuotaMutator({ id: teamId, body: { [quotaProperty]: values.quotaFormValue } });
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
                {/*<h3 className={styles.subtitle}>{subTitle}</h3>*/}
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
                    // size="sm"
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
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
