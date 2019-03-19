import React from "react";
import PropTypes from "prop-types";
import {
  ModalContentBody,
  ModalContentFooter,
  ModalConfirmButton,
  TextArea,
  Toggle
} from "@boomerang/boomerang-components";
import "./styles.scss";

class ConfigureSwitchModal extends React.Component {
  static propTypes = {
    defaultState: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    switchCondition: PropTypes.string,
    updateDefaultState: PropTypes.func.isRequired,
    updateSwitchState: PropTypes.func.isRequired,
    validateSwitch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      switchCondition: props.switchCondition
    };
  }

  componentDidMount() {
    this.props.setIsModalOpen({ isModalOpen: true });
  }

  componentWillUnmount() {
    this.props.setIsModalOpen({ isModalOpen: false });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.updateSwitchState(this.state.switchCondition, this.props.onSubmit);
  };

  render() {
    const { defaultState, updateDefaultState, validateSwitch } = this.props;
    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <ModalContentBody
            style={{ maxWidth: "25rem", margin: "0 auto", flexDirection: "column", overflow: "visible" }}
          >
            <div className="b-switch-config__desc">Default?</div>
            <div className="b-switch-config">
              <Toggle
                aria-labelledby="toggle-default"
                className="b-switch-config__toggle"
                id="default"
                name="default"
                checked={defaultState}
                onChange={updateDefaultState}
                theme="bmrg-white"
              />
              <div className="b-switch-config__explanation">
                This path will be taken when no others are matched line.
              </div>
            </div>

            <div className="b-switch-customvalue">
              {!defaultState && (
                <div>
                  <TextArea
                    alwaysShowTitle
                    required
                    value={this.state.switchCondition === null ? "" : this.state.switchCondition}
                    title="Switch Property Value"
                    placeholder="Enter a value"
                    name="property"
                    theme="bmrg-white"
                    handleChange={value => this.setState({ switchCondition: value })}
                    style={{ paddingBottom: "1rem" }}
                    validationFunction={validateSwitch}
                  />
                  <div className="s-switch-customvalue-desc">
                    Enter the value(s) to match to take this arrow. Multiple values can be entered, one per line. Only
                    one must match for this connection to be valid
                  </div>
                  <div className="s-switch-customvalue-wildcard">* can be used as a wildcard</div>
                </div>
              )}
            </div>
          </ModalContentBody>
          <ModalContentFooter>
            <ModalConfirmButton text="SAVE" theme="bmrg-white" type="submit" />
          </ModalContentFooter>
        </form>
      </>
    );
  }
}

export default ConfigureSwitchModal;
