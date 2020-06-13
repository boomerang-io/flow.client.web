import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Button,
  InlineNotification,
  Loading,
  ModalBody,
  ModalFooter,
  ModalForm,
  TextArea,
} from "@boomerang/carbon-addons-boomerang-react";
import { QueryStatus } from "Constants";

class VersionCommentForm extends Component {
  static propTypes = {
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
    this.props.createRevision({ callback: this.props.closeModal, reason: this.state.versionComment });
  };

  render() {
    const { revisionMutation } = this.props;
    const isCreatingRevision = revisionMutation.status === QueryStatus.Loading;
    return (
      <ModalForm>
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
            <InlineNotification
              lowContrast
              kind="error"
              title="Something's Wrong"
              subtitle="Request to create version failed"
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" type="button" onClick={this.props.closeModal}>
            Cancel
          </Button>
          <Button disabled={this.state.error || isCreatingRevision} onClick={this.handleOnSave}>
            {isCreatingRevision ? "Creating..." : "Create"}
          </Button>
        </ModalFooter>
      </ModalForm>
    );
  }
}

export default VersionCommentForm;
