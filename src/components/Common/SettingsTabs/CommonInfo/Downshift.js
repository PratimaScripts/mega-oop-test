import React from "react";
import Autosuggest from "react-autosuggest";
import theme from "./theme.scss";

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion) => (
  <div id="suggestions__container">
    {suggestion.Text}, {suggestion.Description}{" "}
  </div>
);

class AddressAutoSuggestions extends React.Component {
  constructor(props) {
    super(props);

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: "",
      suggestions: [],
    };
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (nextProps.loqateData) {
  //     return {
  //       value: nextProps.loqateData.Label ? nextProps.loqateData.Label : ""
  //     };
  //   }
  // }
  getSuggestionValue = (suggestion) => {
    this.setState({ value: "" });
    this.props.findAddress(suggestion);
  };
  // Teach Autosuggest how to calculate suggestions for any given input value.
  getSuggestions = async (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    let addressesResponse = await this.props.LoqateAddress(value);
    return inputLength === 0 ? [] : addressesResponse;
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue ? newValue : "",
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = async ({ value }) => {
    let suggestions = await this.getSuggestions(value);
    this.setState({
      suggestions: suggestions.Items,
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: "Your current address",
      value: value ? value : this.props.value,
      className: "form-control tab__deatils--input",
      onChange: this.props.onChange ? this.props.onChange : this.onChange,
      name: this.props.label,
      disabled: this.props.disabled ? this.props.disabled : false,
      required: this.props.required ? this.props.required : false
    };

    // Finally, render it!
    return (
      <Autosuggest
        theme={theme}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

export default AddressAutoSuggestions;
