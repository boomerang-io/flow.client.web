import React from "react";
import PropTypes from "prop-types";
import { ModalFlow } from "@boomerang/carbon-addons-boomerang-react";
import BrowserModalContent from "./BrowserModalContent";

const BrowserModal = ({ isOpen }) => {
  return (
    <ModalFlow
      confirmModalProps={{
        title: "Are you sure?"
      }}
      modalHeaderProps={{
        title: "Unsupported Browser",
        label: "Sorry, we are working on it"
      }}
      isOpen={isOpen}
      onCloseModal={() => {
        isOpen = false;
      }}
    >
      <BrowserModalContent />
    </ModalFlow>
  );
};

BrowserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired
};

BrowserModal.defaultProps = {
  isOpen: false
};

export default BrowserModal;
