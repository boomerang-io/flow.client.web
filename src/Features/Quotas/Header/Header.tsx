import React from "react";
import {
  Button,
  ComposedModal,
  FeatureHeader,
  FeatureHeaderTitle as HeaderTitle,
  InlineNotification,
  Loading,
  ModalBody,
  ModalFooter,
  ModalForm,
  notify,
  ToastNotification,
} from "@carbon/react";
import { useMutation, useQueryClient } from "react-query";
import { resolver, serviceUrl } from "Config/servicesConfig";
import { Reset } from "@carbon/react/icons";
import { ModalTriggerProps, FlowTeam, ComposedModalChildProps, FlowTeamQuotas } from "Types";
import styles from "./Header.module.scss";

interface HeaderProps {
  defaultQuotasData: FlowTeamQuotas;
  defaultQuotasError: object;
  defaultQuotasIsLoading: boolean;
  selectedTeam: FlowTeam;
}

const Header: React.FC<HeaderProps> = ({
  selectedTeam,
  defaultQuotasData,
  defaultQuotasError,
  defaultQuotasIsLoading,
}) => {
  return (
    <FeatureHeader
      className={styles.featureHeader}
      header={<HeaderTitle>{selectedTeam.name}</HeaderTitle>}
      actions={
        <ComposedModal
          composedModalProps={{
            containerClassName: styles.modalContainer,
          }}
          modalHeaderProps={{
            title: "Restore defaults",
            subtitle: "This will change all quotas to the following default values. This action cannot be undone.",
          }}
          modalTrigger={({ openModal }: ModalTriggerProps) => (
            <Button className={styles.resetButton} size="md" renderIcon={Reset} onClick={openModal}>
              Restore defaults
            </Button>
          )}
        >
          {({ closeModal }: ComposedModalChildProps) => (
            <RestoreModalContent
              closeModal={closeModal}
              defaultQuotas={defaultQuotasData}
              defaultQuotasError={defaultQuotasError}
              defaultQuotasIsLoading={defaultQuotasIsLoading}
              teamId={selectedTeam.id}
            />
          )}
        </ComposedModal>
      }
    />
  );
};

interface restoreDefaultProps {
  closeModal: Function;
  defaultQuotas: FlowTeamQuotas;
  defaultQuotasError: object;
  defaultQuotasIsLoading: boolean;
  teamId: string;
}

const RestoreModalContent: React.FC<restoreDefaultProps> = ({
  closeModal,
  defaultQuotas,
  defaultQuotasError,
  defaultQuotasIsLoading,
  teamId,
}) => {
  const cancelRequestRef = React.useRef<{} | null>();
  const queryClient = useQueryClient();

  const { mutateAsync: defaultQuotasMutator, isLoading, error } = useMutation(
    (args: { id: string }) => {
      const { promise, cancel } = resolver.putTeamQuotasDefault(args);
      if (cancelRequestRef?.current) {
        cancelRequestRef.current = cancel;
      }
      return promise;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(serviceUrl.getTeamQuotas({ id: teamId }));
        queryClient.invalidateQueries(serviceUrl.getTeams());
      },
    }
  );

  const handleRestoreDefaultQuota = async () => {
    try {
      await defaultQuotasMutator({ id: teamId });
      closeModal();
      notify(
        <ToastNotification
          kind="success"
          title="Restore Default Quotas"
          subtitle="Successfully restored default quotas"
        />
      );
    } catch {
      notify(<ToastNotification kind="error" title="Something's wrong" subtitle="Failed to restore default quotas" />);
    }
  };

  let buttonText = "Save";
  if (isLoading) {
    buttonText = "Saving...";
  } else if (error) {
    buttonText = "Try again";
  }
  return (
    <ModalForm>
      <ModalBody className={styles.modalBodyContainer}>
        <hr className={styles.divider} />
        {defaultQuotasIsLoading ? (
          <Loading />
        ) : (
          <div className={styles.gridContainer}>
            <section>
              <dt className={styles.detailedTitle}>Maximum number of Workflows </dt>
              <dt className={styles.detailedData}>
                {defaultQuotasError ? "---" : `${defaultQuotas.maxWorkflowCount} Workflows`}{" "}
              </dt>
            </section>
            <section>
              <dt className={styles.detailedTitle}>Maximum Workflow executions </dt>
              <dt className={styles.detailedData}>
                {defaultQuotasError ? "---" : `${defaultQuotas.maxWorkflowExecutionMonthly} per month`}
              </dt>
            </section>
            <section>
              <dt className={styles.detailedTitle}>Storage limit</dt>
              <dt className={styles.detailedData}>
                {defaultQuotasError ? "---" : `${defaultQuotas.maxWorkflowExecutionMonthly}GB per Workflow`}
              </dt>
            </section>
            <section>
              <dt className={styles.detailedTitle}>Maximum Workflow duration</dt>
              <dt className={styles.detailedData}>{`${defaultQuotas.maxWorkflowExecutionTime} minutes`}</dt>
            </section>
            <section>
              <dt className={styles.detailedTitle}>Maximum concurrent Workflows</dt>
              <dt className={styles.detailedData}>
                {defaultQuotasError ? "---" : `${defaultQuotas.maxConcurrentWorkflows} Workflows`}
              </dt>
            </section>
          </div>
        )}
        {error && (
          <InlineNotification
            lowContrast
            kind="error"
            title="Quota restore default failed!"
            subtitle="Give it another go or try again later."
          />
        )}
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" type="button" onClick={closeModal}>
          Cancel
        </Button>
        <Button disabled={isLoading} onClick={handleRestoreDefaultQuota}>
          {buttonText}
        </Button>
      </ModalFooter>
    </ModalForm>
  );
};

export default Header;
