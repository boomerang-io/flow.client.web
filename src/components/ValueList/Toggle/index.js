import React from "react";
import PropTypes from "prop-types";
import { default as BmrgToggle } from "@boomerang/boomerang-components/lib/Toggle";

const Toggle = ({ defaultChecked, description, label, name, onChange }) => {
  return (
    <div className="b-settings-toggle">
      <BmrgToggle red onChange={onChange} name={name} defaultChecked={defaultChecked} />
      <div className="b-setting-toggle__info">
        <label className="b-settings-toggle__label">{label}</label>
        <label className="b-settings-toggle__description">{description}</label>
      </div>
    </div>
  );
};

Toggle.propTypes = {
  defaultChecked: PropTypes.bool,
  description: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Toggle;
