import React, { Component } from "react";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import { CloseOutline16 } from "@carbon/icons-react";
import image from "Assets/icons/docs.svg";
import "./styles.scss";
import isAccessibleEvent from "@boomerang/boomerang-utilities/lib/isAccessibleEvent";

const MAX_FILE_SIZE = 1048576;
const ERROR_MESSAGE = "The file must be a .json under 1MB.";
const DROP_MESSAGE = "Drop it mate";

class DropZone extends Component {
  state = {
    dragEnter: false,
    files: this.props.files.length === 0 ? [] : this.props.files,
    errorFlag: false,
    fyleTypeFlag: false
  };

  static propTypes = {
    appendFile: PropTypes.func,
    dragEnter: PropTypes.func,
    dragLeave: PropTypes.func,
    files: PropTypes.array,
    goToStep: PropTypes.func,
    loadedFile: PropTypes.func,
    removeFile: PropTypes.func,
    state: PropTypes.object
  };

  progressBarTrigger = () => {
    let progressBar = this.progressBar;
    let progress = this.progress;
    let dropZone = this;
    let width = 0;
    let progressBarTimer;

    function frame() {
      if (width >= 100) {
        clearInterval(progressBarTimer);
        if (dropZone.state.files.length > 0) {
          dropZone.props.goToStep(2);
        }
      } else {
        width++;
        progressBar.style.width = `${width}%`;
      }
    }
    if (progressBar && progress) {
      progressBarTimer = setInterval(frame, 15);
    }
  };

  resetErrorFlag = () => {
    this.setState(() => ({
      errorFlag: false
    }));
  };

  onDrop = files => {
    if (files.length === 0 || files[0].size > MAX_FILE_SIZE) {
      this.setState(() => ({
        errorFlag: true
      }));
    } else {
      this.props.dragLeave();
      this.props.appendFile(files);
      this.props.loadedFile();
      this.setState(() => ({
        files,
        dragEnter: false
      }));
    }
  };

  onDragEnter = e => {
    e.preventDefault();

    if (!this.state.dragEnter) {
      this.setState(() => ({
        dragEnter: true
      }));
      this.props.dragEnter();
    }
  };

  onDragLeave = e => {
    e.preventDefault();
    this.setState(() => ({
      dragEnter: false
    }));
    this.props.dragLeave();
  };

  uploadProgress = () => {
    if (this.props.state.uploading) {
      this.progressBarTrigger();
    }
  };

  removeFile = () => {
    this.setState(() => ({
      files: []
    }));
    this.props.removeFile();
  };

  showDragEnterOrDrop = () => {
    if (this.state.dragEnter) {
      return (
        <section className="b-import-dropzone" id="import-dropzone__drop-area">
          <h1 className="b-import-dropzone__dragEnter">{DROP_MESSAGE}</h1>
        </section>
      );
    } else {
      // Attached file
      if (!this.state.errorFlag) {
        return (
          <section id="import-dropzone__file-info">
            {this.state.files.map(file => (
              <div className="b-import-dropzone" key={file.name}>
                <div className="b-import-dropzone__left">
                  <img src={file.preview} alt={file.preview} className="b-import-dropzone__img" />
                </div>
                <label className="b-import-dropzone__center">{file.name}</label>
                <div
                  className="b-import-dropzone__right"
                  data-tip
                  data-for="remove"
                  onClick={this.removeFile}
                  onKeyDown={e => isAccessibleEvent(e) && this.removeFile()}
                  role="button"
                  tabIndex="0"
                >
                  <CloseOutline16 className="b-import-dropzone-close__img" />
                </div>
                <Tooltip id="remove">Remove</Tooltip>
              </div>
            ))}
          </section>
        );
      } else {
        // Attached file too large
        if (this.state.files.length > 0) {
          this.removeFile();
        }
        return (
          <div
            className="b-import-dropzone b-import-dropzone-error"
            onClick={this.resetErrorFlag}
            onKeyDown={e => isAccessibleEvent(e) && this.resetErrorFlag()}
            role="button"
            tabIndex="0"
          >
            {ERROR_MESSAGE}
          </div>
        );
      }
    }
  };

  render() {
    const imageSubString = "image/";
    const files = this.state.files.length > 0 ? this.state.files : [];
    const fileSizeMessage = "File must be a .json under 1MB.";
    const buttonMessage = "Choose a file or drag one here";

    // Updates the file preview for non-image files.
    if (files.length > 0) {
      files.map((file, index) =>
        file.type.includes(imageSubString) ? files[index].preview : (files[index].preview = image)
      );
    }

    return (
      <section
        className="b-importWorkflowDropzoneSection"
        id="importWorkflowDropzoneSection"
        onDragEnter={this.onDragEnter}
      >
        <Dropzone
          className="dropzone b-import-dropzone__button-text"
          onDrop={this.onDrop}
          onDragLeave={this.onDragLeave}
          onDragEnter={this.onDragEnter}
          accept=".json"
        >
          <div className="b-import-dropzone-button">{buttonMessage}</div>
          <div className="b-import-dropzone__message">{fileSizeMessage}</div>
        </Dropzone>
        {this.showDragEnterOrDrop()}
      </section>
    );
  }
}

export default DropZone;
