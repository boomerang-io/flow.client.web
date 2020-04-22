import React from "react";

const SvgComponent = (props) => (
  <svg viewBox="0 0 42 42" {...props}>
    <title>{"warning"}</title>
    <g id="Symbols" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <g id="Editor-/-task-card">
        <g id="edit">
          <circle id="Oval" stroke="#0072C3" fill="#F9C100" cx={20} cy={20} r={20} />
          <g id="Actions-/-Formatting-/-edit-/-24" fill="#000000" transform="translate(6, 3) scale(.9)">
            <path d="M16,22a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,16,22Z"></path>
            <rect width="2" height="9" x="15" y="11"></rect>
            <path d="M29,29H3a1,1,0,0,1-.89-1.46l13-25a1,1,0,0,1,1.78,0l13,25A1,1,0,0,1,29,29ZM4.65,27h22.7L16,5.17Z"></path>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export default SvgComponent;
