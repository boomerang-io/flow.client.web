import * as React from "react";

import downloadIMG from "../../../img/install.svg";
import emailIMG from "../../../img/email_icon.svg";

/*export interface TrayItemWidgetProps {
	model: any;
	color?: string;
	name: string;
}

export interface TrayItemWidgetState {}*/

export class TrayItemWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let img_to_render;
    if (this.props.name === "file_download") {
      img_to_render = downloadIMG;
    } else {
      img_to_render = emailIMG;
    }

    return (
      <div
        //style={{ borderColor: this.props.color }}
        draggable={true}
        onDragStart={event => {
          event.dataTransfer.setData("storm-diagram-node", JSON.stringify(this.props.model));
        }}
        className="tray-item"
      >
        <div className="tray-item-img">
          <img src={img_to_render} />{" "}
        </div>

        <div className="tray-item_name"> {this.props.name} </div>
      </div>
    );
  }
}
