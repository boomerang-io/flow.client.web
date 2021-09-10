import React from "react";
// @ts-ignore
import cx from "classnames";
import { settings } from "carbon-components";
import { useMutation, queryCache } from "react-query";
import sortBy from "lodash/sortBy";
import {
  Button,
  ComboBox,
  ConfirmModal,
  DataTable,
  DataTableSkeleton,
  Error404,
  ErrorMessage,
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
  notify,
  SearchSkeleton,
  ToastNotification,
} from "@boomerang-io/carbon-addons-boomerang-react";
import CreateEditGroupModal from "./CreateEditGroupModal";
import NoTeamsRedirectPrompt from "Components/NoTeamsRedirectPrompt";
import { formatErrorMessage, sortByProp } from "@boomerang-io/utils";
import { sortKeyDirection } from "Utils/arrayHelper";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { FlowTeam, ApproverGroup, Approver } from "Types";
import { Delete16 } from "@carbon/icons-react";
import styles from "./approverGroupsTable.module.scss";

const { prefix } = settings;

const FeatureLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header
        className={styles.header}
        header={
          <>
            <HeaderTitle className={styles.headerTitle}>Team Approvers</HeaderTitle>
            <HeaderSubtitle>Manage groups of users to easily set gate approvers.</HeaderSubtitle>
          </>
        }
      />
      <div className={styles.tableContainer}>{children}</div>
    </>
  );
};

type ApproverGroupsTableProps = {
  activeTeam?: FlowTeam | null;
  approverGroups?: ApproverGroup[];
  setActiveTeam: (args: FlowTeam) => any;
  teams: FlowTeam[];
  userCanEdit: boolean;
  isLoading: boolean;
  error: any;
};

