import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import CloseIcon from "./CloseIcon";

const CONDITIONS = {
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
  ALWAYS: "ALWAYS"
};

const EXECUTE_CONDITIONS = [
  {
    text: "Run on success",
    img: "",
    style: { backgroundColor: "green" },
    condition: CONDITIONS.SUCCESS
  },
  {
    text: "Run on failure",
    img: "",
    style: { backgroundColor: "red" },
    condition: CONDITIONS.FAILURE
  },
  {
    text: "Always run",
    img: "",
    style: { backgroundColor: "gray" },
    condition: CONDITIONS.ALWAYS
  }
];

class MultiStateButton extends Component {
  state = { executeConditionIndex: 0 };

  handleOnClick = () => {
    this.setState(
      prevState => ({
        executeConditionIndex: (prevState.executeConditionIndex + 1) % EXECUTE_CONDITIONS.length
      }),
      () => {
        this.props.returnCurrentState(EXECUTE_CONDITIONS[this.state.executeConditionIndex]);
      }
    );
  };

  render() {
    const executeCondition = EXECUTE_CONDITIONS[this.state.executeConditionIndex];
    return (
      <div className="bmrg--b-multistate-button" onClick={this.handleOnClick}>
        <CloseIcon className={"bmrg--b-multistate-button__icon"} style={executeCondition.style} />
      </div>
    );
  }
}

MultiStateButton.defaultProps = {
  fullscreen: false
  //style: {}
};

MultiStateButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func
  //style: PropTypes.object
};

export default MultiStateButton;
