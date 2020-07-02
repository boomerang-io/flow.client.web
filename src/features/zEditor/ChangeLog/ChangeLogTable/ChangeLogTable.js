import React, { Component } from "react";
import matchSorter from "match-sorter";
import PropTypes from "prop-types";
import moment from "moment";
import { DataTable, Search, Pagination } from "@boomerang-io/carbon-addons-boomerang-react";
import { Error404 } from "@boomerang-io/carbon-addons-boomerang-react";
import { arrayPagination } from "Utils/arrayHelper";
import styles from "./changeLogTable.module.scss";

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZES = [DEFAULT_PAGE_SIZE, 25, 50];

class ChangeLogTable extends Component {
  static propTypes = {
    changeLog: PropTypes.array,
  };

  state = {
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    changeLog: this.props.changeLog ? this.props.changeLog.map((log) => ({ ...log, id: log.revisionId })) : [],
    sort: {
      key: "version",
      sortDirection: "DESC",
    },
  };

  headers = [
    {
      header: "Version",
      key: "version",
    },
    {
      header: "User",
      key: "userName",
    },
    {
      header: "Reason",
      key: "reason",
    },
    {
      header: "Date",
      key: "date",
    },
  ];

  /* Standard table configuration after search or service call */
  resetTableWithNewLogs = (changeLog) => {
    const { page, pageSize } = this.state;
    const newPage = page !== 1 && changeLog.length < pageSize * (page - 1) + 1 ? page - 1 : page;
    this.setState({ page: newPage, changeLog });
  };

  handleSearchChange = (e) => {
    const searchQuery = e.target.value;
    const { changeLog } = this.props;
    const changeLogList = changeLog.length !== 0 ? changeLog.map((log) => ({ ...log, id: log.revisionId })) : [];

    const newLogs = searchQuery
      ? matchSorter(changeLogList, searchQuery, { keys: ["version", "userName", "reason"] })
      : changeLogList;

    this.resetTableWithNewLogs(newLogs);
  };

  handlePaginationChange = ({ page, pageSize }) => {
    this.setState({ page, pageSize });
  };

  renderCell = (cellIndex, value) => {
    const column = this.headers[cellIndex];

    switch (column.header) {
      case "Date":
        return <p className={styles.tableText}>{moment(value).format("YYYY-MM-DD hh:mm A")}</p>;
      default:
        return <p className={styles.tableText}>{value || "---"}</p>;
    }
  };

  handleSort = (valueA, valueB, config) => {
    this.setState({ sort: config });
  };

  render() {
    const { page, pageSize, changeLog, sort } = this.state;
    const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;

    const totalItems = changeLog.length;

    return (
      <div className={styles.tableContainer}>
        <Search
          className={styles.search}
          id="change-log-table-search"
          labelText="Search"
          placeHolderText="Search"
          onChange={this.handleSearchChange}
          data-cy="change-log-search"
        />
        {totalItems > 0 ? (
          <>
            <DataTable
              sortable
              rows={arrayPagination(changeLog, page, pageSize, sort)}
              sortRow={this.handleSort}
              headers={this.headers}
              render={({ rows, headers, getHeaderProps }) => (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {headers.map((header) => (
                          <TableHeader
                            id={header.key}
                            {...getHeaderProps({
                              header,
                              className: `${styles.tableHeadHeader}`,
                              isSortable: true,
                            })}
                          >
                            {header.header}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody className={styles.tableBody}>
                      {rows.map((row) => (
                        <TableRow key={row.id} data-testid="change-log-table-row">
                          {row.cells.map((cell, cellIndex) => (
                            <TableCell key={cell.id} style={{ padding: "0" }} className={styles[cell.info.header]}>
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
              page={page}
              pageSize={pageSize}
              pageSizes={PAGE_SIZES}
              totalItems={totalItems}
            />
          </>
        ) : (
          <Error404 header={null} message={null} title="No change logs found" />
        )}
      </div>
    );
  }
}

export default ChangeLogTable;
