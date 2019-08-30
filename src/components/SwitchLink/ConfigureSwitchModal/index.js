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
    const { defaultState, updateDefaultState } = this.props;

    const { switchCondition } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <ModalContentBody style={{ maxWidth: "25rem", margin: "0 auto", flexDirection: "column", overflow: "visible" }}>
          <div className="b-switch-config__desc">Default?</div>
          <div className="b-switch-config">
            <div className="b-switch-config__toggle">
              <Toggle
                aria-labelledby="toggle-default"
                id="default"
                name="default"
                toggled={defaultState}
                onToggle={updateDefaultState}
              />
            </div>
            <div className="b-switch-config__explanation">This path will be taken when no others are matched line.</div>
          </div>

          <div className="b-switch-customvalue">
            {!defaultState && (
              <div>
                <TextArea
                  id="property"
                  invalid={switchCondition === undefined || switchCondition === "" || switchCondition === " "}
                  labelText="Switch Property Value"
                  name="property"
                  placeholder="Enter a value"
                  onChange={e => this.setState({ switchCondition: e.target.value })}
                  style={{ resize: "none" }}
                  value={switchCondition === null ? "" : switchCondition}
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
          <ModalConfirmButton text="SAVE" theme="bmrg-flow" type="submit" />
        </ModalContentFooter>
      </form>
    );
  }
}

export default ConfigureSwitchModal;
