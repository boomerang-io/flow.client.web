import React from "react";
import PropTypes from "prop-types";

const Data = ({ className, ...rest }) => {
  return (
    <svg className={className} focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" style={{willChange: "transform"}} {...rest}><rect width="11" height="2" x="4" y="6"></rect><rect width="10" height="2" x="18" y="6"></rect><rect width="7" height="2" x="21" y="12"></rect><rect width="7" height="2" x="11" y="12"></rect><rect width="4" height="2" x="4" y="12"></rect><rect width="24" height="2" x="4" y="18"></rect><rect width="17" height="2" x="4" y="24"></rect><rect width="4" height="2" x="24" y="24"></rect><title>Data 2</title></svg>
  );
};

Data.propTypes = {
  className: PropTypes.string
};

export default Data;
