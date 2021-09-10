import React from "react";
import { settings } from "carbon-components";
import { useAppContext } from "Hooks";
import { Button, DataTableSkeleton, DataTable, Pagination } from "@boomerang-io/carbon-addons-boomerang-react";
import cx from "classnames";
import queryString from "query-string";
import { isAccessibleKeyboardEvent } from "@boomerang-io/utils";
import EmptyState from "Components/EmptyState";
import ApproveRejectActions from "./ApproveRejectActions";
import { ApprovalStatus, ApprovalInputRequired } from "Constants";
import { Action } from "Types";
import dateHelper from "Utils/dateHelper";
import { CheckmarkOutline16, CloseOutline16 } from "@carbon/icons-react";
import styles from "./ActionsTable.module.scss";

const { prefix } = settings;

interface ActionsTableProps {
  actionsQueryToRefetch: string;
  history: any,
  isLoading: boolean,
  location: any,
  match: any,
  isSystemWorkflowsEnabled: boolean,
  tableData: any,
  updateHistorySearch: Function,
};

const PAGE_SIZES = [5, 10, 20, 25, 50, 100];

const headers = [
  {
    header: "Team",
    key: "teamName",
    sortable: true,
  },
  { 
    header: "Scope",
    key: "scope",
    sortable: true
  },
  {
    header: "Workflow",
    key: "workflowName",
    sortable: true,
  },
  {
    header: "Task",
    key: "taskName",
    sortable: true,
  },
  {
    header: "Time Submitted",
    key: "creationDate",
    sortable: true
  },
  {
    header: "Status",
    key: "status",
    sortable: true
  },
];

function renderCell(headerList: any, cellIndex: number, value: any) {
  const column = headerList[cellIndex];

  switch (column.key) {
    case "scope":
    case "status":
      return (
        <p className={styles.tableTextarea} style={{ textTransform: "capitalize" }}>
          {value || "---"}
        </p>
      );
    case "creationDate":
      return <time className={styles.tableTextarea}>{value ? dateHelper.humanizedSimpleTimeAgo(value) : "---"}</time>;
    default:
      return <p className={styles.tableTextarea}>{value || "---"}</p>;
  }
}

