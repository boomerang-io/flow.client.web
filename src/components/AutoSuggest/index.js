import React, { Component } from "react";
import ms from "match-sorter";
import { AutoSuggestInput } from "@boomerang/boomerang-components/lib/AutoSuggestInput";

const SELECT_METHODS = ["up", "down", "click"];

class AutoSuggest extends Component {
  inputRef = React.createRef();
  state = {
    // Used if we want to have some of the functions external instead of
    // the default ones in the wrapper
    value: "",
    caretIndex: 0,
    suggestions: []
  };

  // Each time the component updates we want to refocus the input and keep the cursor in the correct place
  // Needed for when cycling through mutliple suggestions with the arrow keys and the cursor resets to the end of the input. We don't want that.
  componentDidUpdate(prevProps) {
    this.inputRef.current.focus();
    this.inputRef.current.setSelectionRange(this.state.caretIndex, this.state.caretIndex);
  }

  renderSuggestion = suggestion => <div>{suggestion.label}</div>;

  onSuggestionsFetchRequested = () => {
    this.setState(() => ({
      suggestions: this.getSuggestions()
    }));
  };

  /**
   * More logic here for handling a user cycling through suggestions
   * Move the caret to the new suggestion location or use the reference to the DOM element.
   * Shift based on the change in length of the value b/c of different length suggestions
   */

  onChange = (event, { newValue, method }) => {
    this.setState(prevState => ({
      value: newValue,
      caretIndex: SELECT_METHODS.includes(method)
        ? prevState.caretIndex + (newValue.length - prevState.value.length)
        : this.inputRef.current.selectionStart
    }));
  };

  /**
   * Return the new value for the input
   * - Find the current caret position
   * - get the string up to that point
   * - find the last word (space-delimited) and replace it in input
   * -
   */
  getSuggestionValue = suggestion => {
    const inputWords = this.findWordsBeforeCurrentLocation();
    //const propertySuggestion = `\${p:${suggestion}}`;

    /*
     * Find the position of the caret, get the string up to that point
     * and find the index of the last word - i.e. the one the user entered
     */
    const pos = this.state.value.slice(0, this.state.caretIndex).lastIndexOf(inputWords[inputWords.length - 1]);

    //Sub in the new property suggestion
    return (
      this.state.value.substring(0, pos) +
      suggestion.value +
      this.state.value.substring(pos + inputWords[inputWords.length - 1].length)
    );
  };

  getSuggestions = () => {
    const inputWords = this.findWordsBeforeCurrentLocation();
    //Prevent empty string from matching everyhing
    const inputWord = inputWords.length ? inputWords[inputWords.length - 1] : "";
    return !inputWord
      ? []
      : ms(this.props.autoSuggestions, inputWord, {
          //Use match-sorter for matching inputs
          keys: [{ key: "value", threshold: ms.rankings.SIMPLE }]
        });
  };

  // Get array of distinct words prior to the current location of entered text
  // Use the inputRef instead of state becuase of asnychronous updating of state and calling of these functions :(
  findWordsBeforeCurrentLocation() {
    return this.inputRef.current.value
      .trim()
      .slice(0, this.inputRef.current.selectionStart)
      .split(" ");
  }

  render() {
    const { inputProps, children, ...rest } = this.props;
    const finalInputProps = {
      onChange: this.onChange,
      value: this.state.value,
      ...inputProps
    };
    return (
      <AutoSuggestInput
        isExternallyControlled
        getSuggestionValue={this.getSuggestionValue}
        inputProps={finalInputProps}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        renderSuggestion={this.renderSuggestion}
        suggestions={this.state.suggestions}
        {...rest}
      >
        {inputProps => React.cloneElement(children, { ...inputProps, inputRef: this.inputRef })}
      </AutoSuggestInput>
    );
  }
}

export default AutoSuggest;
