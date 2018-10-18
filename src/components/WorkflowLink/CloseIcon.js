import React from "react";
import PropTypes from "prop-types";

const CloseIcon = ({ className, color, ...rest }) => {
  return (
    <svg
      className={className}
      width="13px"
      height="14px"
      viewBox="0 0 13 14"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g id="13-Report-a-bug" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="13.20-describe-empty" transform="translate(-1159.000000, -152.000000)" fill="#1D364D">
          <g id="x" transform="translate(1147.000000, 140.000000)" />
        </g>
      </g>
    </svg>
  );
};

CloseIcon.propTypes = {
  className: PropTypes.string
};

export default CloseIcon;
