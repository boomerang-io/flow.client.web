import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import WorkFlowCloseButton from "Components/WorkflowCloseButton";
import ExecutionConditionSwitcher from "./ExecutionConditionSwitcher";
import { CheckmarkOutline16, CloseOutline16, ArrowRight16 } from "@carbon/icons-react";
import styles from "./TaskLink.module.scss";

export const EXECUTION_STATES = {
  SUCCESS: "success",
  FAILURE: "failure",
  ALWAYS: "always"
};

export const EXECUTION_CONDITIONS = [
  {
    Icon: CheckmarkOutline16,
    name: EXECUTION_STATES.SUCCESS
  },
  {
    Icon: CloseOutline16,
    name: EXECUTION_STATES.FAILURE
  },
  {
    Icon: ArrowRight16,
    name: EXECUTION_STATES.ALWAYS
  }
];

class TaskLink extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    diagramEngine: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      executionConditionIndex: EXECUTION_CONDITIONS.findIndex(
        executionCondition => executionCondition.name === props.model.executionCondition
      )
    };

    this.halfwayPoint = "";
    this.endPoint = "";
    this.path = React.createRef();
  }

  componentDidMount() {
    this.props.diagramEngine.repaintCanvas();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleOnDelete = () => {
    this.props.model.remove();
    this.props.diagramEngine.repaintCanvas();
  };

  updateExecutionState = () => {
    const executionConditionIndex = (this.state.executionConditionIndex + 1) % EXECUTION_CONDITIONS.length;
    const executionCondition = EXECUTION_CONDITIONS[executionConditionIndex];
    this.props.model.executionCondition = executionCondition.name;
    this.setState({
      executionConditionIndex
    });
  };

  determineAngleBetweenPorts(cx, cy, ex, ey) {
    const { model } = this.props;
    const { x: targetX, y: targetY } = model.targetPort;
    const { x: sourceX, y: sourceY } = model.sourcePort;
    var dy = targetY - sourceY;
    var dx = targetX - sourceX;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
  }

  render() {
    const { model } = this.props;

    // let xAdjustment = 0;
    // let yAdjustment = 0;
    let linkStyle = {};

    // if (model.sourcePort && model.targetPort) {
    //   const angle = this.determineAngleBetweenPorts();

    //   xAdjustment = (90 - angle) / 90;
    //   yAdjustment = angle / 90;
    // }

    if (!model.sourcePort || !model.targetPort) {
      linkStyle = { opacity: "0.25" };
    }

    if (this.path.current) {
      this.halfwayPoint = this.path.current.getPointAtLength(this.path.current.getTotalLength() * 0.5);
      this.endPoint = this.path.current.getPointAtLength(this.path.current.getTotalLength());
    }

    const isModelLocked = this.props.diagramEngine.diagramModel.locked;

    return (
      <svg>
        {this.path.current && this.props.model.targetPort && (
          <>
            {!isModelLocked && (
              <g
                transform={`translate(${this.halfwayPoint.x - 12}, ${this.halfwayPoint.y - 12})`}
                xmlns="http://www.w3.org/2000/svg"
              >
                <foreignObject
                  width="24"
                  height="24"
                  requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                >
                  <WorkFlowCloseButton onClick={this.handleOnDelete} xmlns="http://www.w3.org/1999/xhtml" />
                </foreignObject>
              </g>
            )}
            <g
              transform={`translate(${this.halfwayPoint.x + (isModelLocked ? -12 : 12)}, ${this.halfwayPoint.y - 12})`}
              xmlns="http://www.w3.org/2000/svg"
            >
              <foreignObject width="24" height="24" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                <ExecutionConditionSwitcher
                  disabled={isModelLocked}
                  executionCondition={EXECUTION_CONDITIONS[this.state.executionConditionIndex]}
                  onClick={this.updateExecutionState}
                />
              </foreignObject>
            </g>
          </>
        )}
        <path
          className={cx(styles.path, { [styles.locked]: isModelLocked })}
          ref={this.path}
          style={linkStyle}
          strokeWidth={this.props.model.width}
          stroke="rgba(255,0,0,0.5)"
          d={this.props.path}
        />
        )}
      </svg>
    );
  }
}

export default TaskLink;
