import React from "react";
import PropTypes from "prop-types";
import SidenavComponent from "@boomerang/boomerang-components/lib/Sidenav";
import enhanceWithClickOutside from "react-click-outside";
import "./styles.scss";

class Sidenav extends React.Component {
  static propTypes = {
    setSidenavClose: PropTypes.func.isRequired
  };

  handleClickOutside() {
    this.props.setSidenavClose();
  }

  render() {
    return (
      <div className="s-sidenav-wrapper">
        <SidenavComponent {...this.props} />
      </div>
    );
  }
}

export default enhanceWithClickOutside(Sidenav);
