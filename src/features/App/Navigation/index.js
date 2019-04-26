import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import Sidenav from "@boomerang/boomerang-components/lib/Sidenav";
import Navbar from "./Navbar";
import { navItems } from "./config";
import "./styles.scss";

class Navigation extends Component {
  state = {
    sideNavIsOpen: false,
    showFirstTimeExperience: false
  };

  handleOnQuestionClick = () => {
    this.setState({
      showFirstTimeExperience: true
    });
  };

  sidenavRef = React.createRef();

  handleOnIconClick = () => {
    this.setState(prevState => ({
      sideNavIsOpen: !prevState.sideNavIsOpen
    }));
  };

  handleSetSidenavClose = () => {
    this.setState(() => ({
      sideNavIsOpen: false
    }));
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (this.sidenavRef && !this.sidenavRef.current.contains(event.target)) {
      this.handleSetSidenavClose();
    }
  };

  render() {
    const { navigation, user } = this.props;
    return (
      <>
        <Navbar navigation={navigation} user={user} handleOnTutorialClick={this.handleOnQuestionClick} />
        <div className="s-sidenav-wrapper" ref={this.sidenavRef}>
          <div
            className={classnames("s-hamburger-menu", { "--is-open": this.state.sideNavIsOpen })}
            onClick={this.handleOnIconClick}
          >
            <svg height="32" id="Layer_1" version="1.1" viewBox="0 0 36 36" width="32">
              <g className="icon">
                <rect className="bar1" x="0" y="0" width="32" height="4" rx="2" fill="#40d5bb" />
                <rect className="bar2" x="0" y="12" width="32" height="4" rx="2" fill="#40d5bb" />
                <rect className="bar3" x="0" y="24" width="32" height="4" rx="2" fill="#40d5bb" />
              </g>
            </svg>
          </div>
          <div onClick={this.handleSetSidenavClose}>
            <Sidenav theme="bmrg-white" hidden={!this.state.sideNavIsOpen} navItems={navItems(this.props.location)} />
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Navigation);
