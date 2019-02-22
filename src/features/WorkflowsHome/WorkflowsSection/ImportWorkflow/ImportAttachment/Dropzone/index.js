import React, { Component } from "react";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import image from "Assets/icons/docs.svg";
import closeBlack from "Assets/svg/close_black.svg";
import "./styles.scss";

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

  resetMaxFileSizeFlag = () => {
    this.setState(() => ({
      errorFlag: false
    }));
  };

  onDrop = async files => {
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
        <div>
          <div className="b-import-dropzone-attachment">
            <div className="b-import-dropzone-attachment__dragEnter">{DROP_MESSAGE}</div>
          </div>
        </div>
      );
    } else {
      if (this.props.state.uploading) {
        return (
          <div>
            {this.state.files.map(file => (
              <div className="b-import-dropzone-attachment" key={file.name}>
                <div className="b-import-dropzone-attachment__left">
                  <img src={file.preview} alt={file.preview} className="b-import-dropzone-attachment__img" />
                </div>
                <div className="b-import-dropzone-attachment__center">
                  <div
                    id="importWorkflowAttachment-progress"
                    ref={progress => {
                      this.progress = progress;
                    }}
                  >
                    <div
                      id="importWorkflowAttachment-progress-bar"
                      ref={progressBar => {
                        this.progressBar = progressBar;
                      }}
                    />
                  </div>
                </div>
                <div className="b-import-dropzone-attachment__right" onClick={this.removeFile}>
                  <img src={closeBlack} className="b-import-dropzone-close__img" alt="dropzone" />
                </div>
              </div>
            ))}
          </div>
        );
      } else {
        // Attached file
        if (!this.state.errorFlag) {
          return (
            <div>
              {this.state.files.map(file => (
                <div className="b-import-dropzone-attachment" key={file.name}>
                  <div className="b-import-dropzone-attachment__left">
                    <img src={file.preview} alt={file.preview} className="b-import-dropzone-attachment__img" />
                  </div>
                  <div className="b-import-dropzone-attachment__center">{file.name}</div>
                  <div className="b-import-dropzone-attachment__right" onClick={this.removeFile}>
                    <img src={closeBlack} className="b-import-dropzone-close__img" alt="close-dropzone" />
                  </div>
                </div>
              ))}
            </div>
          );
        } else {
          // Attached file too large
          if (this.state.files.length > 0) {
            this.removeFile();
          }
          return (
            <div
              className="b-import-dropzone-attachment b-import-dropzone-attachment-error"
              onClick={this.resetMaxFileSizeFlag}
            >
              {ERROR_MESSAGE}
            </div>
          );
        }
      }
    }
  };

  render() {
    const imageSubString = "image/";
    const files = this.state.files.length > 0 ? this.state.files : [];
    const fileSizeMessage = "File must be a .json under 1MB.";
    const buttonMessage = "CHOOSE A FILE OR DRAG ONE HERE";

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
        {this.uploadProgress()}
      </section>
    );
  }
}

export default DropZone;
