import React, { Component } from "react";
import PropTypes from "prop-types";
import ToolTip from "@boomerang/boomerang-components/lib/Tooltip";
import { EXECUTION_CONDITIONS, EXECUTION_STATES } from "./constants";
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
    const { modelId } = this.props;
    return (
      <div xmlns={this.props.xmlns}>
        <img
          src={executionConditionConfig.img}
          className="b-multistate-button"
          alt={`${executionConditionConfig.condition} status`}
          onClick={this.handleOnClick}
          data-tip
          data-for={modelId}
        />
        <ToolTip className="bmrg--b-tooltip b-multistate-button__tooltip" place="bottom" id={modelId}>
          {executionConditionConfig.text}
        </ToolTip>
      </div>
    );
  }
}

export default MultiStateButton;
