import React, { Component } from "react";
import PropTypes from "prop-types";
import LoadingAnimation from "@boomerang/boomerang-components/lib/LoadingAnimation";
import Body from "@boomerang/boomerang-components/lib/ModalContentBody";
import Footer from "@boomerang/boomerang-components/lib/ModalContentFooter";
import ConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import Error from "@boomerang/boomerang-components/lib/Error";
import RequestMessage from "@boomerang/boomerang-components/lib/RequestMessage";
import successDarkestBlueIcon from "Assets/svg/success_darkest_blue.svg";
import { options } from "Constants/importWorkflowOptions";
import { REQUEST_STATUSES } from "Config/servicesConfig";
import "./styles.scss";

class ImportResult extends Component {
  componentDidMount() {
    this.props.shouldConfirmExit(true);
  }

  static propTypes = {
    fetchTeams: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    goToStep: PropTypes.func.isRequired,
    importWorkflow: PropTypes.object
  };

  handleCloseModal = () => {
    this.props.fetchTeams();
    this.props.closeModal();
  };

  render() {
    if (this.props.importWorkflow.isPosting === true) {
      return (
        <Body
          style={{
            height: "20rem",
            width: "36rem",
            margin: "0 auto 3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <LoadingAnimation theme="bmrg-white" />
        </Body>
      );
    }

    if (!!this.props.importWorkflow.error) {
      return (
        <form onSubmit={() => this.props.goToStep(options.IMPORT_WORKFLOW_TYPE)}>
          <Body
            style={{
              height: "25rem",
              width: "36rem",
              margin: "2.5rem auto 0rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <Error theme="bmrg-white" />
          </Body>
          <Footer>
            <ConfirmButton text="Try again?" theme="bmrg-white" />
          </Footer>
        </form>
      );
    }

    if (this.props.importWorkflow.status === REQUEST_STATUSES.SUCCESS) {
      return (
        <form onSubmit={this.handleCloseModal}>
          <Body
            style={{
              height: "20rem",
              width: "36rem",
              margin: "4rem auto 3.2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <div className="b-import-workflow-result__img-content">
              <img className="b-import-workflow-result__img" src={successDarkestBlueIcon} alt="result" />
            </div>
            <RequestMessage className={"b-import-workflow-result__text"} request="WORKFLOW" theme="bmrg-white" />
          </Body>
          <Footer>
            <ConfirmButton text="Done" theme="bmrg-white" type="submit" />
          </Footer>
        </form>
      );
    }
    return null;
  }
}

export default ImportResult;
