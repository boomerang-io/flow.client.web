import React, { Component } from "react";
import PropTypes from "prop-types";
import Error from "@boomerang/boomerang-components/lib/Error";
import ModalContentBody from "@boomerang/boomerang-components/lib/ModalContentBody";
import ModalContentFooter from "@boomerang/boomerang-components/lib/ModalContentFooter";
import ModalConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import TextArea from "@boomerang/boomerang-components/lib/TextArea";

class VersionCommentForm extends Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired,
    handleOnChange: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired
  };

  state = {
    comment: "",
    saveError: false
  };

  handleOnChange = (value, errors, name) => {
    this.setState(
      () => ({
        comment: value,
        errors: errors
      }),
      () => {
        this.props.shouldConfirmExit(true);
        this.props.handleOnChange(value);
      }
    );
  };

  handleOnSave = () => {
    this.props
      .onSave()
      .then(() => {
        this.props.closeModal();
      })
      .catch(() => {
        this.setState({ saveError: true });
      });
  };

  render() {
    const { loading } = this.props;

    return (
      <>
        <ModalContentBody style={{ maxWidth: "35rem", margin: "auto", height: "28rem", padding: "2rem" }}>
          {this.state.saveError ? (
            <Error theme="bmrg-white" />
          ) : (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <TextArea title="Version comment" placeholder="Enter version comment" onChange={this.handleOnChange} />
            </div>
          )}
        </ModalContentBody>
        <ModalContentFooter>
          <ModalConfirmButton
            theme="bmrg-white"
            text="Create"
            disabled={!this.state.comment || Object.keys(this.state.errors).length || loading}
            onClick={this.handleOnSave}
          />
        </ModalContentFooter>
      </>
    );
  }
}

export default VersionCommentForm;
