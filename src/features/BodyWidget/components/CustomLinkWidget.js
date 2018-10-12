import React from "react";
import CloseModalButton from "@boomerang/boomerang-components/lib/CloseModalButton";

class CustomLinkWidget extends React.Component {
  constructor(props) {
    super(props);
    this.percent = 0;
  }

  handleOnDelete = model => {
    model.remove();
    this.setState({});
  };

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    let halfwayPoint;
    let endPoint;
    if (this.path) {
      halfwayPoint = this.path.getPointAtLength(this.path.getTotalLength() * 0.5);
      endPoint = this.path.getPointAtLength(this.path.getTotalLength());
    }
    return (
      <>
        {this.path && (
          <g transform={`translate(${halfwayPoint.x}, ${halfwayPoint.y + 5})`}>
            <CloseModalButton className="bmrg-deleteLink" onClick={() => this.handleOnDelete(this.props.model)} />
          </g>
        )}
        <path
          ref={ref => {
            this.path = ref;
          }}
          strokeWidth={this.props.model.width}
          stroke="rgba(255,0,0,0.5)"
          d={this.props.path}
        />
        {this.path && (
          <g fill="none" transform={`translate(${endPoint.x - 16}, ${endPoint.y - 9}) scale(1.5)`}>
            <svg width="8" height="12" xmlns="http://www.w3.org/2000/svg" fill="#40D5BB">
              <g fill="40D5BB">
                <path fill="#40D5BB" d="M.571 2.546V0L7.43 6 .57 12V9.454L4.52 6z" />
              </g>
            </svg>
          </g>
        )}
      </>
    );
  }
}

export default CustomLinkWidget;
