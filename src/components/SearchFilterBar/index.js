import React, { Component } from "react";
import PropTypes from "prop-types";
import { MultiSelect } from "carbon-components-react";
import SearchBar from "@boomerang/boomerang-components/lib/SearchBar";
import "./styles.scss";

class SearchFilterBar extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    handleSearchFilter: PropTypes.func.isRequired,
    debounceTimeout: PropTypes.string,
    filterItems: PropTypes.array
  };
  static defaultProps = {
    debounceTimeout:""
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

  formatData = data => {
    return data.map(item => ({ id: item.id, text: item.name }));
  };

  render() {
    const { data, debounceTimeout } = this.props;

    return (
      <div className="b-search-filter">
        <div className="b-search-filter__search">
          <SearchBar
            theme="bmrg-white"
            onChange={this.handleOnSearchInputChange}
            onClear={this.handleOnSearchClear}
            value={this.state.searchQuery}
            debounceTimeout={debounceTimeout}
          />
        </div>
        <div className="b-search-filter__filter">
          <MultiSelect
            useTitleInItem={false}
            label="Filter"
            invalid={false}
            onChange={this.handleOnMultiSelectChange}
            items={this.props.filterItems || data.map(item => ({ id: item.id, text: item.name }))}
            itemToString={item => (item ? item.text : "")}
          />
        </div>
      </div>
    );
  }
}

export default SearchFilterBar;
