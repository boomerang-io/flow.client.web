import React from "react";
import { Button } from "@carbon/react";
import { ModalFlow } from "@boomerang-io/carbon-addons-boomerang-react";
import { Add } from "@carbon/react/icons";
import CreateServiceTokenForm from "./Form";
import CreateServiceTokenResult from "./Result";
import styles from "./CreateToken.module.scss";

interface CreateServiceTokenButtonProps {
  principal?: string | null;
  getTokensUrl: string;
}

function CreateTokenButton({ principal, getTokensUrl }: CreateServiceTokenButtonProps) {
  const [isTokenCreated, setIsTokenCreated] = React.useState(false);
  const cancelRequestRef = React.useRef<any>();
  return (
    <ModalFlow
      composedModalProps={{
        containerClassName: isTokenCreated && styles.succesModalContainer,
        onAfterClose: () => setIsTokenCreated(false),
      }}
      modalTrigger={({ openModal }: { openModal: () => void }) => (
        <Button kind="ghost" size="md" renderIcon={Add} onClick={openModal} data-testid="create-token-button">
          Add a new token
        </Button>
      )}
      modalHeaderProps={{
        title: !isTokenCreated ? `Create Token` : "Token successfully created ",
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
        principal={principal}
        getTokensUrl={getTokensUrl}
      />
      <CreateServiceTokenResult />
    </ModalFlow>
  );
}

export default CreateTokenButton;
