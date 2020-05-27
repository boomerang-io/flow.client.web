import React from "react";
import PropTypes from "prop-types";
import { DataTable } from "@boomerang/carbon-addons-boomerang-react";
import { NoDisplay } from "@boomerang/carbon-addons-boomerang-react";
import styles from "./propertiesTable.module.scss";

function PropertiesTable({ data: properties }) {
  const headers = [
    { header: "Property", key: "key" },
    { header: "Value", key: "value" },
  ];

  const renderCell = (cellIndex, value) => {
    const column = headers[cellIndex];

    switch (column.header) {
      case "Value":
        return <code className={styles.code}>{value || "---"}</code>;
      default:
        return <p className={styles.tableTextarea}>{value || "---"}</p>;
    }
  };

  const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;

  return (
    <div className={styles.tableContainer}>
      {properties && properties.length > 0 ? (
        <DataTable
          rows={properties}
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
                          header,
                          className: `${styles.tableHeadHeader} ${styles[header.key]}`,
                        })}
                      >
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody className={styles.tableBody}>
                  {rows.map((row) => (
                    <TableRow key={row.id} className={styles.tableRow}>
                      {row.cells.map((cell, cellIndex) => (
                        <TableCell key={cell.id} style={{ padding: "0" }}>
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
      ) : (
        <NoDisplay text="No properties to display" />
      )}
    </div>
  );
}

PropertiesTable.propTypes = {
  data: PropTypes.array.isRequired,
};

export default PropertiesTable;
