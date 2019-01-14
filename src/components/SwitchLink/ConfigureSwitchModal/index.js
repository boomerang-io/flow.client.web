import React from "react";
import PropTypes from "prop-types";
import ModalContentBody from "@boomerang/boomerang-components/lib/ModalContentBody";
import ModalContentFooter from "@boomerang/boomerang-components/lib/ModalContentFooter";
import ModalConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import Toggle from "@boomerang/boomerang-components/lib/Toggle";
import "./styles.scss";

ConfigureSwitchModal.propTypes = {
  defaultState: PropTypes.string.isRequired,
  handleSave: PropTypes.func.isRequired,
  switchCondition: PropTypes.string.isRequired,
  updateDefaultState: PropTypes.func.isRequired,
  updateSwitchState: PropTypes.func.isRequired
};

function ConfigureSwitchModal({ defaultState, onSubmit, switchCondition, updateDefaultState, updateSwitchState }) {
  return (
    <>
      <form onSubmit={onSubmit}>
        <ModalContentBody style={{ maxWidth: "25rem", margin: "0 auto", flexDirection: "column", overflow: "visible" }}>
          <div className="b-switch-config">
            <div className="b-switch-config__desc">Default?</div>
            <Toggle
              aria-labelledby="toggle-default"
              className="b-switch-config__toggle"
              name="default"
              checked={defaultState}
              onChange={updateDefaultState}
              theme="bmrg-white"
              red
            />
            <div className="b-switch-config__explanation">
              When this switch is on, this connection will be taken only when no others are matched.
            </div>
          </div>

          {!defaultState && (
            <TextInput
              alwaysShowTitle
              required
              value={switchCondition}
              title="Switch Property Value"
              placeholder="Enter a value"
              name="property"
              theme="bmrg-white"
              onChange={updateSwitchState}
              style={{ paddingBottom: "1rem" }}
            />
          )}
        </ModalContentBody>
        <ModalContentFooter>
          <ModalConfirmButton text="SAVE" theme="bmrg-white" type="submit" />
        </ModalContentFooter>
      </form>
    </>
  );
}

export default ConfigureSwitchModal;
