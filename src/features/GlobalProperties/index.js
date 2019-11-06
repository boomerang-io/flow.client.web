import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions } from "State/globalConfiguration";
import ErrorDragon from "Components/ErrorDragon";
import Loading from "Components/Loading";
import PropertiesTable from "./PropertiesTable";
import REQUEST_STATUSES from "Constants/serviceRequestStatuses";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import styles from "./globalProperties.module.scss";

export class GlobalPropertiesContainer extends Component {
  static propTypes = {
    actions: PropTypes.object,
    globalConfiguration: PropTypes.object
  };

  componentDidMount() {
    this.fetchConfig();
  }

  componentWillUnmount() {
    this.props.actions.reset();
  }

  fetchConfig = () => {
    this.props.actions.fetch(`${BASE_SERVICE_URL}/config`);
  };

  addPropertyInStore = property => {
    return this.props.actions.addPropertyInStore(property);
  };

  deletePropertyInStore = property => {
    return this.props.actions.deletePropertyInStore(property);
  };

  updatePropertyInStore = property => {
    return this.props.actions.updatePropertyInStore(property);
  };

  render() {
    const {
      globalConfiguration: { isFetching, status, data: properties }
    } = this.props;

    if (isFetching) {
      return <Loading />;
    }

    if (status === REQUEST_STATUSES.FAILURE) {
      return (
        <div className={styles.container}>
          <ErrorDragon />
        </div>
      );
    }

    if (status === REQUEST_STATUSES.SUCCESS) {
      return (
        <div className={styles.container}>
          <PropertiesTable
            properties={properties}
            addPropertyInStore={this.addPropertyInStore}
            deletePropertyInStore={this.deletePropertyInStore}
            updatePropertyInStore={this.updatePropertyInStore}
          />
        </div>
      );
    }

    return null;
  }
}

const mapStateToProps = state => {
  return {
    globalConfiguration: state.globalConfiguration
  };
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GlobalPropertiesContainer);
