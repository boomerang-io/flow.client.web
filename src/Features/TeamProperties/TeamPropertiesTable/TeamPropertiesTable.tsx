import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Box } from "reflexbox";
import { DataTable, Pagination, DataTableSkeleton } from "@carbon/react";
import {
  ComboBox,
  Error,
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
  notify,
  ToastNotification,
} from "@boomerang-io/carbon-addons-boomerang-react";
import CreateEditTeamPropertiesModal from "./CreateEditTeamPropertiesModal";
import ActionsMenu from "./ActionsMenu";
import EmptyState from "Components/EmptyState";
import NoTeamsRedirectPrompt from "Components/NoTeamsRedirectPrompt";
import WombatMessage from "Components/WombatMessage";
import { InputType, PASSWORD_CONSTANT } from "Constants";
import { formatErrorMessage, sortByProp } from "@boomerang-io/utils";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { FlowTeam, Property } from "Types";
import { Checkmark, Close } from "@carbon/react/icons";
import styles from "./teamPropertiesTable.module.scss";

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZES = [DEFAULT_PAGE_SIZE, 25, 50];
const headers = [
  {
    header: "Label",
    key: "label",
    sortable: true,
  },
  {
    header: "Key",
    key: "key",
    sortable: true,
  },
  {
    header: "Description",
    key: "description",
    sortable: true,
  },
  {
    header: "Value",
    key: "value",
    sortable: true,
  },
  {
    header: "Secured",
    key: "secured",
    sortable: true,
  },
  {
    header: "",
    key: "actions",
  },
];

interface TeamPropertiesTableProps {
  activeTeam: FlowTeam;
  properties: Property[];
  propertiesAreLoading: boolean;
  propertiesError: any;
  setActiveTeam(args: FlowTeam): void;
  teams: FlowTeam[];
}

const TeamPropertiesTable: React.FC<TeamPropertiesTableProps> = ({
  activeTeam,
  properties,
  propertiesAreLoading,
  propertiesError,
  setActiveTeam,
  teams,
}) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const teamPropertiesUrl = serviceUrl.getTeamProperties({ id: activeTeam?.id });

  /** Delete Team Property */
  const { mutateAsync: deleteTeamPropertyMutation } = useMutation(resolver.deleteTeamPropertyRequest, {
    onSuccess: () => queryClient.invalidateQueries([teamPropertiesUrl]),
  });

  const deleteTeamProperty = async (component: Property) => {
    try {
      await deleteTeamPropertyMutation({ teamId: activeTeam.id, configurationId: component.id });
      notify(
        <ToastNotification
          kind="success"
          title={"Team Configuration Deleted"}
          subtitle={`Request to delete ${component.label} succeeded`}
          data-testid="delete-team-prop-notification"
        />
      );
    } catch (err) {
      const errorMessages = formatErrorMessage({ error: err, defaultMessage: "Delete Configuration Failed" });
      notify(
        <ToastNotification
          kind="error"
          title={errorMessages.title}
          subtitle={errorMessages.message}
          data-testid="delete-team-prop-notification"
        />
      );
    }
  };

  const handlePaginationChange = ({ page, pageSize }: { page: number; pageSize: number }) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const renderCell = (propertyId: string, cellIndex: number, value: any) => {
    const property = properties.find((property) => property.id === propertyId)!;
    const column = headers[cellIndex];
    switch (column.key) {
      case "value":
        const determineValue = value
          ? property && property.type === InputType.Password
            ? PASSWORD_CONSTANT
            : value
          : "---";
        return <p className={styles.tableTextarea}>{determineValue}</p>;
      case "secured":
        return property && property.type === InputType.Password ? (
          <Checkmark size={32} alt="secured" className={`${styles.tableSecured} ${styles.secured}`} />
        ) : (
          <Close size={32} alt="unsecured" className={`${styles.tableSecured} ${styles.unsecured}`} />
        );
      case "actions":
        return (
          <ActionsMenu
            team={activeTeam}
            property={property}
            properties={properties}
            deleteTeamProperty={deleteTeamProperty}
          />
        );
      default:
        return value || "---";
    }
  };

  const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;
  const totalItems = properties.length;
  const tableData = properties.map((p, index) => ({ ...p, id: index }));

  return (
    <>
      <Header
        className={styles.header}
        includeBorder={false}
        header={
          <>
            <HeaderTitle className={styles.headerTitle}>Team Parameters</HeaderTitle>
            <HeaderSubtitle>
              Set team-level parameters that are accessible to all workflows owned by the team.
            </HeaderSubtitle>
          </>
        }
      />
      {teams.length === 0 ? (
        <NoTeamsRedirectPrompt />
      ) : (
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <div className={styles.dropdown}>
              <ComboBox
                data-testid="team-parameters-combobox"
                id="team-parameters-select"
                initialSelectedItem={activeTeam?.id ? activeTeam : null}
                items={sortByProp(teams, "name")}
                itemToString={(item: { name: string }) => item?.name ?? ""}
                label="Teams"
                onChange={({ selectedItem }: { selectedItem: FlowTeam }) => {
                  setActiveTeam(selectedItem);
                }}
                placeholder="Select a team"
              />
            </div>
            {(activeTeam?.id || totalItems > 0) && (
              <CreateEditTeamPropertiesModal properties={properties} team={activeTeam} />
            )}
          </div>
          {propertiesAreLoading ? (
            <DataTableSkeleton />
          ) : propertiesError ? (
            <Error />
          ) : totalItems > 0 ? (
            <>
              <DataTable
                rows={tableData}
                headers={headers}
                render={({ rows, headers, getHeaderProps }: { rows: any; headers: any; getHeaderProps: any }) => (
                  <TableContainer>
                    <Table isSortable>
                      <TableHead>
                        <TableRow className={styles.tableHeadRow}>
                          {headers.map((header: any, key: any) => (
                            <TableHeader
                              key={`mode-table-key-${key}`}
                              {...getHeaderProps({
                                className: `${styles.tableHeadHeader} ${styles[header.key]}`,
                                header,
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
                            <TableRow key={row.id}>
                              {row.cells.map((cell: any, cellIndex: number) => (
                                <TableCell key={cell.id}>
                                  <div className={styles.tableCell}>{renderCell(row.id, cellIndex, cell.value)}</div>
                                </TableCell>
                              ))}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              />
              <Pagination
                onChange={handlePaginationChange}
                page={page}
                pageSize={pageSize}
                pageSizes={PAGE_SIZES}
                totalItems={totalItems}
              />
            </>
          ) : (
            <>
              {activeTeam ? (
                <EmptyState title="No team parameters" message={null} />
              ) : (
                <Box maxWidth="20rem" margin="0 auto">
                  <WombatMessage title="Select a team" />
                </Box>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default TeamPropertiesTable;
