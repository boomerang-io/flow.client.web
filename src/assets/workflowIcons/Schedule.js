import React from "react";
import PropTypes from "prop-types";

const Schedule = ({ className, ...rest }) => {
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
      <path d="M21 30a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm0-14a6 6 0 1 0 6 6 6 6 0 0 0-6-6z" />
      <path d="M22.59 25L20 22.41V18h2v3.59l2 2L22.59 25z" />
      <path d="M28 6a2 2 0 0 0-2-2h-4V2h-2v2h-8V2h-2v2H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h4v-2H6V6h4v2h2V6h8v2h2V6h4v6h2z" />
    </svg>
  );
};

Schedule.propTypes = {
  className: PropTypes.string
};

export default Schedule;
