import React, { Component } from "react";
import PropTypes from "prop-types";
import DayCheckbox from "./DayCheckbox";
import DAYS_OF_WEEK from "Constants/daysOfWeek";
import styles from "./daysCheckbox.module.scss";

class DaysCheckbox extends Component {
  state = {
    days: this.props.selectedDays
  };
  static propTypes = {
    handleCheckboxChange: PropTypes.func.isRequired,
    selectedDays: PropTypes.object
  };

  handleDaysChange = (value, id) => {
    this.setState(
      prevState => ({ days: { ...prevState.days, [id]: value } }),
      () => {
        this.props.handleCheckboxChange(this.state.days);
      }
    );
  };

  render() {
    return (
      <>
        <label htmlFor="days-checkbox" className="bx--label">
          On day(s)
        </label>
        <div id="days-checkbox" className={styles.container} data-testid="days-checkbox">
          {DAYS_OF_WEEK.map(day => (
            <DayCheckbox
              day={day}
              handleDaysChange={this.handleDaysChange}
              isChecked={this.state.days[day.value]}
              key={day.value}
            />
          ))}
        </div>
      </>
    );
  }
}

export default DaysCheckbox;
