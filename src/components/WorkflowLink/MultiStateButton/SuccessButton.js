import React from "react";
import PropTypes from "prop-types";
const SuccessButton = ({ className, ...rest }) => {
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
      <circle
        fill="none"
        stroke="#4CC14B"
        stroke-width="9"
        stroke-miterlimit="10"
        cx="127.812"
        cy="128.577"
        r="112.188"
      />
      <path
        fill="#4CC14B"
        d="M105.266,172.238c-1.72,1.557-4.938,0.804-7.186-1.683l-24.481-27.07c-2.248-2.484-2.675-5.761-0.954-7.317
	l0,0c1.723-1.556,4.937-0.802,7.185,1.684l24.481,27.069C106.559,167.405,106.986,170.682,105.266,172.238L105.266,172.238z"
      />
      <path
        fill="#4CC14B"
        d="M99.828,171.965c-1.556-1.721-0.8-4.938,1.682-7.186l76.009-68.738c2.484-2.248,5.762-2.676,7.317-0.954l0,0
	c1.556,1.72,0.803,4.938-1.683,7.185l-76.009,68.739C104.66,173.258,101.385,173.686,99.828,171.965L99.828,171.965z"
      />
    </svg>
  );
};

export default SuccessButton;
