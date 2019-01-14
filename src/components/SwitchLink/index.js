import React, { Component } from "react";
import CloseModalButton from "@boomerang/boomerang-components/lib/CloseModalButton";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import TriangleArrow from "./TriangleArrow";
import pencilIcon from "./pencil.svg";
import Modal from "react-modal";
import classnames from "classnames";

import ModalContentBody from "@boomerang/boomerang-components/lib/ModalContentBody";
import ModalContentHeader from "@boomerang/boomerang-components/lib/ModalContentHeader";
import ModalContentFooter from "@boomerang/boomerang-components/lib/ModalContentFooter";
import ModalConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
//import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import Toggle from "@boomerang/boomerang-components/lib/Toggle";

class SwitchLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchCondition: props.model.switchCondition,
      modalIsOpen: false,
      defaultState: true
    };

    this.halfwayPoint = "";
    this.endPoint = "";
  }

  componentDidMount() {
    this.props.diagramEngine.repaintCanvas();
    //For accessibility: https://github.com/reactjs/react-modal#app-element
    if (document.getElementById(this.props.documentRootTagId)) {
      Modal.setAppElement(`#${this.props.documentRootTagId}`);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleOnDelete = () => {
    this.props.model.remove();
    this.props.diagramEngine.repaintCanvas();
  };

  updateSwitchState = switchCondition => {
    this.setState({ switchCondition: switchCondition });
  };

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };
  closeModal = () => {
    this.setState({ modalIsOpen: false });
    //also save back the state
    //this.props.model.switchCondition = this.state.switchCondition;
    //this.props.diagramEngine.repaintCanvas();
  };

  handleSave = () => {
    this.setState({ modalIsOpen: false });
    //also save back the state
    this.props.model.switchCondition = this.state.switchCondition;
    this.props.diagramEngine.repaintCanvas();
  };

  updateDefaultState = () => {
    this.setState(prevState => ({ defaultState: !prevState.defaultState }));
    console.log(this.state);
    if (this.state.defaultState === true) {
      console.log("changing state");
      this.setState({ switchCondition: "default" });
    }
  };

  render() {
    //console.log(this.state);
    if (this.path) {
      this.halfwayPoint = this.path.getPointAtLength(this.path.getTotalLength() * 0.5);
      this.endPoint = this.path.getPointAtLength(this.path.getTotalLength());
    }
    return (
      <>
        {this.path && !this.props.diagramEngine.diagramModel.locked && (
          <>
            <g transform={`translate(${this.halfwayPoint.x}, ${this.halfwayPoint.y - 20}) scale(0.7)`}>
              <foreignObject>
                <CloseModalButton onClick={this.handleOnDelete} />
              </foreignObject>
            </g>
            <g transform={`translate(${this.halfwayPoint.x - 17}, ${this.halfwayPoint.y + 2})`}>
              <foreignObject>
                {/* <EditSwitchButton onClick={this.handleClick} initialSwitchCondition={this.state.switchCondition} /> */}
                <g>
                  <img
                    src={pencilIcon}
                    className="b-editswitch-button__img"
                    alt="Edit Switch Property"
                    onClick={this.openModal}
                  />
                  <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={{ backgroundColor: "#fbfcfc", color: "#272727" }}
                    fullScree
                    contentLabel="Example Modal"
                    contentLabel="Modal"
                    documentRootTagId="app"
                    overlayClassName="bmrg--c-modal-overlay"
                    ariaHideApp={true}
                    //className={classnames("bmrg--c-modal", { "--full-screen": false })}
                    className={"bmrg--c-modal"}
                    defaultState={this.state.default}
                  >
                    <form onSubmit={this.handleSave}>
                      <ModalContentHeader title="Edit Switch Value" subtitle="" theme="bmrg-white" />
                      <CloseModalButton onClick={this.closeModal} />
                      <ModalContentBody
                        style={{ maxWidth: "25rem", margin: "0 auto", flexDirection: "column", overflow: "visible" }}
                      >
                        <div className="b-default">
                          <div className="b-default__desc">Default?</div>
                          <Toggle
                            aria-labelledby="toggle-default"
                            className="b-default__toggle"
                            name="default"
                            checked={this.state.defaultState}
                            onChange={this.updateDefaultState}
                            theme="bmrg-white"
                            red
                          />
                          <div className="b-default__explanation">
                            When this switch is on, this connection will be taken only when no others are matched.
                          </div>
                        </div>

                        {!this.state.defaultState && (
                          <TextInput
                            alwaysShowTitle
                            required
                            value={this.state.switchCondition}
                            title="Switch Property Value"
                            placeholder="Enter a value"
                            name="cron"
                            theme="bmrg-white"
                            onChange={this.updateSwitchState}
                            style={{ paddingBottom: "1rem" }}
                          />
                        )}
                      </ModalContentBody>
                      <ModalContentFooter>
                        <ModalConfirmButton text="SAVE" theme="bmrg-white" disabled={false} type="submit" />
                      </ModalContentFooter>
                    </form>
                  </Modal>
                </g>
              </foreignObject>
            </g>
            <g transform={`translate(${this.halfwayPoint.x - 10}, ${this.halfwayPoint.y + 8})`}>
              <text x="55" y="55" class="small">
                {this.props.model.switchCondition}
              </text>
            </g>
          </>
        )}
        <path
          ref={ref => {
            this.path = ref;
          }}
          strokeWidth={this.props.model.width}
          stroke="rgba(255,0,0,0.5)"
          d={this.props.path}
        />
        {this.path && this.props.model.targetPort && (
          <g fill="none" transform={`translate(${this.endPoint.x - 19}, ${this.endPoint.y - 10}) scale(.0375)`}>
            <TriangleArrow />
          </g>
        )}
      </>
    );
  }
}

export default SwitchLink;
