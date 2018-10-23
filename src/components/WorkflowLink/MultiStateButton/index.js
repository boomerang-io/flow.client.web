import React, { Component } from "react";
import PropTypes from "prop-types";
//import CloseIcon from "./CloseIcon";
import { EXECUTION_CONDITIONS, EXECUTION_STATES } from "../constants";
import grayCircle from "../../../assets/svg/gray-circle.svg";
import redDelete from "../../../assets/svg/red-delete.svg";
import greenCheck from "../../../assets/svg/red-delete.svg";
import FailureButton from "./FailureButton";
import AlwaysButton from "./AlwaysButton";
import SuccessButton from "./SuccessButton";

class MultiStateButton extends Component {
  static defaultProps = {
    fullscreen: false,
    initialExecutionCondition: PropTypes.oneOf([Object.values(EXECUTION_STATES)])
  };

  static propTypes = {
    className: PropTypes.string,
    passedOnClick: PropTypes.func,
    EXECUTE_CONDITIONS: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      executionConditionIndex: EXECUTION_CONDITIONS.findIndex(
        executionCondition => executionCondition.condition === props.initialExecutionCondition
      )
    };
  }

  handleOnClick = () => {
    this.setState(
      prevState => ({
        executionConditionIndex: (prevState.executionConditionIndex + 1) % EXECUTION_CONDITIONS.length
      }),
      () => {
        this.props.onClick(EXECUTION_CONDITIONS[this.state.executionConditionIndex].condition);
      }
    );
    this.forceUpdate();
  };

  render() {
    const executionConditionConfig = EXECUTION_CONDITIONS[this.state.executionConditionIndex];
    console.log(executionConditionConfig.img);
    return (
      <div className="bmrg--b-multistate-button" onClick={this.handleOnClick}>
        {executionConditionConfig.img === "always" ? (
          <AlwaysButton className="bmrg--b-multistate-button--always" />
        ) : executionConditionConfig.img === "failure" ? (
          <FailureButton className="bmrg--b-multistate-button--failure" />
        ) : (
          <SuccessButton className="bmrg--b-multistate-button--success" />
        )}
      </div>
    );
  }
}

export default MultiStateButton;
