import React, { Component } from "react";
import PropTypes from "prop-types";
import CloseIcon from "./CloseIcon";
import { EXECUTION_CONDITIONS, EXECUTION_STATES } from "../constants";

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
  };

  render() {
    const executionConditionConfig = EXECUTION_CONDITIONS[this.state.executionConditionIndex];
    return (
      <div className="bmrg--b-multistate-button" onClick={this.handleOnClick}>
        <CloseIcon className={"bmrg--b-multistate-button__icon"} style={executionConditionConfig.style} />
      </div>
    );
  }
}

export default MultiStateButton;
