import React, { Component } from "react";
import {
  Button,
  InlineNotification,
  Loading,
  ModalBody,
  ModalFooter,
  ModalForm,
  TextArea,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { AxiosResponse } from "axios";
import { MutationResult } from "react-query";
import { QueryStatus } from "Constants";

interface VersionCommentFormProps {
  closeModal(): void;
  createRevision: (reason: string, callback?: () => any) => void;
  revisionMutation: MutationResult<AxiosResponse<any>, Error>;
}

class VersionCommentForm extends Component<VersionCommentFormProps> {
  state = {
    versionComment: "",
    error: false,
    saveError: false,
  };

  handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    this.props.createRevision(this.state.versionComment, this.props.closeModal);
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
