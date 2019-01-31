import React, { Component } from "react";
import PropTypes from "prop-types";
import CloseModalButton from "@boomerang/boomerang-components/lib/CloseModalButton";
import MultiStateButton from "./MultiStateButton";

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

  render() {
    const { model } = this.props;
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
            <g transform={`translate(${this.halfwayPoint.x - 10}, ${this.halfwayPoint.y - 30}) scale(0.7)`}>
              <foreignObject
                width="2.875rem"
                height="2.875rem"
                requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
              >
                <CloseModalButton onClick={this.handleOnDelete} xmlns="http://www.w3.org/1999/xhtml" />
              </foreignObject>
            </g>
            <g transform={`translate(${this.halfwayPoint.x - 2}, ${this.halfwayPoint.y + 5})`}>
              <foreignObject
                width="1.625rem"
                height="1.625rem"
                requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MultiStateButton
                    onClick={this.updateExecutionState}
                    initialExecutionCondition={this.state.executionCondition}
                    modelId={this.props.model.id}
                    xmlns="http://www.w3.org/1999/xhtml"
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
        {this.path.current && this.props.model.targetPort && (
          <g fill="none" transform={`translate(${this.endPoint.x - 20}, ${this.endPoint.y - 10}) scale(.0375)`}>
            <svg
              version="1.1"
              id="Layer_1"
              width="460.5"
              height="531.74"
              viewBox="0 0 460.5 531.74"
              overflow="visible"
              enableBackground="new 0 0 460.5 531.74"
            />
          </g>
        )}
      </svg>
    );
  }
}

export default CustomLink;
