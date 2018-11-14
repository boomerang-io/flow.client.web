import React, { Component } from "react";
import PropTypes from "prop-types";
import { MultiSelect, Select, SelectItem, SelectItemGroup } from "carbon-components-react";
import SearchBar from "@boomerang/boomerang-components/lib/SearchBar";
import "./styles.scss";

class SearchFilterBar extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    handleSearchFilter: PropTypes.func.isRequired,
    debounceTimeout: PropTypes.string,
    filterItems: PropTypes.array,
    multiselect: PropTypes.bool,
    selectedOption: PropTypes.string
  };
  static defaultProps = {
    multiselect: true,
    debounceTimeout: "",
    selectedOption: "none"
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
    console.log(searchQuery, selectedItems);

    this.props.handleSearchFilter(searchQuery, selectedItems);
  };

  render() {
    const { options, debounceTimeout, multiselect, selectedOption } = this.props;

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
          {multiselect ? (
            <MultiSelect
              useTitleInItem={false}
              label="Filter"
              invalid={false}
              onChange={this.handleOnMultiSelectChange}
              items={
                this.props.filterItems || options.length ? options.map(item => ({ id: item.id, text: item.name })) : []
              }
              itemToString={item => (item ? item.text : "")}
            />
          ) : (
            <Select
              useTitleInItem={false}
              hideLabel={true}
              invalid={false}
              onChange={this.handleOnSelectChange}
              defaultValue={selectedOption}
            >
              <SelectItem value="none" text="All" />
              {options.map(option => {
                return (
                  <SelectItemGroup label={option.name}>
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
