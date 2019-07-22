import React, { Component } from "react";
import PropTypes from "prop-types";
import ModalWrapper from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import BrowserModalContent from "./BrowserModalContent";

class BrowserModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired
  };

  static defaultProps = {
    isOpen: false
  };

  render() {
    return (
      <ModalWrapper
        theme="bmrg-flow"
        isOpen={this.props.isOpen}
        fullscreen={true}
        modalContent={closeModal => (
          <ModalFlow
            className="c-browser-modal-content"
            headerTitle="UNSUPPORTED BROWSER"
            headerSubtitle="Sorry, we are working on it"
            closeModal={closeModal}
            theme="bmrg-flow"
            fullscreen={true}
          >
            <BrowserModalContent closeModal={closeModal} />
          </ModalFlow>
        )}
      />
    );
  }
}

export default BrowserModal;
