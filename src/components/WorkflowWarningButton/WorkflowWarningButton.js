import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import EditButton from "./WarningButton";
import { isAccessibleEvent } from "@boomerang-io/utils";
import styles from "./WorkflowWarningButton.module.scss";

WorkflowWarningButton.propTypes = {
  alt: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default function WorkflowWarningButton({ alt = "Workflow warning button", className, onClick, ...rest }) {
  return (
    <EditButton
      alt={alt}
      className={cx(styles.button, className)}
      onClick={onClick}
      onKeyDown={(e) => isAccessibleEvent(e) && onClick(e)}
      role="button"
      tabIndex="0"
      style={{ willChange: "auto" }}
      {...rest}
    />
  );
}
