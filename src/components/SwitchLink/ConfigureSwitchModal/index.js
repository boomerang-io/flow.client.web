import React from "react";
import PropTypes from "prop-types";
import ModalContentBody from "@boomerang/boomerang-components/lib/ModalContentBody";
import ModalContentFooter from "@boomerang/boomerang-components/lib/ModalContentFooter";
import ModalConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import Toggle from "@boomerang/boomerang-components/lib/Toggle";
import "./styles.scss";

ConfigureSwitchModal.propTypes = {
  defaultState: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  switchCondition: PropTypes.string.isRequired,
  updateDefaultState: PropTypes.func.isRequired,
  updateSwitchState: PropTypes.func.isRequired,
  validateSwitch: PropTypes.func.isRequired
};

function ConfigureSwitchModal({
  defaultState,
  onSubmit,
  switchCondition,
  updateDefaultState,
  updateSwitchState,
  validateSwitch
}) {
  return (
    <>
      <form onSubmit={onSubmit}>
        <ModalContentBody style={{ maxWidth: "25rem", margin: "0 auto", flexDirection: "column", overflow: "visible" }}>
          <div className="b-switch-config__desc">Default?</div>
          <div className="b-switch-config">
            <Toggle
              aria-labelledby="toggle-default"
              className="b-switch-config__toggle"
              name="default"
              checked={defaultState}
              onChange={updateDefaultState}
              theme="bmrg-white"
              red
            />
            <div className="b-switch-config__explanation">This path will be taken when no others are matched</div>
          </div>

          <div className="b-switch-customvalue">
            {!defaultState && (
              <TextInput
                alwaysShowTitle
                required
                value={switchCondition === null ? "" : switchCondition}
                title="Switch Property Value"
                placeholder="Enter a value"
                name="property"
                theme="bmrg-white"
                onChange={updateSwitchState}
                style={{ paddingBottom: "1rem" }}
                validationFunction={validateSwitch}
              />
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

export default ConfigureSwitchModal;
