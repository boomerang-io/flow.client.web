import React from "react";

class CustomLinkWidget extends React.Component {
  constructor(props) {
    super(props);
    this.percent = 0;
  }

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
            <svg width="13px" height="14px" viewBox="0 0 13 14" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <g id="" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="13.20-describe-empty" transform="translate(-1159.000000, -152.000000)" fill="#1D364D">
                  <g id="x" transform="translate(1147.000000, 140.000000)">
                    <polygon points="24.1332409 12 18.0666975 17.51474 12 12 12 14.96982 16.4331308 18.99986 16.4329767 19 16.4331308 19.00014 12 23.03018 12 26 18.0666975 20.48512 24.1332409 26 24.1332409 23.03018 19.7001102 19.00014 19.7004182 19 19.7001102 18.99972 24.1332409 14.96982" />
                  </g>
                </g>
              </g>
            </svg>
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
