import React, { Component } from "react";
import PropTypes from "prop-types";
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
      defaultState: props.model.switchCondition === null ? true : false
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
    this.setState({ modalIsOpen: false, switchCondition: this.props.model.switchCondition }, () => {
      if (this.props.model.switchCondition === null) {
        this.setState({ defaultState: true });
      } else {
        this.setState({ defaultState: false });
      }
    });
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
          this.setState({ switchCondition: null });
        }
      }
    );
  };

  validateSwitch = value => {
    if (value === undefined || value === "" || value === " ") {
      return false;
    }
    return true;
  };

  render() {
    const { model } = this.props;
    let linkStyle = {};

    if (!model.sourcePort || !model.targetPort) {
      linkStyle = { opacity: "0.25" };
    }

    if (this.path) {
      this.halfwayPoint = this.path.getPointAtLength(this.path.getTotalLength() * 0.5);
      this.endPoint = this.path.getPointAtLength(this.path.getTotalLength());
    }

    let seperatedLinkState;
    if (this.props.model.switchCondition) {
      seperatedLinkState = this.props.model.switchCondition.replace(/\n/g, ",");
      console.log(seperatedLinkState);
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
                <div>
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
                        validateSwitch={this.validateSwitch}
                      />
                    </ModalFlow>
                  </Modal>
                </div>
              </foreignObject>
            </g>
          </>
        )}
        {!this.props.diagramEngine.diagramModel.locked && (
          <g transform={`translate(${this.halfwayPoint.x + 10}, ${this.halfwayPoint.y + 10})`}>
            <text className="small">{this.props.model.switchCondition === null ? "default" : seperatedLinkState}</text>
          </g>
        )}
        {this.props.diagramEngine.diagramModel.locked && (
          <g transform={`translate(${this.halfwayPoint.x}, ${this.halfwayPoint.y})`}>
            <text className="small">{this.props.model.switchCondition === null ? "default" : seperatedLinkState}</text>
          </g>
        )}

        <path
          ref={ref => {
            this.path = ref;
          }}
          style={linkStyle}
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

SwitchLink.propTypes = {
  model: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  diagramEngine: PropTypes.object.isRequired
};

export default SwitchLink;
