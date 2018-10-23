import React, { Component } from "react";
import PropTypes from "prop-types";
//import CloseIcon from "./CloseIcon";
import { EXECUTION_CONDITIONS, EXECUTION_STATES } from "./constants";
// import FailureButton from "./FailureButton";
// import AlwaysButton from "./AlwaysButton";
// import SuccessButton from "./SuccessButton";
import "./styles.scss";

class MultiStateButton extends Component {
  static defaultProps = {
    fullscreen: false,
    initialExecutionCondition: PropTypes.oneOf([Object.values(EXECUTION_STATES)])
  };

  static propTypes = {
    className: PropTypes.string,
    passedOnClick: PropTypes.func
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
  };

  render() {
    const executionConditionConfig = EXECUTION_CONDITIONS[this.state.executionConditionIndex];
    return (
      <img
        src={executionConditionConfig.img}
        className="b-multistate-button__icon"
        alt={`${executionConditionConfig.condition} status`}
        onClick={this.handleOnClick}
      />
    );
  }
}

export default MultiStateButton;
