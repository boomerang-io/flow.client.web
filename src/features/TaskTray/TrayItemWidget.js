import * as React from "react";

import downloadIMG from "../../img/install.svg";
import emailIMG from "../../img/email_icon.svg";
import documentIMG from "../../img/document_16.svg";

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
    if (this.props.name === "Download File") {
      img_to_render = downloadIMG;
    } else if (this.props.name === "Send Mail") {
      img_to_render = emailIMG;
    } else if (this.props.name === "Ingest CSV") {
      img_to_render = downloadIMG;
    } else {
      img_to_render = emailIMG;
    }

    return (
      <div
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
