import React, { Component } from "react";
import PropTypes from "prop-types";
import { Select, SelectItem } from "carbon-components-react";
import "./styles.scss";

class SimpleSelectFilter extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    selectedOption: PropTypes.object
  };

  render() {
    return (
      <div className="c-simple-select-filter">
        <Select
          hideLabel={true}
          invalid={false}
          onChange={this.props.onChange}
          defaultValue={this.props.selectedOption.value}
        >
          {this.props.options.map(option => (
            <SelectItem value={option.value} text={option.label} key={option.value} />
          ))}
        </Select>
      </div>
    );
  }
}

export default SimpleSelectFilter;
