import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import TextArea from "@boomerang/boomerang-components/lib/TextArea";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import assets from "./assets";
import "./styles.scss";

class Overview extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired
  };

  static defaultProps = {
    workflow: {}
  };

  constructor(props) {
    super(props);
    this.state = props.workflow.data;
  }

  handleOnChange = (value, errors, name) => {
    this.setState(
      () => ({
        [name]: value
      }),
      () => this.props.handleOnChange(this.state)
    );
  };

  render() {
    return (
      <div className="c-worklfow-overview">
        <div className="c-general-info">
          <h1 className="s-general-info-title">General</h1>
          <TextInput
            value={this.state.name || ""}
            title="Name"
            placeholder="Name"
            name="name"
            theme="bmrg-white"
            onChange={this.handleOnChange}
            noValueText="Enter a name"
          />
          <TextInput
            value={this.state.shortDescription || ""}
            title="Summary"
            placeholder="Summary"
            name="shortDescription"
            theme="bmrg-white"
            onChange={this.handleOnChange}
          />
          <TextArea
            detail={this.state.description || ""}
            title="Description"
            placeholder="Description"
            name="description"
            theme="bmrg-white"
            handleChange={this.handleOnChange}
          />
          <h2 className="s-workflow-icons-title">Icon</h2>
          <div className="b-workflow-icons">
            {assets.map(image => (
              <img
                className={classnames("b-workflow-icons__icon", {
                  "--active": this.state.icon === image.name
                })}
                src={image.src}
                onClick={() => this.handleOnChange(image.name, {}, "icon")}
                alt={`${image.name} icon`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

Overview.propTypes = {
  handleOnChange: PropTypes.func.isRequired
};

export default Overview;
