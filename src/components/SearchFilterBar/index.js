import React, { Component } from "react";
import PropTypes from "prop-types";
import { MultiSelect } from "carbon-components-react";
import SearchBar from "@boomerang/boomerang-components/lib/SearchBar";
import "./styles.scss";

class SearchFilterBar extends Component {
  static propTypes = {
    teams: PropTypes.array.isRequired,
    handleSearchFilter: PropTypes.func.isRequired
  };

  state = {
    searchQuery: "",
    selectedItems: []
  };

  handleOnSearchInputChange = e => {
    const searchQuery = e.target.value;
    this.setState({ searchQuery }, () => {
      this.handleSearchFilter();
    });
  };

  handleOnSearchClear = () => {
    this.setState({ searchQuery: "" }, () => {
      this.handleSearchFilter();
    });
  };

  handleOnMultiSelectChange = e => {
    const selectedItems = e.selectedItems;
    this.setState({ selectedItems }, () => {
      this.handleSearchFilter();
    });
  };

  handleSearchFilter = () => {
    const { searchQuery, selectedItems } = this.state;

    this.props.handleSearchFilter(searchQuery, selectedItems);
  };

  formatTeams = teams => {
    return teams.map(team => ({ id: team.id, text: team.name }));
  };

  render() {
    const { teams } = this.props;

    return (
      <div className="b-search-filter">
        <div className="b-search-filter__search">
          <SearchBar
            theme="bmrg-white"
            onChange={this.handleOnSearchInputChange}
            onClear={this.handleOnSearchClear}
            value={this.state.searchQuery}
          />
        </div>
        <div className="b-search-filter__filter">
          <MultiSelect
            useTitleInItem={false}
            label="Filter"
            invalid={false}
            onChange={this.handleOnMultiSelectChange}
            items={teams.map(team => ({ id: team.id, text: team.name }))}
            itemToString={item => (item ? item.text : "")}
          />
        </div>
      </div>
    );
  }
}

export default SearchFilterBar;
