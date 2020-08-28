import React, { useState } from "react";
import PropTypes from "prop-types";
import matchSorter from "match-sorter";
import { useMutation, queryCache } from "react-query";
import { DataTable, Search, Pagination } from "@boomerang-io/carbon-addons-boomerang-react";
import { Error404, notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import ActionsMenu from "./ActionsMenu";
import CreateEditPropertiesModal from "./CreateEditPropertiesModal";
import Header from "Components/Header";
import { stringToPassword } from "Utils/stringHelper";
import { InputType } from "Constants";
import { formatErrorMessage } from "@boomerang-io/utils";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { Checkmark32, Close32 } from "@carbon/icons-react";
import styles from "./propertiesTable.module.scss";

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZES = [DEFAULT_PAGE_SIZE, 25, 50];

const configUrl = serviceUrl.getGlobalConfiguration();

function PropertiesTable({ properties }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [searchQuery, setSearchQuery] = useState("");

  /** Delete Property */
  const [deleteGlobalPropertyMutation] = useMutation(resolver.deleteGlobalPropertyRequest, {
    onSuccess: () => queryCache.invalidateQueries(configUrl),
  });

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

  const deleteProperty = async (property) => {
    try {
      await deleteGlobalPropertyMutation({ id: property.id });
      notify(
        <ToastNotification
          kind="success"
          title={"Property Deleted"}
          subtitle={`Request to delete ${property.label} succeeded`}
          data-testid="delete-prop-notification"
        />
      );
    } catch (err) {
      const errorMessages = formatErrorMessage({
        error: err,
        defaultMessage: "Delete Property Failed",
      });
      notify(
        <ToastNotification
          kind="error"
          title={errorMessages.title}
          subtitle={errorMessages.message}
          data-testid="delete-prop-notification"
        />
      );
    }
  };

  const handleSearchChange = (e) => {
    const searchQuery = e.target.value;
    setSearchQuery(searchQuery);
  };

  const handlePaginationChange = ({ page, pageSize }) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const renderCell = (propertyId, cellIndex, value) => {
    const property = properties.find((property) => property.id === propertyId);
    const column = headers[cellIndex];

    switch (column.key) {
      case "value":
        const determineValue = value
          ? property && property.type === InputType.Password
            ? stringToPassword(value)
            : value
          : "---";
        return <p className={styles.tableTextarea}>{determineValue}</p>;
      case "secured":
        return property && property.type === InputType.Password ? (
          <Checkmark32 alt="secured" className={`${styles.tableSecured} ${styles.secured}`} />
        ) : (
          <Close32 alt="unsecured" className={`${styles.tableSecured} ${styles.unsecured}`} />
        );
      case "actions":
        return <ActionsMenu deleteProperty={deleteProperty} property={property} properties={properties} />;
      default:
        return <p className={styles.tableTextarea}>{value || "---"}</p>;
    }
  };

  const newProperties = searchQuery
    ? matchSorter(properties, searchQuery, { keys: ["label", "key", "description"] })
    : properties;

  const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;

  const totalItems = newProperties.length;

  return (
    <>
      <Header
        includeBorder
        title="Properties"
        description="Set global properties that are available for all Workflows."
      ></Header>
      <div className={styles.tableContainer}>
        <div className={styles.header}>
          <Search
            className={styles.search}
            id="properties-table-search"
            labelText="Search"
            placeHolderText="Search"
            onChange={handleSearchChange}
          />
          <div className={styles.actions}>
            <CreateEditPropertiesModal properties={properties} />
          </div>
        </div>
        {totalItems > 0 ? (
          <>
            <DataTable
              rows={newProperties}
              headers={headers}
              render={({ rows, headers, getHeaderProps }) => (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow className={styles.tableHeadRow}>
                        {headers.map((header) => (
                          <TableHeader
                            id={header.key}
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
                      {rows.map((row) => (
                        <TableRow key={row.id} data-testid="configuration-property-table-row">
                          {row.cells.map((cell, cellIndex) => (
                            <TableCell key={cell.id}>
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
              totalItems={totalItems}
            />
          </>
        ) : (
          <>
            <DataTable
              rows={newProperties}
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
            <Error404 header={null} title="No properties to be found" message={null} />
          </>
        )}
      </div>
    </>
  );
}

PropertiesTable.propTypes = {
  properties: PropTypes.array,
};

export default PropertiesTable;
