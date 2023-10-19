import React, { useState } from "react";
import axios from "axios";
import { useFeature } from "flagged";
import { useMutation, useQueryClient } from "react-query";
import { Link, useHistory } from "react-router-dom";
import { Button, InlineLoading, OverflowMenu, OverflowMenuItem } from "@carbon/react";
import {
  ConfirmModal,
  ComposedModal,
  ToastNotification,
  notify,
  TooltipHover,
} from "@boomerang-io/carbon-addons-boomerang-react";
import ModalContent from "./ModalContent";
import { formatErrorMessage } from "@boomerang-io/utils";
import { appLink, FeatureFlag } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { BASE_URL } from "Config/servicesConfig";
import { CircleFill, CircleStroke, Popup } from "@carbon/react/icons";
import { ComposedModalChildProps, ModalTriggerProps } from "Types";
import styles from "./integrationCard.module.scss";

interface IntegrationCardProps {
  teamName: string;
  data: any;
  url: string;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ teamName, data, url }) => {
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const history = useHistory();
  const [errorMessage, seterrorMessage] = useState(null);

  const { mutateAsync: deleteWorkflowMutator, isLoading: isDeleting } = useMutation(resolver.deleteWorkflow, {});

  const {
    mutateAsync: executeWorkflowMutator,
    error: executeError,
    isLoading: isExecuting,
  } = useMutation(resolver.postWorkflowRun);

  const handleDisable = async () => {
    try {
      await deleteWorkflowMutator({ id: data.id });
      notify(
        <ToastNotification
          kind="success"
          title={`Disable Integration`}
          subtitle={`${data.name} successfully disabled`}
        />
      );
      queryClient.invalidateQueries(url);
    } catch {
      notify(
        <ToastNotification
          kind="error"
          title="Something's Wrong"
          subtitle={`Request to disable ${data.name.toLowerCase()} failed`}
        />
      );
    }
  };

  /*
   * This function is used to handle the execution of a workflow. It only needs to work for WorkflowView.Workflow as Templates cant be executed
   */
  const handleEnable = async (closeModal: () => void) => {
    try {
      // // @ts-ignore:next-line
      // await executeWorkflowMutator({
      //   data: "",
      // });
      // notify(
      //   <ToastNotification
      //     kind="success"
      //     title={`Enable Integration}`}
      //     subtitle={`Successfully enabled ${data.name.toLowerCase()} integration`}
      //   />
      // );
      // queryClient.invalidateQueries(url);
      window.open(data.link, "_blank");
      closeModal();
    } catch (err) {
      seterrorMessage(
        formatErrorMessage({
          error: err,
          defaultMessage: "Enable integration failed",
        })
      );
      //no-op
    }
  };

  //TODO determine if we need the button to launch the modal or can the whole card be a button
  return (
    <ComposedModal
      composedModalProps={{ containerClassName: styles.modalContainer }}
      modalHeaderProps={{
        title: `Enable ${data.name} Integration`,
        subtitle: `${data.description}`,
      }}
      modalTrigger={({ openModal }: ModalTriggerProps) => (
        <Link
          to=""
          onClick={(e: React.SyntheticEvent) => {
            e.preventDefault();
            openModal();
          }}
        >
          <div className={styles.container}>
            <section className={styles.details}>
              <div className={styles.iconContainer}>
                <img className={styles.icon} alt={`${data.name}`} src={data.icon} />
              </div>
              <div className={styles.descriptionContainer}>
                <h1 title={data.name} className={styles.name} data-testid="card-title">
                  {data.name}
                </h1>
                <p title={data.description} className={styles.description}>
                  {data.description}
                </p>
              </div>
            </section>
            <Popup size={24} className={styles.cardIcon} />
            <section className={styles.launch}></section>
            {isDeleting || isExecuting ? (
              <InlineLoading
                description="Loading.."
                style={{ position: "absolute", left: "0.5rem", top: "0", width: "fit-content" }}
              />
            ) : (
              <div className={styles.status}>
                {data.status === "active" ? (
                  <TooltipHover direction="top" tooltipText="Active">
                    <CircleFill style={{ fill: "#009d9a", marginRight: "0.5rem" }} />
                  </TooltipHover>
                ) : (
                  <TooltipHover direction="top" tooltipText="Inactive">
                    <CircleStroke style={{ fill: "#393939", marginRight: "0.5rem" }} />
                  </TooltipHover>
                )}
              </div>
            )}
          </div>
        </Link>
      )}
    >
      {({ closeModal }: ComposedModalChildProps) => (
        <ModalContent
          closeModal={closeModal}
          executeError={executeError}
          handleEnable={handleEnable}
          errorMessage={errorMessage}
          data={data}
        />
      )}
    </ComposedModal>
  );
};

{
  /* {Array.isArray(formattedProperties) && formattedProperties.length !== 0 ? (
          <ComposedModal
            modalHeaderProps={{
              title: `Workflow Parameters`,
              subtitle: `Provide parameter values for your Workflow`,
            }}
            modalTrigger={({ openModal }: ModalTriggerProps) => (
              <Button size="md" onClick={openModal}>
                Enable
              </Button>
            )}
          >
            {({ closeModal }: ComposedModalChildProps) => (
              <WorkflowInputModalContent
                closeModal={closeModal}
                executeError={executeError}
                executeWorkflow={handleExecuteWorkflow}
                isExecuting={isExecuting}
                inputs={formattedProperties}
              />
            )}
          </ComposedModal>
        ) : ( */
}
{
  /* {data.status === "active" ? (
          <ConfirmModal
            affirmativeAction={handleDisable}
            affirmativeButtonProps={{ kind: "danger" }}
            affirmativeText="Disable"
            isOpen={isDeleteModalOpen}
            negativeAction={() => {
              setIsDeleteModalOpen(false);
            }}
            negativeText="Cancel"
            onCloseModal={() => {
              setIsDeleteModalOpen(false);
            }}
            title={`Disable Integration`}
          >
            {`Are you sure you want to disable the ${data.name.toLowerCase()} integration?.`}
          </ConfirmModal>
        ) : ( */
}

export default IntegrationCard;
