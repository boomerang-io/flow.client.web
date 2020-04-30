import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { DataTable, Pagination, ComboBox } from "carbon-components-react";
import { connect } from "react-redux";
import { notify, ToastNotification } from "@boomerang/carbon-addons-boomerang-react";
import WombatMessage from "Components/WombatMessage";
import CreateEditTeamPropertiesModal from "./CreateEditTeamPropertiesModal";
import ActionsMenu from "./ActionsMenu";
import Header from "Components/Header";
import INPUT_TYPES from "Constants/inputTypes";
import { arrayPagination } from "Utilities/arrayHelper";
import { stringToPassword } from "Utilities/stringHelper";
import { TEAM_PROPERTIES_ID_PROPERTY_ID_URL } from "Config/servicesConfig";
import { Checkmark32, Close32 } from "@carbon/icons-react";
import styles from "./teamPropertiesTable.module.scss";

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZES = [DEFAULT_PAGE_SIZE, 25, 50];

class TeamPropertiesTable extends Component {
  static propTypes = {
    teams: PropTypes.array.isRequired,
    fetchTeamProperties: PropTypes.func.isRequired,
    addTeamPropertyInStore: PropTypes.func.isRequired,
    updateTeamProperty: PropTypes.func.isRequired,
    deleteTeamPropertyInStore: PropTypes.func.isRequired,
    resetTeamProperties: PropTypes.func.isRequired
  };

  state = {
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    teams: this.props.teams,
    currentTeam: "",
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

  fetchTeamPropertiesList = team => {
    if (team) {
      this.setState({ currentTeam: team.id }, () => {
        this.props.fetchTeamProperties(team);
      });
    } else {
      this.setState({ currentTeam: "" }, () => {
        this.props.resetTeamProperties();
      });
    }
  };

  resetTableWithNewTeamProperties = configurations => {
    const { page, pageSize } = this.state;
    const newPage = page !== 1 && configurations.length < pageSize * (page - 1) + 1 ? page - 1 : page;
    this.setState({ page: newPage, configurations });
  };

  addTeamPropertyInStore = config => {
    this.props.addTeamPropertyInStore(config);
    const newConfigurations = [...this.props.teamProperties.data, config];
    this.resetTableWithNewTeamProperties(newConfigurations);
  };

  updateTeamProperty = updatedConfig => {
    this.props.updateTeamProperty(updatedConfig);
    const configurations = [...this.props.teamProperties.data];
    const newConfigurations = configurations.map(configuration =>
      configuration.id === updatedConfig.id ? updatedConfig : configuration
    );
    this.resetTableWithNewTeamProperties(newConfigurations);
  };

  deleteTeamPropertyInStore = configurationId => {
    this.props.deleteTeamPropertyInStore(configurationId);
    const configurations = [...this.props.teamProperties.data];
    const newConfigurations = configurations.filter(configuration => configuration.id !== configurationId);
    this.resetTableWithNewTeamProperties(newConfigurations);
  };

  deleteTeamProperty = component => {
    axios
      .delete(TEAM_PROPERTIES_ID_PROPERTY_ID_URL(this.state.currentTeam, component.id))
      .then(response => {
        this.deleteTeamPropertyInStore(component.id);
        notify(
          <ToastNotification
            kind="success"
            title={"Team Configuration Deleted"}
            subtitle={`Request to delete ${component.label} succeeded`}
            data-testid="delete-team-prop-notification"
          />
        );
      })
      .catch(error => {
        notify(
          <ToastNotification
            kind="error"
            title={"Delete Configuration Failed"}
            subtitle={"Something went wrong"}
            data-testid="delete-team-prop-notification"
          />
        );
      });
  };

  handlePaginationChange = ({ page, pageSize }) => {
    this.setState({ page, pageSize });
  };

  renderCell = (propertyId, cellIndex, value) => {
    const property = this.props.teamProperties.data.find(property => property.id === propertyId);
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
          <Checkmark32 alt="secured" className={`${styles.tableSecured} ${styles.secured}`} />
        ) : (
          <Close32 alt="unsecured" className={`${styles.tableSecured} ${styles.unsecured}`} />
        );
      case "Actions":
        return (
          <ActionsMenu
            team={this.state.currentTeam}
            property={property}
            properties={this.props.teamProperties.data}
            deleteTeamPropertyInStore={this.deleteTeamProperty}
            addTeamPropertyInStore={this.addTeamPropertyInStore}
            updateTeamProperty={this.updateTeamProperty}
          />
        );
      default:
        return value || "---";
    }
  };

  handleSort = (valueA, valueB, config) => {
    this.setState({ sort: config });
  };

  render() {
    const { page, pageSize, teams, sort } = this.state;
    const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;
    const { teamProperties } = this.props;
    const totalItems = teamProperties.data.length;

    return (
      <>
        <Header
          title="Team Properties"
          description="Set team properties that are available for all Workflows in a team"
        />
        <div className={styles.tableContainer}>
          <div className={styles.header}>
            <div className={styles.dropdown}>
              <ComboBox
                id="team-properties-select"
                items={teams}
                label="Teams"
                onChange={value => this.fetchTeamPropertiesList(value.selectedItem)}
                itemToString={team => (team ? team.name : "")}
                placeholder="Select a team"
              />
            </div>
            {(this.state.currentTeam || totalItems > 0) && (
              <CreateEditTeamPropertiesModal
                addTeamPropertyInStore={this.addTeamPropertyInStore}
                properties={this.props.teamProperties.data}
                team={this.state.currentTeam}
                updateTeamProperty={this.updateTeamProperty}
              />
            )}
          </div>
          {totalItems > 0 ? (
            <>
              <DataTable
                rows={arrayPagination(teamProperties.data, page, pageSize, sort)}
                sortRow={this.handleSort}
                headers={this.headers}
                render={({ rows, headers, getHeaderProps }) => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {headers.map((header, key) => (
                            <TableHeader
                              key={`mode-table-key-${key}`}
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
                        {rows.map(row => {
                          return (
                            <TableRow key={row.id}>
                              {row.cells.map((cell, cellIndex) => (
                                <TableCell key={cell.id} style={{ padding: "0" }}>
                                  <div className={styles.tableCell}>
                                    {this.renderCell(row.id, cellIndex, cell.value)}
                                  </div>
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
                onChange={this.handlePaginationChange}
                page={page}
                pageSize={pageSize}
                pageSizes={PAGE_SIZES}
                totalItems={totalItems}
              />
            </>
          ) : (
            <>
              <DataTable
                rows={teamProperties.data}
                headers={this.headers}
                render={({ headers }) => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {headers.map((header, key) => (
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
              <WombatMessage
                className={styles.wombat}
                message={
                  !this.state.currentTeam
                    ? "Please select a team to manage properties."
                    : "Looks like there aren't any properties. Create one above!"
                }
              />
            </>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({ teamProperties: state.teamProperties });

export default connect(mapStateToProps, null)(TeamPropertiesTable);
