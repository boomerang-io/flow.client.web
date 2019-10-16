import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as appActions } from "State/app";
import WorkFlowCloseButton from "Components/WorkflowCloseButton";
import WorkflowEditButton from "Components/WorkflowEditButton";
import { ModalFlow } from "@boomerang/carbon-addons-boomerang-react";
import ConfigureSwitchModal from "./ConfigureSwitchModal";
import styles from "./SwitchLink.module.scss";

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
            <g transform={`translate(${this.halfwayPoint.x - 12}, ${this.halfwayPoint.y - 12})`}>
              <foreignObject width="24" height="24" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                <div xmlns="http://www.w3.org/1999/xhtml">
                  <WorkFlowCloseButton onClick={this.handleOnDelete} />
                </div>
              </foreignObject>
            </g>
            <g transform={`translate(${this.halfwayPoint.x + 12}, ${this.halfwayPoint.y - 12})`}>
              <foreignObject width="32" height="32" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                <WorkflowEditButton onClick={this.openModal} xmlns="http://www.w3.org/1999/xhtml" />
                <ModalFlow
                  confirmModalProps={{
                    title: "Are you sure?",
                    children: "Your changes will not be saved"
                  }}
                  modalHeaderProps={{
                    title: "Switch",
                    subtitle: "Set it up the conditions"
                  }}
                  isOpen={this.state.modalIsOpen}
                  onCloseModal={() => {
                    this.setState({ modalIsOpen: false });
                  }}
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
              </foreignObject>
            </g>
          </>
        )}
        {this.path.current && !this.props.diagramEngine.diagramModel.locked && (
          <g
            transform={`translate(${this.halfwayPoint.x + 20}, ${this.halfwayPoint.y + 24})`}
            style={{ cursor: "initial" }}
          >
            <text className={styles.text}>
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
          className={styles.path}
          ref={this.path}
          style={linkStyle}
          strokeWidth={this.props.model.width}
          stroke="rgba(255,0,0,0.5)"
          d={this.props.path}
        />
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
