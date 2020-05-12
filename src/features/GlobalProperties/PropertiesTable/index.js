import React, { Component, Fragment } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import matchSorter from "match-sorter";
import { DataTable, Search, Pagination } from "carbon-components-react";
import { notify, ToastNotification, NoDisplay } from "@boomerang/carbon-addons-boomerang-react";
import CreateEditPropertiesModal from "./CreateEditPropertiesModal";
import ActionsMenu from "./ActionsMenu";
import Header from "Components/Header";
import CheckIcon from "@carbon/icons-react/lib/checkmark/32";
import CloseIcon from "@carbon/icons-react/lib/close/32";
import { arrayPagination } from "Utilities/arrayHelper";
import { stringToPassword } from "Utilities/stringHelper";
import INPUT_TYPES from "Constants/inputTypes";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import styles from "./propertiesTable.module.scss";

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZES = [DEFAULT_PAGE_SIZE, 25, 50];

class PropertiesTable extends Component {
  static propTypes = {
    addPropertyInStore: PropTypes.func.isRequired,
    deletePropertyInStore: PropTypes.func.isRequired,
    properties: PropTypes.array,
    updatePropertyInStore: PropTypes.func.isRequired
  };

  state = {
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    properties: this.props.properties,
    sort: {
      key: "label",
      sortDirection: "ASC"
    }
  };

  headers = [
    {
      header: "Label",
      key: "label"
    },
    {
      header: "Key",
      key: "key"
    },
    {
      header: "Description",
      key: "description"
    },
    {
      header: "Value",
      key: "value"
    },
    {
      header: "Secured",
      key: "secured"
    },
    {
      header: "Actions",
      key: "actions "
    }
  ];

  /* Standard table configuration after search or service call */
  resetTableWithNewProperties = properties => {
    const { page, pageSize } = this.state;
    const newPage = page !== 1 && properties.length < pageSize * (page - 1) + 1 ? page - 1 : page;
    this.setState({ page: newPage, properties });
  };

  addPropertyInStore = property => {
    this.props.addPropertyInStore(property);
    const newProperties = [...this.state.properties, property];
    this.resetTableWithNewProperties(newProperties);
  };

  deletePropertyInStore = propertyId => {
    this.props.deletePropertyInStore(propertyId);
    const properties = [...this.state.properties];
    const newProperties = properties.filter(property => property.id !== propertyId);
    this.resetTableWithNewProperties(newProperties);
  };

  updatePropertyInStore = updatedProperty => {
    this.props.updatePropertyInStore(updatedProperty);
    const properties = [...this.state.properties];
    const newProperties = properties.map(property => (property.id === updatedProperty.id ? updatedProperty : property));
    this.resetTableWithNewProperties(newProperties);
  };

  deleteProperty = property => {
    axios
      .delete(`${BASE_SERVICE_URL}/config/${property.id}`)
      .then(response => {
        this.deletePropertyInStore(property.id);
        notify(
          <ToastNotification
            kind="success"
            title={"Property Deleted"}
            subtitle={`Request to delete ${property.label} succeeded`}
          />
        );
      })
      .catch(error => {
        notify(<ToastNotification kind="error" title={"Delete Property Failed"} subtitle={"Something went wrong"} />);
      });
  };

  handleSearchChange = e => {
    const searchQuery = e.target.value;
    const { properties } = this.props;

    const newProperties = searchQuery
      ? matchSorter(properties, searchQuery, { keys: ["label", "key", "description"] })
      : properties;

    this.resetTableWithNewProperties(newProperties);
  };

  handlePaginationChange = ({ page, pageSize }) => {
    this.setState({ page, pageSize });
  };

  renderCell = (propertyId, cellIndex, value) => {
    const property = this.props.properties.find(property => property.id === propertyId);
    const column = this.headers[cellIndex];

    switch (column.header) {
      case "Value":
        const determineValue = value
          ? property && property.type === INPUT_TYPES.PASSWORD
            ? stringToPassword(value)
            : value
          : "---";
        return <p className={styles.tableTextarea}>{determineValue}</p>;
      case "Secured":
        return property && property.type === INPUT_TYPES.PASSWORD ? (
          <CheckIcon alt="secured" className={`${styles.tableSecured} ${styles.secured}`} />
        ) : (
          <CloseIcon alt="unsecured" className={`${styles.tableSecured} ${styles.unsecured}`} />
        );
      case "Actions":
        return (
          <ActionsMenu
            flipped
            addPropertyInStore={this.addPropertyInStore}
            deleteProperty={this.deleteProperty}
            property={property}
            properties={this.props.properties}
            updatePropertyInStore={this.updatePropertyInStore}
          />
        );
      default:
        return <p className={styles.tableTextarea}>{value || "---"}</p>;
    }
  };

  handleSort = (valueA, valueB, config) => {
    this.setState({ sort: config });
  };

  render() {
    const { page, pageSize, properties, sort } = this.state;
    const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;

    const totalItems = properties.length;

    return (
      <>
        <Header title="Properties" description="Set global properties that are available for all Workflows" />
        <div className={styles.tableContainer}>
          <div className={styles.header}>
            <Search
              className={styles.search}
              id="properties-table-search"
              labelText="Search"
              placeHolderText="Search"
              onChange={this.handleSearchChange}
            />
            <CreateEditPropertiesModal
              addPropertyInStore={this.addPropertyInStore}
              properties={this.props.properties}
              updatePropertyInStore={this.updatePropertyInStore}
            />
          </div>
          {totalItems > 0 ? (
            <>
              <DataTable
                rows={arrayPagination(properties, page, pageSize, sort)}
                sortRow={this.handleSort}
                headers={this.headers}
                render={({ rows, headers, getHeaderProps }) => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {headers.map(header => (
                            <TableHeader
                              id={header.key}
                              key={header.key}
                              {...getHeaderProps({
                                header,
                                className: `${styles.tableHeadHeader} ${styles[header.key]}`
                              })}
                            >
                              {header.header}
                            </TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody className={styles.tableBody}>
                        {rows.map(row => (
                          <TableRow key={row.id} data-testid="configuration-property-table-row">
                            {row.cells.map((cell, cellIndex) => (
                              <TableCell key={cell.id} style={{ padding: "0" }}>
                                <div className={styles.tableCell}>{this.renderCell(row.id, cellIndex, cell.value)}</div>
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
            <Fragment>
              <DataTable
                rows={properties}
                headers={this.headers}
                render={({ headers }) => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {headers.map(header => (
                            <TableHeader id={header.key} key={header.key}>{header.header}</TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                    </Table>
                  </TableContainer>
                )}
              />
              <NoDisplay
                textLocation="below"
                text={
                  this.props.properties.length > 0
                    ? "No properties found"
                    : "Looks like there aren't any properties. Create one above!"
                }
                style={{ marginTop: "5rem", height: "30rem" }}
              />
            </Fragment>
          )}
        </div>
      </>
    );
  }
}

export default PropertiesTable;
