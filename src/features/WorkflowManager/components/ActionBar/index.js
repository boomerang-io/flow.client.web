import React from "react";
import PropTypes from "prop-types";
import NavigateBack from "Components/NavigateBack";
import Button from "@boomerang/boomerang-components/lib/Button";
//import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import "./styles.scss";

ActionBar.propTypes = {
  actionButtonText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

function ActionBar({ onClick, actionButtonText }) {
  return (
    <div className="c-action-bar">
      <NavigateBack to="/viewer" text={"Back to Workflows"} />
      {
        //<TextInput theme="bmrg-blue" />
      }
      <Button theme="bmrg-black" onClick={onClick}>
        {actionButtonText}
      </Button>
    </div>
  );
}

export default ActionBar;
