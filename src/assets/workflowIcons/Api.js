import React from "react";
import PropTypes from "prop-types";

const Api = ({ className, ...rest }) => {
  return (
    <svg
      className={className}
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      aria-hidden="true"
      style={{ willChange: "transform" }}
      {...rest}
    >
      <path d="M26 22a3.86 3.86 0 0 0-2 .57l-3.09-3.1a6 6 0 0 0 0-6.94L24 9.43a3.86 3.86 0 0 0 2 .57 4 4 0 1 0-4-4 3.86 3.86 0 0 0 .57 2l-3.1 3.09a6 6 0 0 0-6.94 0L9.43 8A3.86 3.86 0 0 0 10 6a4 4 0 1 0-4 4 3.86 3.86 0 0 0 2-.57l3.09 3.1a6 6 0 0 0 0 6.94L8 22.57A3.86 3.86 0 0 0 6 22a4 4 0 1 0 4 4 3.86 3.86 0 0 0-.57-2l3.1-3.09a6 6 0 0 0 6.94 0l3.1 3.09a3.86 3.86 0 0 0-.57 2 4 4 0 1 0 4-4zm0-18a2 2 0 1 1-2 2 2 2 0 0 1 2-2zM4 6a2 2 0 1 1 2 2 2 2 0 0 1-2-2zm2 22a2 2 0 1 1 2-2 2 2 0 0 1-2 2zm10-8a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm10 8a2 2 0 1 1 2-2 2 2 0 0 1-2 2z"></path>
    </svg>
  );
};

Api.propTypes = {
  className: PropTypes.string
};

export default Api;
