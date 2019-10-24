import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import moment from "moment";
import cx from "classnames";
import { settings } from "carbon-components";
import queryString from "query-string";
import getHumanizedDuration from "@boomerang/boomerang-utilities/lib/getHumanizedDuration";
import isAccessibleEvent from "@boomerang/boomerang-utilities/lib/isAccessibleEvent";
import { DataTableSkeleton, DataTable, Pagination } from "carbon-components-react";
import { NoDisplay } from "@boomerang/carbon-addons-boomerang-react";
import DelayedRender from "Components/DelayedRender";
import { ACTIVITY_STATUSES_TO_TEXT, ACTIVITY_STATUSES_TO_ICON } from "Constants/activityStatuses";
import styles from "./activityTable.module.scss";

const { prefix } = settings;

const PAGE_SIZES = [5, 10, 20, 25, 50, 100];

class ActivityTable extends Component {
  static propTypes = {
    isUpdating: PropTypes.bool,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    tableData: PropTypes.object.isRequired,
    updateHistorySearch: PropTypes.func.isRequired
  };

  headers = [
    {
      header: "Team",
      key: "teamName"
    },
    {
      header: "Workflow",
      key: "workflowName"
    },
    {
      header: "Trigger",
      key: "trigger"
    },
    {
      header: "Initiated By",
      key: "initiatedByUserName"
    },
    {
      header: "Start Time",
      key: "creationDate"
    },
    {
      header: "Duration",
      key: "duration"
    },
    {
      header: "Status",
      key: "status"
    }
  ];

  renderCell = (cellIndex, value) => {
    const column = this.headers[cellIndex];

    switch (column.header) {
      case "Trigger":
        return (
          <p className={styles.tableTextarea} style={{ textTransform: "capitalize" }}>
            {value || "---"}
          </p>
        );
      case "Start Time":
        return <time className={styles.tableTextarea}>{moment(value).format("YYYY-MM-DD hh:mm A")}</time>;
      case "Duration":
        return (
          <time className={styles.tableTextarea}>
            {value ? getHumanizedDuration(parseInt(value / 1000, 10)) : "---"}
          </time>
        );
      case "Status":
        const Icon = ACTIVITY_STATUSES_TO_ICON[value ? value : "notstarted"];
        return (
          <div className={`${styles.status} ${styles[value]}`}>
            <Icon aria-label={value} className={styles.statusIcon} />
            <p className={styles.statusText}>{ACTIVITY_STATUSES_TO_TEXT[value ? value : "notstarted"]}</p>
          </div>
        );
      default:
        return <p className={styles.tableTextarea}>{value || "---"}</p>;
    }
  };

  handlePaginationChange = ({ page, pageSize }) => {
    this.props.updateHistorySearch({ ...queryString.parse(this.props.location.search), page, size: pageSize });
  };

  handleSort = (e, { sortHeaderKey }) => {
    const { property, direction } = this.props.tableData.pageable.sort[0];
    const sort = sortHeaderKey;
    let order = "ASC";

    if (sort === property && direction === "ASC") {
      order = "DESC";
    }

    this.props.updateHistorySearch({ ...queryString.parse(this.props.location.search), sort, order });
  };

  executionViewRedirect = activityId => {
    const activity = this.props.tableData.records.find(activity => activity.id === activityId);
    this.props.history.push({
      pathname: `/activity/${activity.workflowId}/execution/${activity.id}`,
      state: { fromUrl: `${this.props.match.url}${this.props.location.search}`, fromText: "Activity" }
    });
  };

  render() {
    const {
      pageable: { number, size, sort, totalElements },
      records
    } = this.props.tableData;
    const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;

    if (this.props.isUpdating) {
      return (
        <DelayedRender>
          <div style={{ marginTop: "1rem" }}>
            <DataTableSkeleton
              className={cx(`${prefix}--skeleton`, `${prefix}--data-table`, styles.tableSkeleton)}
              rowCount={size}
              columnCount={this.headers.length}
              headers={this.headers.map(header => header.header)}
            />
          </div>
        </DelayedRender>
      );
    }

    return (
      <section>
        <div className={styles.tableContainer}>
          {totalElements > 0 ? (
            <>
              <DataTable
                rows={records}
                isSortable
                headers={this.headers}
                render={({ rows, headers, getHeaderProps }) => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow className={styles.tableHeadRow}>
                          {headers.map(header => (
                            <TableHeader
                              id={header.key}
                              {...getHeaderProps({
                                header,
                                className: `${styles.tableHeadHeader} ${styles[header.key]}`,
                                onClick: this.handleSort
                              })}
                              isSortHeader={sort[0].property === header.key}
                              sortDirection={sort[0].direction}
                            >
                              {header.header}
                            </TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody className={styles.tableBody}>
                        {rows.map(row => (
                          <TableRow
                            key={row.id}
                            className={`${styles.tableRow} ${styles[row.cells[6].value]}`}
                            data-testid="configuration-property-table-row"
                            onClick={() => this.executionViewRedirect(row.id)}
                            onKeyDown={e => isAccessibleEvent(e) && this.executionViewRedirect(row.id)}
                            tabIndex={0}
                          >
                            {row.cells.map((cell, cellIndex) => (
                              <TableCell key={cell.id} style={{ padding: "0" }}>
                                <div className={styles.tableCell}>{this.renderCell(cellIndex, cell.value)}</div>
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              />
              <Pagination
                onChange={this.handlePaginationChange}
                page={number}
                pageSize={size}
                pageSizes={PAGE_SIZES}
                totalItems={totalElements}
              />
            </>
          ) : (
            <>
              <DataTable
                rows={[]}
                headers={this.headers}
                render={({ headers }) => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow className={styles.tableHeadRow}>
                          {headers.map(header => (
                            <TableHeader
                              key={header.key}
                              id={header.key}
                              className={`${styles.tableHeadHeader} ${styles[header.key]}`}
                            >
                              {header.header}
                            </TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                    </Table>
                  </TableContainer>
                )}
              />
              <NoDisplay
                style={{ marginTop: "5.5rem" }}
                textLocation="below"
                text="Looks like you need to run some workflows!"
              />
            </>
          )}
        </div>
      </section>
    );
  }
}

export default withRouter(ActivityTable);
