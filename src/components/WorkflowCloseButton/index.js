import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import CloseButton from "./CloseButton";
import isAccessibleEvent from "@boomerang/boomerang-utilities/lib/isAccessibleEvent";
import styles from "./WorkflowCloseButton.module.scss";

WorkflowCloseButton.propTypes = {
  alt: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired
};

export default function WorkflowCloseButton({ alt = "Workflow close button", className, onClick, ...rest }) {
  return (
    <CloseButton
      alt={alt}
      className={cx(styles.button, className)}
      onClick={onClick}
      onKeyDown={e => isAccessibleEvent(e) && onClick(e)}
      role="button"
      tabIndex={0}
      {...rest}
    />
  );
}
