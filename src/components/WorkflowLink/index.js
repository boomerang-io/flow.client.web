import React, { Component } from "react";
import CloseModalButton from "@boomerang/boomerang-components/lib/CloseModalButton";
import MultiStateButton from "./MultiStateButton";

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
    console.log(this.props.diagramEngine.diagramModel.locked);
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
    if (this.path) {
      this.halfwayPoint = this.path.getPointAtLength(this.path.getTotalLength() * 0.5);
      this.endPoint = this.path.getPointAtLength(this.path.getTotalLength());
    }
    return (
      <>
        {this.path &&
          !this.props.diagramEngine.diagramModel.locked && (
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
          strokeWidth={this.props.model.width}
          stroke="rgba(255,0,0,0.5)"
          d={this.props.path}
        />
        {this.path &&
          this.props.model.targetPort && (
            <g fill="none" transform={`translate(${this.endPoint.x - 18}, ${this.endPoint.y - 10}) scale(1.7)`}>
              <svg width="8px" height="12px" viewBox="0 0 8 12" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g id="launchpad-/-tool-card" transform="translate(-168.000000, -89.000000)">
                    <g id="tool-card">
                      <g id="Group-7">
                        <g id="Group" transform="translate(166.000000, 89.000000)">
                          <rect id="Rectangle-22" x="0" y="0" width="12" height="12" />
                          <polygon
                            id="Combined-Shape"
                            fill="#40D5BB"
                            transform="translate(6.000000, 6.000000) scale(1, -1) rotate(-360.000000) translate(-6.000000, -6.000000) "
                            points="2.57142857 9.45441559 2.57142857 12 9.42857143 6 2.57142857 2.30026081e-13 2.57142857 2.54558441 6.5193321 6"
                          />
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </g>
          )}
      </>
    );
  }
}

export default CustomLink;
