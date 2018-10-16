import React from "react";
import PropTypes from "prop-types";
import Button from "@boomerang/boomerang-components/lib/Button";
import "./styles.scss";

ActionBar.propTypes = {
  onSave: PropTypes.func.isRequired
};

function ActionBar({ onSave }) {
  return (
    <div className="c-action-bar">
      <Button theme="bmrg-black" onClick="onSave">
        Save
      </Button>
    </div>
  );
}

export default ActionBar;
