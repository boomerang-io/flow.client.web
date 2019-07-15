import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";
import LoadingAnimation from "@boomerang/boomerang-components/lib/LoadingAnimation";
import NoDisplay from "@boomerang/boomerang-components/lib/NoDisplay";
import ScrollUp from "Components/ScrollUp";
import LogCard from "./LogCard";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import "./styles.scss";

class ChangeLog extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired
  };

  static defaultProps = {
    workflow: {}
  };

  state = {
    hasMoreLogs: true,
    changeLogList: [],
    hasLoaded: false
  };

  componentDidMount() {
    this.loadMoreLogs(0);
  }

  loadMoreLogs = page => {
    let newChangeLog = [...this.state.changeLogList];
    axios
      .get(
        `${BASE_SERVICE_URL}/workflow/${
          this.props.workflow.data.id
        }/changelog?size=10&page=${page}&sort=version&order=DESC`
      )
      .then(response => {
        this.setState({
          changeLogList: [...newChangeLog, ...response.data],
          hasMoreLogs: response.data.length < 10 ? false : true,
          hasLoaded: true
        });
      });
  };

  renderChangeLog() {
    const { hasLoaded, hasMoreLogs, changeLogList } = this.state;
    if (hasLoaded) {
      if (changeLogList.length > 0) {
        return (
          <InfiniteScroll
            className="c-worklfow-log-list"
            pageStart={0}
            loadMore={this.loadMoreLogs}
            hasMore={hasMoreLogs}
            loader={<LoadingAnimation className="s-change-log-loading" theme="brmg-white" key="loading" />}
            useWindow={true}
          >
            {changeLogList.map((log, index) => {
              return <LogCard log={log} key={index + log.revisionId} />;
            })}
          </InfiniteScroll>
        );
      } else {
        return <NoDisplay text="No changes to display" style={{ marginTop: "2rem" }} />;
      }
    } else {
      return <LoadingAnimation theme="bmrg-white" />;
    }
  }

  render() {
    return (
      <div className="c-worklfow-change-log">
        {this.props.workflow.data.name ? (
          <h1 className="s-worklfow-change-log-title">{`${this.props.workflow.data.name} Changes`}</h1>
        ) : (
          ""
        )}
        {this.renderChangeLog()}
        <ScrollUp />
      </div>
    );
  }
}

export default ChangeLog;
