import * as React from "react";
import Sidenav from "@boomerang/boomerang-components/lib/Sidenav";

/*export interface TrayWidgetProps {}

export interface TrayWidgetState {}*/

/**
 * @author Dylan Vorster
 */
export class TrayWidget extends React.Component {
  //public static defaultProps: TrayWidgetProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    //return <div className="tray">{this.props.children}</div>;
    return <Sidenav theme={"bmrg-white"} content={() => this.props.children} />;
  }
}
