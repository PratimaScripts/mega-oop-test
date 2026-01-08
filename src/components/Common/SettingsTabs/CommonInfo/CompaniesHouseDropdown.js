import React from "react";
import Autosuggest from "react-autosuggest";
import get from "lodash/get";
import theme from "./theme.scss";
import { client } from "index";
import { message } from "antd";
import { getCompanies } from "config/queries/company";

// import FindCompany from "../../../../config/CompaniesHouseSuggestion";

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion) => (
  <>
    <b>{suggestion.title}</b> ({suggestion.company_number})
  </>
);

class CompanyAutoSuggestions extends React.Component {
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

  componentDidMount() {
    let val = this.props.values;
    let finalValue = get(val, get(this.props, "field", ""), "");
    this.setState({ value: finalValue ? finalValue : "" });
  }

  componentDidUpdate(prevProps, prevState) {
    let val = this.props.values;
    let prevVal = prevProps.values;
    if (get(val, this.props.field, "") !== get(prevVal, this.props.field, "")) {
      this.setState({
        value: get(val, this.props.field, ""),
      });
    }
  }

  getSuggestionValue = (suggestion) => {
    // console.log(suggestion);
    this.setState({ value: "" });
    this.props.setCompany(suggestion);
    // console.log("companies", suggestion);
  };
  // Teach Autosuggest how to calculate suggestions for any given input value.
  getSuggestions = async (value) => {
    try {
      // console.log("valuevaluevaluevalue", value);
      const inputValue = value ? value.trim().toLowerCase() : "";
      const inputLength = inputValue ? inputValue.length : 0;
      let addressesResponse = [];
      if (inputLength !== 0) {
        if (inputLength > 2) {
          const { data, errors } = await client.query({
            query: getCompanies,
            variables: {
              searchTerm: value,
            },
          });
          errors?.forEach((msg) => message.error(msg));
          return data?.getCompanies;
        }
      }

      return addressesResponse;
    } catch (error) {
      message.error("An error occurred, please try again!");
    }
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue ? newValue : "",
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  onSuggestionsFetchRequested = async ({ value }) => {
    let suggestions = await this.getSuggestions(value);

    this.setState({
      suggestions: suggestions || [],
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  render() {
    const { suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder:
        this.props.field === "companyRegistrationNumber"
          ? "Enter Company Registration Number"
          : "Company or Business name (if applicable)",
      value: this.props.value ? this.props.value : this.state.value,
      className: "form-control tab__deatils--input",
      onChange: this.props.onChange ? this.props.onChange : this.onChange,
      required: get(this.props, "required", true),
    };

    // console.log(get(this.state, "value", ""))

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

export default CompanyAutoSuggestions;
