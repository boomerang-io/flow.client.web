import React, { Component } from "react";
import PropTypes from "prop-types";
import { MultiSelect, Select, SelectItem, SelectItemGroup, Search } from "carbon-components-react";
import "./styles.scss";

class SearchFilterBar extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    handleSearchFilter: PropTypes.func.isRequired,
    debounceTimeout: PropTypes.number,
    filterItems: PropTypes.array,
    multiselect: PropTypes.bool,
    selectedOption: PropTypes.string,
    searchbar: PropTypes.bool
  };
  static defaultProps = {
    multiselect: true,
    debounceTimeout: 0,
    selectedOption: "none",
    searchbar: true
  };

  state = {
    searchQuery: "",
    selectedItems: this.props.selectedOption ? this.props.selectedOption : []
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
  handleOnSelectChange = e => {
    const selectedItems = e.target.value;
    this.setState({ selectedItems }, () => {
      this.handleSearchFilter();
    });
  };

  handleSearchFilter = () => {
    const { searchQuery, selectedItems } = this.state;
    this.props.handleSearchFilter(searchQuery, selectedItems);
  };

  render() {
    const { label = "Filter", options, multiselect, selectedOption, searchbar, filterItems } = this.props;

    return (
      <div className="b-search-filter">
        <div className="b-search-filter__search">
          {searchbar ? (
            <Search
              id="search-worfklows"
              labelText="Search workflows"
              onChange={this.handleOnSearchInputChange}
              onClear={this.handleOnSearchClear}
              placeHolderText="Search workflows"
              value={this.state.searchQuery}
            />
          ) : null}
        </div>
        <div className="b-search-filter__filter">
          {multiselect ? (
            <MultiSelect
              useTitleInItem={false}
              label={label}
              invalid={false}
              onChange={this.handleOnMultiSelectChange}
              items={filterItems || options.length ? options.map(item => ({ id: item.id, text: item.name })) : []}
              itemToString={item => (item ? item.text : "")}
            />
          ) : (
            <Select
              id="select"
              useTitleInItem={false}
              hideLabel={true}
              invalid={false}
              onChange={this.handleOnSelectChange}
              defaultValue={selectedOption}
            >
              <SelectItem value="none" text="All Workflows" />
              {options.map(option => {
                return (
                  <SelectItemGroup label={option.name} key={option.name}>
                    {option.workflows.map(workflow => {
                      return <SelectItem value={workflow.id} text={workflow.name} />;
                    })}
                  </SelectItemGroup>
                );
              })}
            </Select>
          )}
        </div>
      </div>
    );
  }
}

export default SearchFilterBar;
