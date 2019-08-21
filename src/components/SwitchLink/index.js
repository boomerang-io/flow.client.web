import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as appActions } from "State/app";
import Modal from "react-modal";
import CloseModalButton from "@boomerang/boomerang-components/lib/CloseModalButton";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import ConfigureSwitchModal from "./ConfigureSwitchModal";
import pencilIcon from "./pencil.svg";
import "./styles.scss";

class SwitchLink extends Component {
  static propTypes = {
    diagramEngine: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      switchCondition: props.model.switchCondition,
      modalIsOpen: false,
      defaultState: props.model.switchCondition === null ? true : false
    };

    this.path = React.createRef();

    this.halfwayPoint = "";
    this.endPoint = "";
  }

  componentDidMount() {
    this.forceUpdate();
    this.props.diagramEngine.repaintCanvas();
  }

  componentDidUpdate() {
    this.props.diagramEngine.repaintCanvas();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleOnDelete = () => {
    this.props.model.remove();
    this.props.diagramEngine.repaintCanvas();
  };

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  updateSwitchState = (switchCondition, saveFunction) => {
    this.setState(
      { switchCondition: switchCondition },

      () => saveFunction()
    );
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

  handleSave = () => {
    this.setState({ modalIsOpen: false });
    //also save back the state
    if (this.state.defaultState) {
      this.props.model.switchCondition = null;
    } else {
      this.props.model.switchCondition = this.state.switchCondition;
    }
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

  render() {
    const { model } = this.props;
    let linkStyle = {};

    if (!model.sourcePort || !model.targetPort) {
      linkStyle = { opacity: "0.25" };
    }

    if (this.path.current) {
      this.halfwayPoint = this.path.current.getPointAtLength(this.path.current.getTotalLength() * 0.5);
      this.endPoint = this.path.current.getPointAtLength(this.path.current.getTotalLength());
    }

    let seperatedLinkState;
    if (this.props.model.switchCondition) {
      seperatedLinkState = this.props.model.switchCondition.replace(/\n/g, ",");
    }
    return (
      <svg>
        {this.path.current && !this.props.diagramEngine.diagramModel.locked && (
          <>
            <g transform={`translate(${this.halfwayPoint.x - 10}, ${this.halfwayPoint.y - 30}) scale(0.7)`}>
              <foreignObject
                width="2.875rem"
                height="2.875rem"
                x="0"
                y="0"
                requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
              >
                <CloseModalButton onClick={this.handleOnDelete} xmlns="http://www.w3.org/1999/xhtml" />
              </foreignObject>
            </g>
            <g transform={`translate(${this.halfwayPoint.x}, ${this.halfwayPoint.y + 10})`}>
              <foreignObject
                width="2rem"
                height="2rem"
                x="0"
                y="0"
                requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
              >
                <div xmlns="http://www.w3.org/1999/xhtml">
                  <button className="b-editswitch-button__img" onClick={this.openModal}>
                    <img src={pencilIcon} alt="Edit Switch Property" />
                  </button>
                  <Modal
                    className="bmrg--c-modal"
                    contentLabel="Modal"
                    documentRootTagId="app"
                    ariaHideApp={true}
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    overlayClassName="bmrg--c-modal-overlay"
                    shouldCloseOnOverlayClick={false}
                  >
                    <ModalFlow
                      theme="bmrg-flow"
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
                        setIsModalOpen={this.props.appActions.setIsModalOpen}
                      />
                    </ModalFlow>
                  </Modal>
                </div>
              </foreignObject>
            </g>
          </>
        )}
        {this.path.current && !this.props.diagramEngine.diagramModel.locked && (
          <g
            transform={`translate(${this.halfwayPoint.x + 20}, ${this.halfwayPoint.y + 25})`}
            style={{ cursor: "initial" }}
          >
            <text className="s-small-text">
              {this.props.model.switchCondition === null ? "default" : seperatedLinkState}
            </text>
          </g>
        )}
        {this.path.current && this.props.diagramEngine.diagramModel.locked && (
          <g transform={`translate(${this.halfwayPoint.x}, ${this.halfwayPoint.y})`} style={{ cursor: "initial" }}>
            <text className="small">{this.props.model.switchCondition === null ? "default" : seperatedLinkState}</text>
          </g>
        )}

        <path
          ref={this.path}
          style={linkStyle}
          strokeWidth={this.props.model.width}
          stroke="rgba(255,0,0,0.5)"
          d={this.props.path}
        />
        {this.path.current && this.props.model.targetPort && (
          <g fill="none" transform={`translate(${this.endPoint.x - 20}, ${this.endPoint.y - 10}) scale(.0375)`}>
            <svg
              version="1.1"
              id="Layer_1"
              width="460.5"
              height="531.74"
              viewBox="0 0 460.5 531.74"
              overflow="visible"
              enableBackground="new 0 0 460.5 531.74"
            >
              <polygon fill="#40d5bb" points="0.5,0.866 459.5,265.87 0.5,530.874" />
            </svg>
          </g>
        )}
      </svg>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(appActions, dispatch)
});

export default connect(
  null,
  mapDispatchToProps
)(SwitchLink);
