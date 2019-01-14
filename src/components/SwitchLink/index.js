import React, { Component } from "react";
import PropTypes from "prop-types"; //to implement
import Modal from "react-modal";
import CloseModalButton from "@boomerang/boomerang-components/lib/CloseModalButton";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import ConfigureSwitchModal from "./ConfigureSwitchModal";
import TriangleArrowIcon from "./TriangleArrow";
import pencilIcon from "./pencil.svg";
import "./styles.scss";

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
    //this.props.diagramEngine.repaintCanvas();
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

  handleSave = e => {
    e.preventDefault();
    this.setState({ modalIsOpen: false });
    //also save back the state
    this.props.model.switchCondition = this.state.switchCondition;
    this.props.diagramEngine.repaintCanvas();
  };

  updateDefaultState = () => {
    this.setState(
      prevState => ({ defaultState: !prevState.defaultState }),
      () => {
        if (this.state.defaultState) {
          console.log("changing state");
          this.setState({ switchCondition: "default" });
        }
      }
    );
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
                    contentLabel="Example Modal"
                    contentLabel="Modal"
                    documentRootTagId="app"
                    overlayClassName="bmrg--c-modal-overlay"
                    ariaHideApp={true}
                    className="bmrg--c-modal"
                  >
                    <ModalFlow
                      theme="bmrg-white"
                      title
                      closeModal={this.closeModal}
                      headerTitle="Switch"
                      headerSubtitle="Set it up"
                      isFetching={false}
                      fullscreen={false}
                    >
                      <ConfigureSwitchModal
                        defaultState={this.state.defaultState}
                        onSubmit={this.handleSave}
                        switchCondition={this.state.switchCondition}
                        updateDefaultState={this.updateDefaultState}
                        updateSwitchState={this.updateSwitchState}
                      />
                    </ModalFlow>
                  </Modal>
                </g>
              </foreignObject>
            </g>
            <g transform={`translate(${this.halfwayPoint.x - 10}, ${this.halfwayPoint.y + 8})`}>
              <text x="55" y="55" className="small">
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
            <TriangleArrowIcon />
          </g>
        )}
      </>
    );
  }
}

export default SwitchLink;
