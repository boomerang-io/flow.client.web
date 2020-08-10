//@ts-nocheck
import React from "react";
import PropTypes from "prop-types";
import { settings } from "carbon-components";
import { DataTableSkeleton, DataTable, DelayedRender, Pagination } from "@boomerang-io/carbon-addons-boomerang-react";
import { Error404 } from "@boomerang-io/carbon-addons-boomerang-react";
import cx from "classnames";
import moment from "moment";
import queryString from "query-string";
import { getHumanizedDuration, isAccessibleEvent } from "@boomerang-io/utils";
import { ExecutionStatusCopy, executionStatusIcon } from "Constants";
import styles from "./activityTable.module.scss";

const { prefix } = settings;

ActivityTable.propTypes = {
  history: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  tableData: PropTypes.object,
  updateHistorySearch: PropTypes.func.isRequired,
};

const PAGE_SIZES = [5, 10, 20, 25, 50, 100];

const headers = [
  {
    header: "Team",
    key: "teamName",
    sortable: true,
  },
  {
    header: "Workflow",
    key: "workflowName",
    sortable: true,
  },
  {
    header: "Trigger",
    key: "trigger",
  },
  {
    header: "Initiated By",
    key: "initiatedByUserName",
  },
  {
    header: "Start Time",
    key: "creationDate",
  },
  {
    header: "Duration",
    key: "duration",
  },
  {
    header: "Status",
    key: "status",
  },
];

function renderCell(cellIndex, value) {
  const column = headers[cellIndex];

  switch (column.key) {
    case "trigger":
      return (
        <p className={styles.tableTextarea} style={{ textTransform: "capitalize" }}>
          {value || "---"}
        </p>
      );
    case "creationDate":
      return <time className={styles.tableTextarea}>{moment(value).format("YYYY-MM-DD hh:mm A")}</time>;
    case "duration":
      return (
        <time className={styles.tableTextarea}>{value ? getHumanizedDuration(parseInt(value / 1000, 10)) : "---"}</time>
      );
    case "status":
      const Icon = executionStatusIcon[value ? value : "notstarted"];
      return (
        <div className={`${styles.status} ${styles[value]}`}>
          <Icon aria-label={value} className={styles.statusIcon} />
          <p className={styles.statusText}>{ExecutionStatusCopy[value ? value : "notstarted"]}</p>
        </div>
      );
    default:
      return <p className={styles.tableTextarea}>{value || "---"}</p>;
  }
}

function ActivityTable(props) {
  function handlePaginationChange({ page, pageSize }) {
    props.updateHistorySearch({
      ...queryString.parse(props.location.search),
      page: page - 1, // We have to decrement by one to offset the table pagination adjustment
      size: pageSize,
    });
  }

  function handleSort(e, { sortHeaderKey }) {
    const { property, direction } = props.tableData.pageable.sort[0];
    const sort = sortHeaderKey;
    let order = "ASC";

    if (sort === property && direction === "ASC") {
      order = "DESC";
    }

    props.updateHistorySearch({ ...queryString.parse(props.location.search), sort, order });
  }

  function executionViewRedirect(activityId) {
    const activity = props.tableData.records.find((activity) => activity.id === activityId);
    props.history.push({
      pathname: `/activity/${activity.workflowId}/execution/${activity.id}`,
      state: { fromUrl: `${props.match.url}${props.location.search}`, fromText: "Activity" },
    });
  }

  if (props.isLoading) {
    return (
      <DelayedRender>
        <div style={{ marginTop: "1rem" }}>
          <DataTableSkeleton
            className={cx(`${prefix}--skeleton`, `${prefix}--data-table`, styles.tableSkeleton)}
            rowCount={10}
            columnCount={headers.length}
            headers={headers.map((header) => header.header)}
          />
        </div>
      </DelayedRender>
    );
  }

  const {
    pageable: { number, size, sort, totalElements },
    records,
  } = props.tableData;
  const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;

  return (
    <section>
      <div className={styles.tableContainer}>
        {totalElements > 0 ? (
          <>
            <DataTable
              rows={records}
              headers={headers}
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
                              className: `${styles.tableHeadHeader} ${styles[header.key]}`,
                              isSortable: header.sortable,
                              onClick: handleSort,
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
                      {rows.map((row) => (
                        <TableRow
                          key={row.id}
                          className={`${styles.tableRow} ${styles[row.cells[6].value]}`}
                          data-testid="configuration-property-table-row"
                          onClick={() => executionViewRedirect(row.id)}
                          onKeyDown={(e) => isAccessibleEvent(e) && executionViewRedirect(row.id)}
                          tabIndex={0}
                        >
                          {row.cells.map((cell, cellIndex) => (
                            <TableCell key={cell.id}>
                              <div className={styles.tableCell}>{renderCell(cellIndex, cell.value)}</div>
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
              onChange={handlePaginationChange}
              page={number + 1} // We need to offset by one bc service is zero indexed
              pageSize={size}
              pageSizes={PAGE_SIZES}
              totalItems={totalElements}
            />
          </>
        ) : (
          <>
            <DataTable
              rows={[]}
              headers={headers}
              render={({ headers }) => (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow className={styles.tableHeadRow}>
                        {headers.map((header) => (
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
            <Error404
              message={"Execute some workflows or try changing the filters"}
              title="No activity found"
              header={null}
            />
          </>
        )}
      </div>
    </section>
  );
}

export default ActivityTable;
