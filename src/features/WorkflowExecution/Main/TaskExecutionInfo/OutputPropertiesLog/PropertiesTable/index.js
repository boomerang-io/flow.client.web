import React, { Component } from "react";
import PropTypes from "prop-types";
import Table from "@boomerang/boomerang-components/lib/Table";
import { NoDisplay } from "@boomerang/carbon-addons-boomerang-react";
import "./styles.scss";

class PropertiesTable extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired
  };

  render() {
    const columns = [
      {
        Header: "Property",
        id: "key",
        accessor: "key"
      },
      {
        Header: "Value",
        id: "value",
        accessor: "value",
        Cell: row => <span style={{ width: "18rem", whiteSpace: "normal" }}>{row.value}</span>
      }
    ];

    if (!this.props.data || !this.props.data.length) {
      return (
        <div className="c-properties-table">
          <NoDisplay text="No properties to display" />
        </div>
      );
    }
    return (
      <div className="c-properties-table">
        <Table
          data={this.props.data}
          columns={columns}
          showPagination={false}
          minRows={this.props.data.length}
          noDataText="No data to display"
          theme="bmrg-flow"
          className="b-properties-table"
          style={{ whiteSpace: "unset" }}
          defaultSorting={[
            {
              id: "key",
              desc: false
            }
          ]}
        />
      </div>
    );
  }
}

export default PropertiesTable;
