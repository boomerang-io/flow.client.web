import React, { Component } from "react";
import PropTypes from "prop-types";
import Body from "@boomerang/boomerang-components/lib/ModalContentBody";
import Header from "@boomerang/boomerang-components/lib/ModalContentHeader";
import Footer from "@boomerang/boomerang-components/lib/ModalContentFooter";
import NavButton from "@boomerang/boomerang-components/lib/ModalNavButton";
import DropZone from "./Dropzone";

class WorkflowAttachment extends Component {
  state = {
    dragEnter: false,
    empty: !this.props.formData.files.length,
    files: this.props.formData.files.length > 0 ? this.props.formData.files : [],
    loaded: this.props.formData.files.length,
    uploading: false
  };

  static propTypes = {
    formData: PropTypes.object
  };

  componentDidMount() {
    this.props.shouldConfirmExit(true);
  }

  appendFile = files => {
    this.setState({ files: [...files] });
    const formData = {
      files: [...files]
    };
    this.props.saveValues(formData);
  };

  removeFile = () => {
    this.setState(() => ({
      empty: true,
      uploading: false,
      loaded: false,
      dragEnter: false,
      files: []
    }));
  };

  uploadingFile = () => {
    this.setState(() => ({
      empty: false,
      uploading: true,
      loaded: false,
      dragEnter: false
    }));
  };

  loadedFile = () => {
    this.setState(() => ({
      empty: false,
      uploading: false,
      loaded: true,
      dragEnter: false
    }));
  };

  dragEnter = () => {
    this.setState(() => ({
      empty: false,
      uploading: false,
      loaded: false,
      dragEnter: true
    }));
  };

  dragLeave = () => {
    this.setState(() => ({
      empty: true,
      uploading: false,
      loaded: false,
      dragEnter: false
    }));
  };

  onClickBackButton = () => {
    this.props.requestPreviousStep();
  };

  addFile = file => {
    this.setState({ files: [...file] });
  };

  handleSubmit = event => {
    event.preventDefault();
    // this.addFile(this.state.files);

    // if (this.state.loaded) {
    //   setTimeout(this.uploadingFile, 1);
    //   setTimeout(this.uploadingFile, 1);
    // } else {
    this.props.requestNextStep();
    // }
  };

  showWizardText = () => {
    const BLANK = "";
    const ONWARD = "ONWARD";

    if (this.state.loaded) {
      return ONWARD;
    }
    return BLANK;
  };

  render() {
    return (
      <form className="c-workflow-import" onSubmit={e => e.preventDefault()}>
        <Header theme="bmrg-white" title="ADD A WORKFLOW" subtitle="Select the Workflow file you want to upload" />
        <Body
          style={{
            height: "22rem",
            width: "29rem",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <DropZone
            appendFile={this.appendFile}
            removeFile={this.removeFile}
            loadedFile={this.loadedFile}
            dragEnter={this.dragEnter}
            dragLeave={this.dragLeave}
            files={this.state.files}
            goToStep={this.props.requestNextStep}
            state={this.state}
          />
        </Body>
        <Footer>
          <NavButton reversed text="BACK" theme="bmrg-white" onClick={this.props.requestPreviousStep} />
          <NavButton
            text={this.showWizardText()}
            theme="bmrg-white"
            onClick={this.handleSubmit}
            disabled={this.state.files.length === 0}
          />
        </Footer>
      </form>
    );
  }
}

export default WorkflowAttachment;
