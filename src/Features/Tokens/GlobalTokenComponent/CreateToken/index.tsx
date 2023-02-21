import React from "react";
import { Button } from "@carbon/react";
import { ModalFlow } from "@boomerang-io/carbon-addons-boomerang-react";
import { Add } from "@carbon/react/icons";
import CreateServiceTokenForm from "./Form";
import CreateServiceTokenResult from "./Result";
import styles from "./createToken.module.scss";

function CreateServiceTokenButton() {
  const [isTokenCreated, setIsTokenCreated] = React.useState(false);
  const cancelRequestRef = React.useRef<any>();

  return (
    <ModalFlow
      composedModalProps={{
        containerClassName: isTokenCreated && styles.succesModalContainer,
        onAfterClose: () => setIsTokenCreated(false),
      }}
      modalTrigger={({ openModal }: { openModal: () => void }) => (
        <Button
          iconDescription="Create Token"
          onClick={openModal}
          renderIcon={Add}
          style={{ width: "12rem" }}
          size="md"
          data-testid="create-token-button"
        >
          Create Token
        </Button>
      )}
      modalHeaderProps={{
        title: !isTokenCreated ? `Create Global Token` : "Global token successfully created ",
      }}
      confirmModalProps={{
        title: "Close this?",
        children: "Make sure you have saved your token. We will not show it to you again.",
      }}
      onCloseModal={() => {
        if (cancelRequestRef.current) cancelRequestRef.current();
      }}
    >
      <CreateServiceTokenForm
        setIsTokenCreated={() => setIsTokenCreated(true)}
        cancelRequestRef={cancelRequestRef}
      />
      <CreateServiceTokenResult />
    </ModalFlow>
  );
}

export default CreateServiceTokenButton;
