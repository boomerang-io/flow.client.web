import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Checkbox } from "carbon-components-react";
import styles from "./dayCheckbox.module.scss";

class DayCheckbox extends Component {
  static propTypes = {
    day: PropTypes.object.isRequired,
    isChecked: PropTypes.bool,
    handleDaysChange: PropTypes.func.isRequired
  };
  state = {
    checked: this.props.isChecked ? this.props.isChecked : false
  };
  handleCheck = (value, id) => {
    this.setState({ checked: !this.state.checked });
    this.props.handleDaysChange(value, id);
  };
  render() {
    const { day } = this.props;
    const { checked } = this.state;
    const wrapperClass = classnames(styles.container, { "--is-checkbox-true": checked });
    return (
      <Checkbox
        wrapperClassName={wrapperClass}
        checked={checked}
        labelText={day.label}
        onChange={this.handleCheck}
        key={day.value}
        id={day.value}
      />
    );
  }
}

export default DayCheckbox;
