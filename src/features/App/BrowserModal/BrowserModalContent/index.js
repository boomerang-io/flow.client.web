import React from "react";
import PropTypes from "prop-types";
import NoDisplay from "@boomerang/boomerang-components/lib/NoDisplay";
import { Button, ModalBody, ModalFooter } from "carbon-components-react";
import "./styles.scss";

const BrowserModalContent = ({ closeModal }) => {
  return (
    <>
      <ModalBody className="c-browser-modal-body">
        <NoDisplay text="Your experience may be degraded if you aren't using a recent version of Chrome or Firefox" />
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => closeModal()}>Continue, anyway </Button>
      </ModalFooter>
    </>
  );
};

BrowserModalContent.propTypes = {
  closeModal: PropTypes.func.isRequired
};

export default BrowserModalContent;
