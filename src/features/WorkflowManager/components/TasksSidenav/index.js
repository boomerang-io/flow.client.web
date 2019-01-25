import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SearchBar from "@boomerang/boomerang-components/lib/SearchBar";
import { REQUEST_STATUSES } from "Config/servicesConfig";
import Tasks from "./Tasks";
import matchSorter from "match-sorter";

class TasksSidenavContainer extends Component {
  static propTypes = {
    tasks: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      tasksToDisplay: props.tasks.data,
      searchQuery: ""
    };
  }

  handleClear = () => {
    this.setState({ tasksToDisplay: this.props.tasks.data, searchQuery: "" });
  };

  handleOnSearchInputChange = e => {
    const searchQuery = e.target.value;
    this.setState({ searchQuery }, () => {
      this.handleSearchFilter();
    });
  };

  handleSearchFilter = () => {
    const { searchQuery, tasksToDisplay } = this.state;
    let newTasksToDisplay = matchSorter(this.props.tasks.data, searchQuery, { keys: ["category", "name"] });
    this.setState({ tasksToDisplay: newTasksToDisplay });
  };

  render() {
    const { tasks } = this.props;

    if (tasks.status === REQUEST_STATUSES.SUCCESS) {
      return (
        <aside className="b-taskSideNav" style={{ width: "20rem", position: "absolute" }}>
          <div
            className="b-taskSearchBar"
            style={{ width: "20rem", overflow: "hidden", borderRight: "1px solid", borderColor: "#1b2834" }}
          >
            <SearchBar
              theme="bmrg-white"
              onChange={this.handleOnSearchInputChange}
              onClear={this.handleClear}
              value={this.state.searchQuery}
            />
          </div>
          <Tasks tasks={this.state.tasksToDisplay} />
        </aside>
      );
    }

    return null;
  }
}

const mapStateToProps = state => ({
  tasks: state.tasks
});

export default connect(
  mapStateToProps,
  null
)(TasksSidenavContainer);