function ApproverGroupsTable({
  activeTeam,
  approverGroups = [],
  setActiveTeam,
  teams,
  userCanEdit,
  isLoading,
  error,
}: ApproverGroupsTableProps) {
  const [sortKey, setSortKey] = React.useState("groupName");
  const [sortDirection, setSortDirection] = React.useState("ASC");

  /** Delete Team Approver Group */
  const [deleteApproverGroupMutation] = useMutation(resolver.deleteApproverGroup, {
    onSuccess: () => queryCache.invalidateQueries(serviceUrl.resourceApproverGroups({ teamId: activeTeam?.id, groupId: undefined })),
  });

  const headers = [
    {
      header: "Group name",
      key: "groupName",
      sortable: true,
    },
    {
      header: "# of users",
      key: "approvers",
      sortable: true,
    },
    {
      header: "",
      key: "actions",
      sortable: false,
    },
  ];

  const deleteApproverGroup = async (approverGroup: ApproverGroup) => {
    try {
      await deleteApproverGroupMutation({ teamId: activeTeam?.id, groupId: approverGroup.groupId });
      notify(
        <ToastNotification
          kind="success"
          title={"Approver Group Deleted"}
          subtitle={`Request to delete ${approverGroup.groupName} succeeded`}
          data-testid="delete-approver-group-notification"
        />
      );
    } catch (err) {
      const errorMessages = formatErrorMessage({ error: err, defaultMessage: "Delete Approver Group Failed" });
      notify(
        <ToastNotification
          kind="error"
          title={errorMessages.title}
          subtitle={errorMessages.message}
          data-testid="delete-approver-group-notification"
        />
      );
    }
  };

  const renderCell = (groupId: string, cellIndex: number, value: any) => {
    const approverGroup: ApproverGroup = approverGroups.find((group) => group.groupId === groupId) ?? {
      groupName: "",
      groupId: "",
      approvers: [],
    };
    const column = headers[cellIndex];
    switch (column.key) {
      case "groupName":
        return <p className={styles.text}>{value}</p>;
      case "approvers":
        return <p className={styles.text}>{value?.length ?? "0"}</p>;
      case "actions":
        return userCanEdit ? (
          <div className={styles.actionsContainer}>
            <CreateEditGroupModal
              isEdit
              approverGroup={approverGroup}
              approverGroups={approverGroups}
              team={activeTeam}
            />
            <ConfirmModal
              modalTrigger={({ openModal }: any) => (
                <Button
                  className={styles.deleteButton}
                  onClick={openModal}
                  kind="danger-ghost"
                  renderIcon={Delete16}
                  size="small"
                  iconDescription="Delete approver group"
                  data-testid="delete-approver-group"
                />
              )}
              affirmativeAction={() => deleteApproverGroup(approverGroup)}
              negativeText={`Cancel`}
              affirmativeText={`Delete`}
              affirmativeButtonProps={{ kind: "danger" }}
              title={`Delete group`}
            >
              <div style={{ width: "calc(100% - 6.5rem)" }}>
                <p>
                  If this group is set as an approver for any gate, it will be removed, and the group members will no
                  longer be approvers for the gate.
                </p>
                <p style={{ marginTop: "2rem" }}>{`Are you sure you’d like to delete ${approverGroup.groupName}?`}</p>
              </div>
            </ConfirmModal>
          </div>
        ) : null;
      default:
        return value || "---";
    }
  };

  const renderSubRow = (row: any) => {
    const rowData: any = approverGroups.find((group) => group.groupId === row.id);
    return (
      <div className={styles.expanded}>
        {rowData?.approvers &&
          sortBy(rowData.approvers, ["userName"]).map((approver: Approver) => (
            <div className={styles.expandedSection}>
              <p className={styles.expandedUsername}>{approver.userName}</p>
              <p className={styles.expandedEmail}>{approver.userEmail}</p>
            </div>
          ))}
      </div>
    );
  };

  const handleSort = (e: any, { sortHeaderKey }: { sortHeaderKey: string }) => {
    const order = sortDirection === "ASC" ? "DESC" : "ASC";
    setSortKey(sortHeaderKey);
    setSortDirection(order);
  };

  const {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableHeader,
    TableExpandHeader,
    TableExpandRow,
    TableExpandedRow,
  } = DataTable;
  const totalItems = approverGroups?.length;

  if (isLoading) {
    return (
      <FeatureLayout>
        <SearchSkeleton style={{ marginBottom: "1rem", marginTop: "-1rem" }} />
        <DataTableSkeleton
          data-testid="team-props-loading-skeleton"
          className={cx(`${prefix}--skeleton`, `${prefix}--data-table`, styles.tableSkeleton)}
          rowCount={3}
          columnCount={headers.length}
          headers={headers.map((header) => header.header)}
        />
      </FeatureLayout>
    );
  }

  if (error) {
    return (
      <FeatureLayout>
        <ErrorMessage />
      </FeatureLayout>
    );
  }

  return (
    <FeatureLayout>
      {teams.length === 0 ? (
        <NoTeamsRedirectPrompt />
      ) : (
        <>
          <div className={styles.dropdown}>
            <ComboBox
              id="team-approver-groups-select"
              initialSelectedItem={activeTeam?.id ? activeTeam : null}
              items={sortByProp(teams, "name")}
              itemToString={(item: { name: string }) => item?.name ?? ""}
              label="Teams"
              onChange={({ selectedItem }: { selectedItem: FlowTeam }) => {
                selectedItem && setActiveTeam(selectedItem);
              }}
              placeholder="Select a team"
              shouldFilterItem={({ item, inputValue }: { item: any; inputValue: string }) =>
                item?.name?.toLowerCase()?.includes(inputValue.toLowerCase())
              }
            />
          </div>
          <div className={styles.tableHeader}>
            <div>
              <h2 className={styles.title}>{`Approver groups (${approverGroups?.length ?? 0})`}</h2>
              <p className={styles.description}>
                Create groups of users to be able to set the entire group as approvers for a gate
              </p>
            </div>
            {userCanEdit && (activeTeam || totalItems > 0) && (
              <CreateEditGroupModal approverGroups={approverGroups} team={activeTeam} />
            )}
          </div>

          {totalItems > 0 ? (
            <DataTable
              rows={sortKeyDirection({
                array: approverGroups.map((group) => ({ ...group, id: group.groupId })),
                sortKey,
                sortDirection,
              })}
              sortRow={(rows: any) => rows}
              headers={headers}
              render={({ rows, headers, getHeaderProps, getRowProps }: any) => (
                <TableContainer>
                  <Table isSortable>
                    <TableHead>
                      <TableRow className={styles.tableHeadRow}>
                        <TableExpandHeader />
                        {headers.map((header: any, key: any) => (
                          <TableHeader
                            id={header.key}
                            key={`mode-table-key-${key}`}
                            {...getHeaderProps({
                              header,
                              className: `${styles.tableHeadHeader} ${styles[header.key]}`,
                              onClick: handleSort,
                              isSortable: header.sortable,
                            })}
                          >
                            {header.header}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody className={styles.tableBody}>
                      {rows.map((row: any) => {
                        return (
                          <React.Fragment key={row.id}>
                            <TableExpandRow {...getRowProps({ row })} className={styles.tableRow}>
                              {row.cells.map((cell: any, cellIndex: any) => (
                                <TableCell key={cell.id} style={{ padding: "0" }}>
                                  <div className={styles.tableCell}>{renderCell(row.id, cellIndex, cell.value)}</div>
                                </TableCell>
                              ))}
                            </TableExpandRow>
                            <TableExpandedRow colSpan={headers.length + 1}>{renderSubRow(row)}</TableExpandedRow>
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            />
          ) : (
            <>
              <DataTable
                rows={approverGroups}
                headers={headers}
                render={({ headers }: any) => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow className={styles.tableHeadRow}>
                          {headers.map((header: any, key: any) => (
                            <TableHeader
                              key={`no-team-config-table-key-${key}`}
                              className={`${styles.tableHeadHeader} ${styles[header.key]}`}
                            >
                              <span className="bx--table-header-label">{header.header}</span>
                            </TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                    </Table>
                  </TableContainer>
                )}
              />
              <Error404 header={null} title="No approver groups" theme="boomerang" />
            </>
          )}
        </>
      )}
    </FeatureLayout>
  );
}

export default ApproverGroupsTable;
