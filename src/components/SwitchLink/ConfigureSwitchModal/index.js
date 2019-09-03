import React from "react";
import PropTypes from "prop-types";
import ModalContentBody from "@boomerang/boomerang-components/lib/ModalContentBody";
import ModalContentFooter from "@boomerang/boomerang-components/lib/ModalContentFooter";
import ModalConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import { TextArea, Toggle } from "@boomerang/carbon-addons-boomerang-react";
// import TextArea from "@boomerang/boomerang-components/lib/TextArea";
// import Toggle from "@boomerang/boomerang-components/lib/Toggle";
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
      switchCondition: props.switchCondition || ""
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
    const { defaultState, updateDefaultState } = this.props;

    const { switchCondition } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <ModalContentBody
          style={{ maxWidth: "25rem", height: "24rem", margin: "0 auto", display: "block", overflow: "visible" }}
        >
          <Toggle
            aria-labelledby="toggle-default"
            id="default"
            name="default"
            orientation="vertical"
            toggled={defaultState}
            labelText="Default?"
            helperText="This path will be taken when no others are matched line."
            onToggle={updateDefaultState}
          />

          <div className="b-switch-customvalue">
            {!defaultState && (
              <div>
                <TextArea
                  id="property"
                  invalid={!switchCondition}
                  invalidText="Value is required"
                  labelText="Switch Property Value"
                  name="property"
                  placeholder="Enter a value"
                  onChange={e => this.setState({ switchCondition: e.target.value })}
                  style={{ resize: "none" }}
                  value={switchCondition}
                />
                <div className="s-switch-customvalue-desc">
                  Enter the value(s) to match to take this arrow. Multiple values can be entered, one per line. Only one
                  must match for this connection to be valid
                </div>
                <div className="s-switch-customvalue-wildcard">* can be used as a wildcard</div>
              </div>
            )}
          </div>
        </ModalContentBody>
        <ModalContentFooter>
          <ModalConfirmButton
            disabled={!defaultState && !switchCondition}
            text="SAVE"
            theme="bmrg-flow"
            type="submit"
          />
        </ModalContentFooter>
      </form>
    );
  }
}

export default ConfigureSwitchModal;
