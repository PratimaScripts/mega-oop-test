import React, { Fragment, useEffect, useState } from "react";
import { useLazyQuery } from "react-apollo";
import Autosuggest from "react-autosuggest";
import { getCompanies } from "../../../../config/queries/company";

const renderSuggestion = (suggestion) => (
  <Fragment>
    <b>{suggestion.title}</b> ({suggestion.company_number})
  </Fragment>
);

const CompanyDropdown = (props) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setValue(props.value ?? "");
  }, [props]);

  const [getSuggestions] = useLazyQuery(getCompanies, {
    onCompleted: (data) => {
      setSuggestions(data.getCompanies);
    },
  });

  const onSuggestionsFetchRequested = async ({ value }) => {
    await getSuggestions({
      variables: {
        searchTerm: value,
      },
    });
  };

  const getSuggestionValue = (suggestion) => {
    props.onChange(suggestion);
    return props.field === "companyRegistrationNumber"
      ? suggestion.company_number
      : suggestion.title;
  };

  const handleOnChange = (_, { newValue }) => {
    setValue(newValue ?? "");
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={{
        placeholder:
          props.field === "companyRegistrationNumber"
            ? "Enter Company Registration Number"
            : "Company or Business name (if applicable)",
        value,
        className: "form-control tab__deatils--input",
        onChange: handleOnChange,
        required: true,
      }}
    />
  );
};

export default CompanyDropdown;
