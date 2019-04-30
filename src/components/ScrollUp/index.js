import React from "react";
import ScrollUpButton from "react-scroll-up-button";
import doubleChevron from "./doublechevron.svg";
import "./styles.scss";

const ScrollUp = () => {
  return (
    <ScrollUpButton ContainerClassName="c-activities__scroll-up" TransitionClassName="--scroll-up-togled">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img className="b-activities__scroll-button" src={doubleChevron} alt="chevron" />
        <div className="b-activities__scroll-label">Go to top</div>
      </div>
    </ScrollUpButton>
  );
};

export default ScrollUp;
