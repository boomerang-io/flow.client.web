import React, { Component } from "react";
import PropTypes from "prop-types";
import NoDisplay from "@boomerang/boomerang-components/lib/NoDisplay";
import { default as Body } from "@boomerang/boomerang-components/lib/ModalContentBody";
import { default as ConfirmButton } from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import { default as Footer } from "@boomerang/boomerang-components/lib/ModalContentFooter";
import "./styles.scss";

class BrowserModalContent extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired
  };

  render() {
    return (
      <>
        <Body className="c-browser-modal-body">
          <NoDisplay
            text="Your experience might be less than ideal if you aren't using Chrome"
            style={{ width: "30rem", height: "20rem" }}
          />
        </Body>
        <Footer style={{ paddingTop: "1rem" }}>
          <ConfirmButton onClick={() => this.props.closeModal()} text="Continue, anyway" theme="bmrg-white" />
        </Footer>
      </>
    );
  }
}

export default BrowserModalContent;
