import React, { Component } from "react";
import PropTypes from "prop-types";
import WorkFlowCloseButton from "Components/WorkflowCloseButton";
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
            <g
              transform={`translate(${this.halfwayPoint.x - 20}, ${this.halfwayPoint.y - 12})`}
              xmlns="http://www.w3.org/2000/svg"
            >
              <foreignObject width="24" height="24" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                <div xmlns="http://www.w3.org/1999/xhtml">
                  <WorkFlowCloseButton onClick={this.handleOnDelete} />
                </div>
              </foreignObject>
            </g>
            <g
              transform={`translate(${this.halfwayPoint.x + 20}, ${this.halfwayPoint.y - 12})`}
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
        )}
      </svg>
    );
  }
}

export default CustomLink;
