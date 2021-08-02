import React, { useState } from "react";
import moment from "moment";
import cx from "classnames";
import { settings } from "carbon-components";
import {
  ButtonSkeleton,
  DataTable,
  DataTableSkeleton,
  Error404,
  ErrorMessage,
  Pagination,
} from "@boomerang-io/carbon-addons-boomerang-react";
import DeleteToken from "./DeleteToken";
import CreateToken from "./CreateToken";
import Header from "Components/Header";
import { TokensPermissions } from "Config/permissionsConfig";
import { useUserPermissions } from "Hooks";
import { arrayPagination, sortByProp } from "Utils/arrayHelpers";
import styles from "./tokensComponent.module.scss";

const { prefix } = settings;

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZES = [DEFAULT_PAGE_SIZE, 20, 50, 100];

const headers = [
  {
    header: "Created By",
    key: "creatorName",
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
    key: "expiryDate",
    sortable: true,
  },
  {
    header: "",
    key: "delete",
    sortable: false,
  },
];

const FeatureLayout = ({ children }) => {
  return (
    <div className={styles.container}>
      <Header title="Global Tokens" description="" />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

function TokenComponent({ deleteToken, tokens, hasError, isLoading }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState("creationDate");
  const [sortDirection, setSortDirection] = useState("DESC");
  const deleteTokenAvailable = useUserPermissions()[TokensPermissions.deleteToken];

  const renderCell = (tokenItemId, cellIndex, value) => {
    const tokenDetails = tokens.find((token) => token.id === tokenItemId);
    const column = headers[cellIndex];
    switch (column.key) {
      case "creationDate":
      case "expiryDate":
        return (
          <p className={styles.tableTextarea}>
            {value ? moment(value).utc().startOf("day").format("MMMM DD, YYYY") : "---"}
          </p>
        );
      case "delete":
        return tokenDetails && tokenDetails.id && deleteTokenAvailable ? (
          <DeleteToken tokenItem={tokenDetails} deleteToken={deleteToken} />
        ) : (
          ""
        );
      default:
        return <p className={styles.tableTextarea}>{value || "---"}</p>;
    }
  };

  const handlePaginationChange = ({ page, pageSize }) => {
    setPage(page);
    setPageSize(pageSize);
  };

  function handleSort(e, { sortHeaderKey }) {
    const order = sortDirection === "ASC" ? "DESC" : "ASC";
    setSortKey(sortHeaderKey);
    setSortDirection(order);
  }

  const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;

  if (isLoading) {
    return (
      <FeatureLayout>
        <ButtonSkeleton className={styles.buttonSkeleton} small />
        <DataTableSkeleton
          data-testid="token-loading-skeleton"
          className={cx(`${prefix}--skeleton`, `${prefix}--data-table`, styles.tableSkeleton)}
          rowCount={DEFAULT_PAGE_SIZE}
          columnCount={headers.length}
          headers={headers.map((header) => header.header)}
        />
      </FeatureLayout>
    );
  }

  if (hasError) {
    return (
      <FeatureLayout>
        <ErrorMessage />
      </FeatureLayout>
    );
  }

  if (tokens) {
    return (
      <FeatureLayout>
        <div className={styles.tokenContainer}>
          <CreateToken />
        </div>
        {tokens.length > 0 ? (
          <>
            <DataTable
              rows={arrayPagination(tokens, page, pageSize, sortKey, sortDirection)}
              sortRow={(rows) => sortByProp(rows, sortKey, sortDirection.toLowerCase())}
              headers={headers}
              render={({ rows, headers, getHeaderProps }) => (
                <TableContainer>
                  <Table isSortable>
                    <TableHead>
                      <TableRow className={styles.tableHeadRow}>
                        {headers.map((header) => (
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
                            {header.header}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody className={styles.tableBody}>
                      {rows.map((row) => (
                        <TableRow key={row.id} >
                          {row.cells.map((cell, cellIndex) => (
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
              totalItems={tokens.length}
            />
          </>
        ) : (
          <>
            <DataTable
              rows={tokens}
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
            <Error404 title="No global tokens found" header={null} message={null} theme="boomerang" />
          </>
        )}
      </FeatureLayout>
    );
  }

  return null;
}

export default TokenComponent;
