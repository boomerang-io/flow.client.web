import React from "react";
import PropTypes from "prop-types";
import NavigateBack from "Components/NavigateBack";
import Button from "@boomerang/boomerang-components/lib/Button";
//import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import "./styles.scss";

ActionBar.propTypes = {
  onSave: PropTypes.func.isRequired
};

function ActionBar({ onSave }) {
  return (
    <div className="c-action-bar">
      <NavigateBack to="/viewer" text={"Back to Workflows"} />
      {
        //<TextInput theme="bmrg-blue" />
      }
      <Button theme="bmrg-black" onClick={onSave}>
        Save
      </Button>
    </div>
  );
}

export default ActionBar;
