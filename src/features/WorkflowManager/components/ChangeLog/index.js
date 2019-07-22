import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions } from "State/changeLog";
import LoadingAnimation from "@boomerang/boomerang-components/lib/LoadingAnimation";
import ErrorDragon from "Components/ErrorDragon";
import ChangeLogTable from "./ChangeLogTable";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import styles from "./changeLog.module.scss";

class ChangeLog extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired
  };

  static defaultProps = {
    workflow: {}
  };

  componentDidMount() {
    this.props.actions.fetch(
      `${BASE_SERVICE_URL}/workflow/${this.props.workflow.data.id}/changelog?sort=version&order=DESC`
    );
  }

  render() {
    const { changeLog } = this.props;

    if (changeLog.isFetching) return <LoadingAnimation theme="bmrg-flow" />;

    if (changeLog.status === REQUEST_STATUSES.SUCCESS)
      return (
        <div className={styles.container}>
          <ChangeLogTable changeLog={changeLog.data} />
        </div>
      );
    if (changeLog.status === REQUEST_STATUSES.FAILURE) return <ErrorDragon theme="bmrg-flow" />;
    return null;
  }
}

const mapStateToProps = state => ({
  changeLog: state.changeLog
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeLog);
