import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "@boomerang/boomerang-components/lib/Button";
import TextArea from "@boomerang/boomerang-components/lib/TextArea";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import "./styles.scss";

class Overview extends Component {
  state = {};

  handleOnChange = (value, errors, name) => {
    this.setState(
      () => {
        return {
          [name]: value
        };
      },
      () => {
        console.log(this.state);
      }
    );
  };
  render() {
    return (
      <div className="c-worklfow-overview">
        <div className="c-general-info">
          <h1 className="s-general-info-title">General</h1>
          <TextInput
            title="Name"
            placeholder="Name"
            name="name"
            theme="bmrg-white"
            handleChange={this.handleOnChange}
          />
          <TextInput
            title="Short description"
            placeholder="Short description"
            name="shortDescription"
            theme="bmrg-white"
            handleChange={this.handleOnChange}
          />
          <TextArea
            title="Description"
            placeholder="Description"
            name="description"
            theme="bmrg-white"
            handleChange={this.handleOnChange}
          />
        </div>
      </div>
    );
  }
}

Overview.propTypes = {};

export default Overview;
