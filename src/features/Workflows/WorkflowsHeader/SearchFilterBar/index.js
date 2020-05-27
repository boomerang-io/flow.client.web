import React, { Component } from "react";
import { DelayedRender } from "@boomerang/carbon-addons-boomerang-react";
import PropTypes from "prop-types";
import {
  MultiSelect,
  Select,
  SelectItem,
  SelectItemGroup,
  Search,
  SearchSkeleton,
  SelectSkeleton,
} from "@boomerang/carbon-addons-boomerang-react";
import "./styles.scss";

class SearchFilterBar extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    handleSearchFilter: PropTypes.func.isRequired,
    debounceTimeout: PropTypes.number,
    filterItems: PropTypes.array,
    loading: PropTypes.bool,
    multiselect: PropTypes.bool,
    selectedOption: PropTypes.string,
    searchbar: PropTypes.bool,
  };
  static defaultProps = {
    multiselect: true,
    debounceTimeout: 0,
    selectedOption: "none",
    searchbar: true,
  };

  state = {
    searchQuery: "",
    selectedItems: this.props.selectedOption ? this.props.selectedOption : [],
  };

  handleOnSearchInputChange = (e) => {
    const searchQuery = e.target.value;
    this.setState({ searchQuery }, () => {
      this.handleSearchFilter();
    });
  };

  handleOnMultiSelectChange = (e) => {
    const selectedItems = e.selectedItems;
    this.setState({ selectedItems }, () => {
      this.handleSearchFilter();
    });
  };
  handleOnSelectChange = (e) => {
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
    const {
      label = "Filter",
      loading,
      options,
      multiselect,
      placeholder,
      selectedOption,
      searchbar,
      filterItems,
      title = "",
    } = this.props;

    if (loading) {
      return (
        <DelayedRender>
          <div className="b-search-filter">
            {searchbar && (
              <div className="b-search-filter__search">
                <SearchSkeleton small />
              </div>
            )}
            <div className="b-search-filter__filter">
              <SelectSkeleton />
            </div>
          </div>
        </DelayedRender>
      );
    }

    return (
      <div className="b-search-filter">
        <div className="b-search-filter__search">
          {searchbar ? (
            <Search
              id="search-worfklows"
              labelText="Search for a workflow"
              onChange={this.handleOnSearchInputChange}
              placeHolderText="Search for a workflow"
              value={this.state.searchQuery}
            />
          ) : null}
        </div>
        <div className="b-search-filter__filter">
          {multiselect ? (
            <MultiSelect.Filterable
              id="b-search-filter__filter"
              titleText={title}
              label={label}
              invalid={false}
              onChange={this.handleOnMultiSelectChange}
              placeholder={placeholder}
              items={filterItems || options.length ? options.map((item) => ({ id: item.id, text: item.name })) : []}
              itemToString={(item) => (item ? item.text : "")}
            />
          ) : (
            <Select
              id="select"
              hideLabel={true}
              invalid={false}
              onChange={this.handleOnSelectChange}
              placeholder={placeholder}
              defaultValue={selectedOption}
            >
              <SelectItem value="none" text="All Workflows" />
              {options.map((option) => {
                return (
                  <SelectItemGroup label={option.name} key={option.name}>
                    {option.workflows.map((workflow) => {
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
