import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions } from "State/changeLog";
import { DataTableSkeleton, SearchSkeleton } from "carbon-components-react";
import DelayedRender from "Components/DelayedRender";
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
      `${BASE_SERVICE_URL}/workflow/${this.props.workflow.id}/changelog?sort=version&order=DESC`
    );
  }

  render() {
    const { changeLog } = this.props;

    if (changeLog.isFetching)
      return (
        <DelayedRender>
          <div className={styles.container}>
            <div className={styles.searchSkeleton}>
              <SearchSkeleton small />
            </div>
            <DataTableSkeleton />
          </div>
        </DelayedRender>
      );

    if (changeLog.status === REQUEST_STATUSES.SUCCESS)
      return (
        <main className={styles.container}>
          <ChangeLogTable changeLog={changeLog.data} />
        </main>
      );
    if (changeLog.status === REQUEST_STATUSES.FAILURE) return <ErrorDragon />;
    return null;
  }
}

const mapStateToProps = state => ({
  changeLog: state.changeLog
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangeLog);
