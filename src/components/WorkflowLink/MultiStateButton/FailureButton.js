import React from "react";
import PropTypes from "prop-types";
const FailureButton = ({ className, ...rest }) => {
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
      <g>
        <title>Layer 1</title>
        <path
          transform="rotate(45 251.736 251.24)"
          fill="none"
          fill-rule="evenodd"
          stroke="#bf0000"
          stroke-width="1"
          id="path566"
          d="m481.326996,251.240005a229.591003,226.615005 0 1 0 -459.182396,0a229.591003,226.615005 0 1 0 459.182396,0l-229.591003,0l229.591003,0z"
        />
        <path
          fill="none"
          fill-rule="evenodd"
          stroke="#bf0000"
          stroke-width="1"
          id="path567"
          d="m106.200783,98.059654l292.310997,307.074501"
        />
      </g>
    </svg>
  );
};

export default FailureButton;