function ActionsTable(props: ActionsTableProps) {
  const { user } = useAppContext();
  const isManual = props.location.pathname.includes("/manual");
  const [selectedActions, setSelectedActions] = React.useState<string[]>([]);
  const noSelectedActions = selectedActions.length === 0;

  let headerList = headers;
  if (!props.isSystemWorkflowsEnabled) {
    headerList = headers.filter((header) => header.key !== "scope");
  }

  const handleOnClickCheckbox = (rowId: any) => {
    if (Array.isArray(rowId)) {
      // checking if all the page is already selected. If YES empty the actions list, if NOT push the values to the list.
      const isAllPageSelected = rowId.every((item) => {
        return selectedActions.findIndex((index) => index === item) > -1;
      });
      if (isAllPageSelected) {
        return setSelectedActions([]);
      }
      // removing duplicates while also pushing new data into array
      return setSelectedActions([...new Set([...selectedActions, ...rowId])]);
    }

    const actions = [...selectedActions];
    const requestToUpdateIndex = actions.findIndex((request) => request === rowId);

    if (requestToUpdateIndex > -1) {
      actions.splice(requestToUpdateIndex, 1);
    } else {
      actions.push(rowId);
    }

    setSelectedActions([...actions]);
  };

  function handlePaginationChange({ page, pageSize }: { page: number, pageSize: number }) {
    props.updateHistorySearch({
      ...queryString.parse(props.location.search),
      page: page - 1, // We have to decrement by one to offset the table pagination adjustment
      size: pageSize,
    });
  }

  function handleSort(e: any, { sortHeaderKey }: { sortHeaderKey: string }) {
    const { property, direction } = props.tableData.pageable.sort[0];
    const sort = sortHeaderKey;
    let order = "ASC";

    if (sort === property && direction === "ASC") {
      order = "DESC";
    }

    props.updateHistorySearch({ ...queryString.parse(props.location.search), sort, order });
  }

  /**
   * Prevent opening modal when clicking the checkboxes in the table
   */
   const handleApprovalRowClick = ({ event, openModal }: { event: any; openModal: () => void }) => {
    if (!event.target.classList[0]?.includes("checkbox")) {
      openModal();
    }
  };

  if (props.isLoading) {
    return (
      <div style={{ marginTop: "1rem" }}>
        <DataTableSkeleton
          className={cx(`${prefix}--skeleton`, `${prefix}--data-table`, styles.tableSkeleton)}
          rowCount={5}
          columnCount={headerList.length}
          headers={headerList.map((header) => header.header)}
        />
      </div>
    );
  }

  const {
    pageable: { number, size, sort, totalElements },
    records,
  } = props.tableData;
  const {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableHeader,
    TableSelectAll,
    TableSelectRow,
  } = DataTable;

  const getSelectedActions = (actionId?: string) => {
    return actionId
      ? records.filter((action: Action) => action.id === actionId)
      : records.filter((action: Action) =>
          selectedActions.some((selectedAction: string) => selectedAction === action.id)
        );
  };

  return (
    <section>
      <div className={styles.tableContainer}>
        {totalElements > 0 ? (
          <>
            <DataTable
              rows={records}
              headers={headerList}
              render={({ rows, headers, getHeaderProps, getSelectionProps, selectRow, selectedRows }: any) => {
                const onSuccessfulApprovalRejection = async () => {
                  setSelectedActions([]);
                };
                if(!isManual) {
                  rows.forEach((rowItem: any) => {
                    const actionIsSelectedInState =
                      selectedActions.findIndex((actionId) => actionId === rowItem.id) > -1;
                    const actionIsSelectedInTable =
                      selectedRows.findIndex((selectedRowItem: any) => selectedRowItem.id === rowItem.id) > -1;
    
                    if (actionIsSelectedInState !== actionIsSelectedInTable) {
                      selectRow(rowItem.id);
                    }
                  });
                }
  
                return (
                  <TableContainer>
                    {!isManual && (
                      <div className={styles.actions}>
                        <ApproveRejectActions
                          actions={getSelectedActions()}
                          modalTrigger={({ openModal }) => (
                            <Button
                              className={styles.actionButton}
                              disabled={noSelectedActions}
                              kind="danger--ghost"
                              iconDescription="reject-actions"
                              onClick={openModal}
                              renderIcon={CloseOutline16}
                              size="field"
                            >
                              Reject selected
                            </Button>
                          )}
                          onSuccessfulApprovalRejection={onSuccessfulApprovalRejection}
                          queryToRefetch={props.actionsQueryToRefetch}
                          type="reject"
                        />
                        <ApproveRejectActions
                          actions={getSelectedActions()}
                          modalTrigger={({ openModal }) => (
                            <Button
                              className={styles.actionButton}
                              disabled={noSelectedActions}
                              kind="ghost"
                              iconDescription="approve-actions"
                              onClick={openModal}
                              renderIcon={CheckmarkOutline16}
                              size="field"
                            >
                              Approve selected
                            </Button>
                          )}
                          onSuccessfulApprovalRejection={onSuccessfulApprovalRejection}
                          queryToRefetch={props.actionsQueryToRefetch}
                          type="approve"
                        />
                      </div>
                    )}
                    <Table isSortable>
                      <TableHead>
                        <TableRow>
                        {!isManual && (
                          <TableSelectAll
                            {...getSelectionProps({
                              onClick: () => {
                                handleOnClickCheckbox(records.filter((item: Action) => item.status === ApprovalStatus.Submitted).map((item: Action) => item.id));
                              },
                            })}
                          />
                        )}
                          {headers.map((header: any) => (
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
                        {rows.map((row: any) => {
                          const currentAction = records.find(
                            (action: Action) => action.id === row.id
                          );
                          const isAlreadyApproved =
                            user?.id && currentAction?.submittedApproversUserIds?.includes(user.id);
                          return isManual ? (
                            <TableRow
                              key={row.id}
                              className={`${styles.tableRow} ${styles[row.cells[row.cells.length - 1].value]}`}
                              data-testid="configuration-property-table-row"
                            >
                              {row.cells.map((cell: any, cellIndex: number) => (
                                <TableCell key={cell.id}>
                                  <div className={styles.tableCell}>{renderCell(headerList, cellIndex, cell.value)}</div>
                                </TableCell>
                              ))}
                            </TableRow>
                          ) : (
                            <ApproveRejectActions
                              actions={getSelectedActions(row.id)}
                              modalTrigger={({ openModal }: any) => (
                                <TableRow
                                  key={row.id}
                                  className={`${styles.tableRow} ${styles[row.cells[row.cells.length - 1].value]}`}
                                  data-testid="configuration-property-table-row"
                                  onClick={(event: any) => handleApprovalRowClick({ event, openModal })}
                                  onKeyDown={(event: any) => isAccessibleKeyboardEvent(event) && handleApprovalRowClick({ event, openModal })}
                                  tabIndex={0}
                                >
                                  {!isManual && (
                                    <TableSelectRow
                                      {...getSelectionProps({
                                        row,
                                        onClick: (e: any) => {
                                          e.stopPropagation();
                                          handleOnClickCheckbox(row.id);
                                        },
                                      })}
                                      disabled={row.cells[5].value !== ApprovalStatus.Submitted}
                                    />
                                  )}
                                  {row.cells.map((cell: any, cellIndex: number) => (
                                    <TableCell key={cell.id}>
                                      <div className={styles.tableCell}>{renderCell(headerList, cellIndex, cell.value)}</div>
                                    </TableCell>
                                  ))}
                                </TableRow>
                              )}
                              onSuccessfulApprovalRejection={onSuccessfulApprovalRejection}
                              queryToRefetch={props.actionsQueryToRefetch}
                              type="single"
                              isAlreadyApproved={isAlreadyApproved}
                              userCanApprove={
                                currentAction?.inputRequired === ApprovalInputRequired.Required ||
                                currentAction?.inputRequired === ApprovalInputRequired.Optional
                              }
                            />
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )
              }}
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
              headers={headerList}
              render={({ headers }: any) => (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow className={styles.tableHeadRow}>
                        {headers.map((header: any) => (
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
            <EmptyState
              message={null} 
              title={isManual ? "No manual tasks found" : "No approvals found"}
            />
          </>
        )}
      </div>
    </section>
  );
}

export default ActionsTable;
