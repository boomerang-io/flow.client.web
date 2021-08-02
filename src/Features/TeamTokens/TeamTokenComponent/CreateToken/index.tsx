import React from "react";
import { Button, ModalFlow } from "@boomerang-io/carbon-addons-boomerang-react";
import { Add16 } from "@carbon/icons-react";
import CreateServiceTokenForm from "./Form";
import CreateServiceTokenResult from "./Result";
import { FlowTeam } from "Types";
import styles from "./createToken.module.scss";

function CreateServiceTokenButton({activeTeam}: {activeTeam: FlowTeam|null}) {
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
          renderIcon={Add16}
          style={{ width: "12rem" }}
          size="field"
          data-testid="create-token-button"
        >
          Create Token
        </Button>
      )}
      modalHeaderProps={{
        title: !isTokenCreated ? `Create Access Token` : "Access token successfully created ",
        subtitle:
          !isTokenCreated &&
          "To securely connect to the Boomerang platform, your service needs a Access Token with the appropriate scope.",
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
        activeTeam={activeTeam}
      />
      <CreateServiceTokenResult />
    </ModalFlow>
  );
}

export default CreateServiceTokenButton;
