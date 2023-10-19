import React from "react";
import { Button, InlineNotification, ModalBody, ModalFooter } from "@carbon/react";
import { ModalForm } from "@boomerang-io/carbon-addons-boomerang-react";
interface ModalContentProps {
  closeModal: () => void;
  error: any;
  handleEnable: (closeModal: () => void) => void;
  errorMessage: { title: string; message: string } | null;
  data: any;
}

const ModalContent: React.FC<ModalContentProps> = ({ closeModal, error, handleEnable, errorMessage, data }) => {
  return (
    <ModalForm>
      {error && (
        <ModalBody>
          <InlineNotification lowContrast kind="error" title={errorMessage?.title} subtitle={errorMessage?.message} />
        </ModalBody>
      )}
      <ModalBody>
        <p>{data.instructions}</p>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" type="button" onClick={closeModal}>
          Cancel
        </Button>
        <Button
          onClick={(e: React.SyntheticEvent) => {
            e.preventDefault();
            handleEnable(closeModal);
          }}
        >
          Enable
        </Button>
      </ModalFooter>
    </ModalForm>
  );
};

export default ModalContent;
