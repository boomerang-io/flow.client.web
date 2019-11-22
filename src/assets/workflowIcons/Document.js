import React from "react";
import PropTypes from "prop-types";

const Document = ({ className, ...rest }) => {
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
      <path d="M27.435 14.699l-6.058-6.121A1.949 1.949 0 0 0 19.998 8H12a2.002 2.002 0 0 0-2 2v19a2.002 2.002 0 0 0 2 2h14a2.002 2.002 0 0 0 2-2V16.077a1.976 1.976 0 0 0-.565-1.378zM20 10.03L25.924 16H20zM12 29V10h6v6a2.002 2.002 0 0 0 2 2h6l.001 11z" />
      <path d="M6 18H4V4a2.002 2.002 0 0 1 2-2h14v2H6z" />
    </svg>
  );
};

Document.propTypes = {
  className: PropTypes.string
};

export default Document;
