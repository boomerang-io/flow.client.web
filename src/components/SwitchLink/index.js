import React, { Component } from "react";
import CloseModalButton from "@boomerang/boomerang-components/lib/CloseModalButton";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import EditSwitchButton from "./EditSwitchButton";
import TriangleArrow from "./TriangleArrow";

/*
  -want to update this.props.model.linkState (default, success, failure)
  -onclick function

*/

class SwitchLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchCondition: props.model.switchCondition
    };

    this.halfwayPoint = "";
    this.endPoint = "";
  }

  componentDidMount() {
    this.props.diagramEngine.repaintCanvas();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleOnDelete = () => {
    this.props.model.remove();
    this.props.diagramEngine.repaintCanvas();
  };

  updateSwitchState = switchCondition => {
    this.props.model.switchCondition = switchCondition;
  };

  render() {
    console.log(this.state);
    if (this.path) {
      this.halfwayPoint = this.path.getPointAtLength(this.path.getTotalLength() * 0.5);
      this.endPoint = this.path.getPointAtLength(this.path.getTotalLength());
    }
    return (
      <>
        {this.path && !this.props.diagramEngine.diagramModel.locked && (
          <>
            <g transform={`translate(${this.halfwayPoint.x}, ${this.halfwayPoint.y - 20}) scale(0.7)`}>
              <foreignObject>
                <CloseModalButton onClick={this.handleOnDelete} />
              </foreignObject>
            </g>
            <g transform={`translate(${this.halfwayPoint.x - 17}, ${this.halfwayPoint.y + 2})`}>
              <foreignObject>
                <EditSwitchButton
                  onClick={this.updateswitchState}
                  initialSwitchCondition={this.state.switchCondition}
                />
              </foreignObject>
            </g>
            <g transform={`translate(${this.halfwayPoint.x - 10}, ${this.halfwayPoint.y + 8})`}>
              <text x="55" y="55" class="small">
                {this.state.switchCondition}
              </text>
            </g>
          </>
        )}
        <path
          ref={ref => {
            this.path = ref;
          }}
          strokeWidth={this.props.model.width}
          stroke="rgba(255,0,0,0.5)"
          d={this.props.path}
        />
        {this.path && this.props.model.targetPort && (
          <g fill="none" transform={`translate(${this.endPoint.x - 19}, ${this.endPoint.y - 10}) scale(.0375)`}>
            <TriangleArrow />
          </g>
        )}
      </>
    );
  }
}

export default SwitchLink;
