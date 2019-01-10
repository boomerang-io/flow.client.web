import React, { Component } from "react";
import CloseModalButton from "@boomerang/boomerang-components/lib/CloseModalButton";
import MultiStateButton from "./MultiStateButton";
import TriangleArrow from "./TriangleArrow";

/*
  -want to update this.props.model.linkState (default, success, failure)
  -onclick function

*/

class CustomLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      executionCondition: this.props.model.executionCondition,
      count: 0 //just set here one time
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

  updateExecutionState = executionCondition => {
    this.props.model.executionCondition = executionCondition;
  };

  render() {
    const { model } = this.props;
    let linkStyle = {};

    if (!model.sourcePort || !model.targetPort) {
      linkStyle = { opacity: "0.25" };
    }

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
                <MultiStateButton
                  onClick={this.updateExecutionState}
                  initialExecutionCondition={this.state.executionCondition}
                  modelId={this.props.model.id}
                />
              </foreignObject>
            </g>
          </>
        )}
        <path
          ref={ref => {
            this.path = ref;
          }}
          style={linkStyle}
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

export default CustomLink;
