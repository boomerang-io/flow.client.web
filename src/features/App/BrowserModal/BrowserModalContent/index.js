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
          <NoDisplay text="Your experience may be degraded if you aren't using a recent version of Chrome or Firefox" />
        </Body>
        <Footer style={{ paddingTop: "1rem" }}>
          <ConfirmButton onClick={() => this.props.closeModal()} text="Continue, anyway" theme="bmrg-flow" />
        </Footer>
      </>
    );
  }
}

export default BrowserModalContent;
