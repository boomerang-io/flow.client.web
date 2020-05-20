import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Button,
  InlineNotification,
  Loading,
  ModalBody,
  ModalFooter,
  TextArea,
} from "@boomerang/carbon-addons-boomerang-react";
import { QueryStatus } from "Constants";

//TODO: refactor this. It is bad.
class VersionCommentForm extends Component {
  static propTypes = {
    isCreating: PropTypes.bool,
    onSave: PropTypes.func.isRequired,
    handleOnChange: PropTypes.func.isRequired,
    closeModal: PropTypes.func,
  };

  state = {
    versionComment: "",
    error: false,
    saveError: false,
  };

  handleOnChange = (e) => {
    const { value } = e.target;
    let error = false;
    if (!value || value.length > 128) {
      error = true;
    }
    this.setState(() => ({
      versionComment: value,
      error: error,
    }));
  };

  handleOnSave = async () => {
    this.props.onSave({ closeModal: this.props.closeModal, reason: this.state.versionComment });
  };

  render() {
    const { revisionMutation } = this.props;
    const isCreatingRevision = revisionMutation.status === QueryStatus.Loading;
    return (
      <>
        <ModalBody>
          {isCreatingRevision && <Loading />}
          <TextArea
            required
            id="versionComment"
            invalid={this.state.error}
            invalidText="Comment is required"
            labelText="Version comment"
            name="versionComment"
            onChange={this.handleOnChange}
            placeholder="Enter version comment"
            value={this.state.versionComment}
          />
          {revisionMutation.error && (
            <InlineNotification kind="error" title="Something's Wrong" subtitle="Request to create version failed" />
          )}
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" type="button" onClick={this.props.closeModal}>
            Cancel
          </Button>
          <Button disabled={this.state.error} onClick={this.handleOnSave}>
            {isCreatingRevision ? "Creating..." : "Create"}
          </Button>
        </ModalFooter>
      </>
    );
  }
}

export default VersionCommentForm;
