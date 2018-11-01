import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Table from "@boomerang/boomerang-components/lib/Table";
import getHumanizedDuration from "@boomerang/boomerang-utilities/lib/getHumanizedDuration";
import activityStatuses from "Constants/activityStatuses";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import imgs from "Assets/icons";
import statusImgs from "./img";
import "./styles.scss";

class ActivityTable extends Component {
  static propTypes = {
    activities: PropTypes.array.isRequired,
    pageSize: PropTypes.number.isRequired,
    pageNumber: PropTypes.number.isRequired,
    totalPageCount: PropTypes.number.isRequired,
    savePageSize: PropTypes.func.isRequired,
    fetchActivities: PropTypes.func.isRequired,
    searchQuery: PropTypes.string,
    sort: PropTypes.array,
    totalElements: PropTypes.number
  };

  state = {
    pageSize: this.props.pageSize || 10,
    sorted: this.props.sort[0] ? this.props.sort[0].property : "",
    direction: this.props.sort[0] ? this.props.sort[0].direction : ""
  };

  getStatusIcon = (status) => {
    switch(status){
      case activityStatuses.COMPLETED:
        return statusImgs["passed"];
      case activityStatuses.FAILED:
        return statusImgs["failed"];
      default:
        return statusImgs["pending"];
    }
  }
  getStatusText = (status) => {
    switch(status){
      case activityStatuses.COMPLETED:
        return "Success";
      case activityStatuses.FAILED:
        return "Failed";
      default:
        return "In Progress";
    }
  }

  onSortedChange = (newSorted, column) => {
    const direction = newSorted[0].desc ? "DESC" : "ASC";

    this.setState({ sorted: column.id, direction }, () => {
      this.onPageChange(this.props.pageNumber);
    });
  };

  onPageChange = page => {
    const { pageSize, sorted, direction } = this.state;
    const { searchQuery } = this.props;
    this.props.fetchActivities(
      `${BASE_SERVICE_URL}/activity?size=${pageSize}&page=${page}&sort=${sorted}&order=${direction}&query=${searchQuery}`
    );
  };

  onPageSizeChange = pageSize => {
    this.props.savePageSize(pageSize);
    this.setState({ pageSize }, () => {
      this.onPageChange(0);
    });
  };

  columns = [
    {
      Header: "Workflow",
      accessor: "workflowName",
      className: "c-activities-row__item-workflow",
      width: 380,
      Cell: row => {
        return (
          <div className="c-activity-card__workflow">
            <div className="c-activity-card__icon">
              <img className="b-activity-card__icon" src={imgs[row.original.icon]} alt="icon"/>
            </div>
            <div className="c-activity-card__workflow-info">
              <label className="b-activity-card__name">{row.original.workflowName}</label>
              <label className="b-activity-card__description">{row.original.description}</label>
            </div>
          </div>
        );
      }
    },
    {
      Header: "Creation Date",
      accessor: "creationDate",
      className: "c-activities-row__item-activity",
      width: 380,
      Cell: row => {
        return (
          <div className="c-activity-card__activity">
            <div className="c-activity-card__label">
              <label className="b-activity-card__label">Start Time</label>
              <label className="b-activity-card__data">{moment(row.original.creationDate).format("YYYY-MM-DD hh:mm A")}</label>
            </div>
            <div className="c-activity-card__label">
              <label className="b-activity-card__label">Duration</label>
              <label className="b-activity-card__data">{getHumanizedDuration(row.original.duration)}</label>
            </div>
            <div className="c-activity-card__label">
              <label className="b-activity-card__label"> Status</label>
              <label className="b-activity-card__data">
                <img className="b-activity-card__status-icon" src={this.getStatusIcon(row.original.status)} alt="status" />
                {this.getStatusText(row.original.status)}
              </label>
            </div>
          </div>
        );
      }
    }
  ];

  render() {
    const { sort } = this.props;
    return (
        <div className="c-activities-table">
          <Table
            manual
            className=""
            data={this.props.activities}
            columns={this.columns}
            showPagination={this.props.activities.length > 0 || this.state.pageSize > 0 ? true : false}
            defaultPageSize={this.state.pageSize}
            minRows={this.props.activities && this.props.activities.length ? this.props.activities.length : 5}
            page={this.props.pageNumber}
            pages={this.props.totalPageCount}
            onPageChange={this.onPageChange}
            onPageSizeChange={this.onPageSizeChange}
            onSortedChange={this.onSortedChange}
            noDataText="No audit records found"
            theme="bmrg-blue"
            getTrGroupProps={(state, rowInfo) => {
              return {className: `--${rowInfo.original.status}`}
            }}
            defaultSorted={
              sort
                ? sort.map(sort => ({
                    id: sort.property,
                    desc: sort.descending
                  }))
                : []
            }
            
          />
        </div>
    );
  }
}

export default ActivityTable;
