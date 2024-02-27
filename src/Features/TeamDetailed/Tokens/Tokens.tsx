import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Helmet } from "react-helmet";
import { notify, ToastNotification, TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import { serviceUrl, resolver } from "Config/servicesConfig";
import queryString from "query-string";
import moment from "moment";
import cx from "classnames";
import { Box } from "reflexbox";
import { DataTable, DataTableSkeleton, Pagination, InlineNotification } from "@carbon/react";
import { ErrorMessage } from "@boomerang-io/carbon-addons-boomerang-react";
import EmptyState from "Components/EmptyState";
import DeleteToken from "Components/DeleteToken";
import CreateToken from "Components/CreateToken";
import { arrayPagination, sortByProp } from "Utils/arrayHelper";
import { Help } from "@carbon/react/icons";
import type { FlowTeam, Token } from "Types";
import { TokenType } from "Constants";
import styles from "./tokens.module.scss";

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZES = [DEFAULT_PAGE_SIZE, 20, 50, 100];
const HEADERS = [
  {
    header: "Name",
    key: "name",
    sortable: true,
  },
  {
    header: "Status",
    key: "valid",
    sortable: true,
  },
  {
    header: "Description",
    key: "description",
    sortable: true,
  },
  {
    header: "Date Created",
    key: "creationDate",
    sortable: true,
  },
  {
    header: "Expires (UTC)",
    key: "expirationDate",
    sortable: true,
  },
  {
    header: "Permissions",
    key: "permissions",
    sortable: true,
  },
  {
    header: "",
    key: "delete",
    sortable: false,
  },
];

function Tokens({ team, canEdit }: { team: FlowTeam; canEdit: boolean }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState("creationDate");
  const [sortDirection, setSortDirection] = useState("DESC");

  const getTokensUrl = serviceUrl.getTokens({
    query: queryString.stringify({ types: "team", principals: team?.name }),
  });

  const {
    data: tokensData,
    error: tokensError,
    isLoading: tokensIsLoading,
  } = useQuery({
    queryKey: getTokensUrl,
    queryFn: resolver.query(getTokensUrl),
    enabled: Boolean(team?.name),
  });

  const { mutateAsync: deleteTokenMutator } = useMutation(resolver.deleteToken, {
    onSuccess: () => queryClient.invalidateQueries([getTokensUrl]),
  });

  if (tokensIsLoading) {
    return (
      <DataTableSkeleton
        data-testid="token-loading-skeleton"
        className={cx(`cds--skeleton`, `cds--data-table`, styles.tableSkeleton)}
        rowCount={DEFAULT_PAGE_SIZE}
        columnCount={HEADERS.length}
        headers={HEADERS.map((header) => header.header)}
      />
    );
  }

  if (tokensError) {
    return <ErrorMessage />;
  }

  const deleteToken = async (tokenId: string) => {
    try {
      await deleteTokenMutator({ tokenId });
      notify(<ToastNotification kind="success" title="Delete Team Token" subtitle={`Token successfully deleted`} />);
    } catch (error) {
      notify(<ToastNotification kind="error" title="Something's Wrong" subtitle="Request to delete token failed" />);
    }
  };

  const renderCell = (tokenItemId: string, cellIndex: number, value: string) => {
    const tokenDetails = tokensData?.content.find((token: Token) => token.id === tokenItemId);
    const column = HEADERS[cellIndex];
    switch (column.key) {
      case "permissions":
        return <p className={styles.tableTextarea}>{value ? tokenDetails.permissions.join(", ") : "---"}</p>;
      case "valid":
        return <p className={styles.tableTextarea}>{value ? "Active" : "Inactive"}</p>;
      case "creationDate":
      case "expirationDate":
        return (
          <p className={styles.tableTextarea}>
            {value ? moment(value).utc().startOf("day").format("MMMM DD, YYYY") : "---"}
          </p>
        );
      case "delete":
        return tokenDetails && tokenDetails.id ? (
          <DeleteToken tokenItem={tokenDetails} deleteToken={deleteToken} />
        ) : (
          ""
        );
      default:
        return <p className={styles.tableTextarea}>{value || "---"}</p>;
    }
  };

  const handlePaginationChange = ({ page, pageSize }: { page: number; pageSize: number }) => {
    setPage(page);
    setPageSize(pageSize);
  };

  function handleSort(e: any, { sortHeaderKey }: { sortHeaderKey: string }) {
    const order = sortDirection === "ASC" ? "DESC" : "ASC";
    setSortKey(sortHeaderKey);
    setSortDirection(order);
  }

  const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;

  return (
    <section aria-label={`${team.displayName} Team Tokens`} className={styles.container}>
      <Helmet>
        <title>{`Tokens - ${team.displayName}`}</title>
      </Helmet>
      <>
        {!canEdit ? (
          <section className={styles.notificationsContainer}>
            <InlineNotification
              lowContrast
              hideCloseButton={true}
              kind="info"
              title="Read-only"
              subtitle="The team may be inactive or you don’t have the necessary permissions. You can still see what’s going on behind the
              scenes."
            />
          </section>
        ) : null}
        <div className={styles.buttonContainer}>
          {team && <CreateToken type={TokenType.Team} principal={team.name} getTokensUrl={getTokensUrl} disabled={!canEdit}/>}
        </div>
        {tokensData?.content?.length > 0 ? (
          <>
            <DataTable
              rows={arrayPagination(tokensData?.content, page, pageSize, sortKey, sortDirection)}
              sortRow={(rows: any) => sortByProp(rows, sortKey, sortDirection.toLowerCase())}
              headers={HEADERS}
              render={({
                rows,
                headers,
                getHeaderProps,
              }: {
                rows: any;
                headers: Array<{ header: string; key: string; sortable: boolean }>;
                getHeaderProps: any;
              }) => (
                <TableContainer>
                  <Table isSortable>
                    <TableHead>
                      <TableRow className={styles.tableHeadRow}>
                        {headers.map((header: { header: string; key: string; sortable: boolean }) => (
                          <TableHeader
                            id={header.key}
                            {...getHeaderProps({
                              header,
                              className: `${styles.tableHeadHeader} ${styles[header.key]}`,
                              isSortable: header.sortable,
                              onClick: handleSort,
                            })}
                            isSortHeader={sortKey === header.key}
                            sortDirection={sortDirection}
                          >
                            {header.header === "Permissions" ? (
                              <div className={styles.headerWithIcon}>
                                {header.header}
                                <TooltipHover
                                  direction="top"
                                  tooltipText="Permissions in the format SCOPE / PRINCIPAL / ACTION. Read more about permissions in the documentation."
                                >
                                  <Help className={styles.headerHoverIcon} />
                                </TooltipHover>
                              </div>
                            ) : (
                              header.header
                            )}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody className={styles.tableBody}>
                      {rows.map((row: any) => (
                        <TableRow key={row.id}>
                          {row.cells.map((cell: any, cellIndex: number) => (
                            <TableCell key={cell.id} style={{ padding: "0" }}>
                              <div className={styles.tableCell}>{renderCell(row.id, cellIndex, cell.value)}</div>
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
              page={page}
              pageSize={pageSize}
              pageSizes={PAGE_SIZES}
              totalItems={tokensData?.content?.length}
            />
          </>
        ) : (
          <Box maxWidth="20rem" margin="0 auto">
            <EmptyState title="No tokens found" />
          </Box>
        )}
      </>
    </section>
  );
}

export default Tokens;
