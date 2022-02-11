import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import EditButton from "./EditButton";
import { isAccessibleKeyboardEvent } from "@boomerang-io/utils";
import styles from "./workflowEditButton.module.scss";

WorkflowEditButton.propTypes = {
  alt: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default function WorkflowEditButton({ alt = "Workflow edit button", className, onClick, ...rest }) {
  return (
    <EditButton
      alt={alt}
      className={cx(styles.editButton, className)}
      onClick={onClick}
      onKeyDown={(e) => isAccessibleKeyboardEvent(e) && onClick(e)}
      role="button"
      tabIndex="0"
      style={{ willChange: "auto" }}
      {...rest}
    />
  );
}
