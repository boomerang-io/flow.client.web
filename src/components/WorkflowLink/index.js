import React, { Component } from "react";
import PropTypes from "prop-types";
import CloseModalButton from "@boomerang/boomerang-components/lib/CloseModalButton";
import MultiStateButton from "./MultiStateButton";
import "./styles.scss";

class CustomLink extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    diagramEngine: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      executionCondition: this.props.model.executionCondition,
      count: 0 //just set here one time
    };

    this.halfwayPoint = "";
    this.endPoint = "";
    this.path = React.createRef();
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

  getArrowAngle = (cx, cy, ex, ey) => {
    const dy = ey - cy;
    const dx = ex - cx;
    let theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
  };

  render() {
    const { model } = this.props;
    let theta = 0;
    // if (this.path.current && model.targetPort) {
    //   theta = this.getArrowAngle(model.sourcePort.x, model.sourcePort.y, model.targetPort.x, model.targetPort.y);
    // }
    // console.log(theta);

    let linkStyle = {};

    if (!model.sourcePort || !model.targetPort) {
      linkStyle = { opacity: "0.25" };
    }

    if (this.path.current) {
      this.halfwayPoint = this.path.current.getPointAtLength(this.path.current.getTotalLength() * 0.5);
      this.endPoint = this.path.current.getPointAtLength(this.path.current.getTotalLength());
    }

    return (
      <svg>
        {this.path.current && !this.props.diagramEngine.diagramModel.locked && this.props.model.targetPort && (
          <>
            <g
              transform={`translate(${this.halfwayPoint.x - 10}, ${this.halfwayPoint.y - 30}) scale(0.7)`}
              xmlns="http://www.w3.org/2000/svg"
            >
              <foreignObject width="48" height="48" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                <div xmlns="http://www.w3.org/1999/xhtml">
                  <CloseModalButton onClick={this.handleOnDelete} />
                </div>
              </foreignObject>
            </g>
            <g
              transform={`translate(${this.halfwayPoint.x - 2}, ${this.halfwayPoint.y + 5})`}
              xmlns="http://www.w3.org/2000/svg"
            >
              <foreignObject
                width="28"
                height="28"
                requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                  xmlns="http://www.w3.org/1999/xhtml"
                >
                  <MultiStateButton
                    onClick={this.updateExecutionState}
                    initialExecutionCondition={this.state.executionCondition}
                    modelId={this.props.model.id}
                  />
                </div>
              </foreignObject>
            </g>
          </>
        )}
        <path
          ref={this.path}
          style={linkStyle}
          strokeWidth={this.props.model.width}
          stroke="rgba(255,0,0,0.5)"
          d={this.props.path}
        />
        {/* {this.path.current && this.props.model.targetPort && (
          <g
            x="0"
            y="0"
            fill="none"
            transform={`translate(${this.endPoint.x - 32 + 32 * Math.abs(theta / 90)}, ${this.endPoint.y -
              10}) scale(.0375) rotate(${theta})`}
          >
            <svg
              version="1.1"
              id="Layer_1"
              width="460.5"
              height="531.74"
              viewBox="0 0 460.5 531.74"
              overflow="visible"
              enableBackground="new 0 0 460.5 531.74"
            >
              <polygon fill="#40d5bb" points="0.5,0.866 459.5,265.87 0.5,530.874" />
            </svg>
          </g>
        )} */}
      </svg>
    );
  }
}

export default CustomLink;
