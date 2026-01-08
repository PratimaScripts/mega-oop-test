import React, { useState, useRef } from "react";
// import Autosuggest from "react-autosuggest";
import get from "lodash/get";
import { Modal, AutoComplete } from "antd";
import ContactsQuery from "../../../../../config/queries/contacts";
import theme from "./theme.scss";
import { setNestedObjectValues } from "formik";
import { Input, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
const { Search } = Input;
const { confirm } = Modal;

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <>
    <div id="suggestions__container">
      <b>
        {suggestion.role} - {suggestion.email}
      </b>
    </div>
  </>
);

const ContactSearch = (props) => {
  const [value, setValue] = useState("")
  const [suggestions, setSuggestions] = useState([])
  // const [selectedSuggestion, setSelectedSuggestion] = useState({})


  // componentDidMount() {
  //   let val = props.values;
  //   let finalValue = get(val, get(props, "field", ""), "");
  //   setState({ value: finalValue ? finalValue : "" });
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   let val = props.values;
  //   let prevVal = prevProps.values;
  //   if (get(val, props.field, "") !== get(prevVal, props.field, "")) {
  //     setState({
  //       value: get(val, props.field, "")
  //     });
  //   }
  // }

  const renderItem = (item) => ({
    value: item.firstName,
    item,
    label: (
      <div
        key={item.userId}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <UserOutlined /> {`${item.firstName} ${item.lastName}`}
        <span>
          <Tag>{item.role}</Tag>
        </span>
      </div>
    ),
  });

  const getSuggestionValue = (suggestion) => {
    // setNestedObjectValues()
    let updateContactList = props.updateContactList;
    let apolloClient = props.client;
    confirm({
      title: "Are you sure you want to add this user to your contacts?",
      content: `${suggestion.firstName} ${suggestion.lastName} will be added to your contacts.`,
      async onOk() {
        let addUserToContacts = await apolloClient.mutate({
          mutation: ContactsQuery.createContact,
          variables: {
            contact: {
              userId: suggestion.userId,
              role: suggestion.role,
              email: suggestion.email
            }
          }
        });

        updateContactList(get(addUserToContacts, "data.createContact.data"));
      },
      onCancel() {
        // console.log("Cancel");
      }
    });
  };
  // Teach Autosuggest how to calculate suggestions for any given input value.
  const getSuggestions = async value => {
    const inputValue = value ? value.trim().toLowerCase() : "";
    const inputLength = inputValue ? inputValue.length : 0;
    let addressesResponse = [];

    if (inputLength !== 0) {
      if (inputLength > 4) {
        const findResults = await props.client.query({
          query: ContactsQuery.fetchContactList,
          variables: {
            filter: value
          }
        });

        addressesResponse = get(findResults, "data.fetchContactList.data", []);
        // console.log(addressesResponse)
      }
      setSuggestions(addressesResponse?.map((item) => renderItem(item)))
    }

    // return addressesResponse;
  };

  const onChange = (data) => {
    setValue(data.firstName)
  };

  // Autosuggest will call this function every time you need to update suggestions.
  const onSuggestionsFetchRequested = async ({ value }) => {
    let suggestions = await getSuggestions(value);
    setSuggestions(suggestions)
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    setSuggestions([])

  };


  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    placeholder: "Type something",
    value: value,
    className: "tab__deatils--input form-control",
    onChange: onChange
  };

  const onSelect = (value, option) => {
    // setValue(data.firstName)
    getSuggestionValue(option.item)
    // console.log(option)
  };
  // Finally, render it!
  return (
    // <Autosuggest
    //   theme={theme}
    //   suggestions={suggestions}
    //   onSuggestionsFetchRequested={onSuggestionsFetchRequested}
    //   onSuggestionsClearRequested={onSuggestionsClearRequested}
    //   getSuggestionValue={getSuggestionValue}
    //   renderSuggestion={renderSuggestion}
    //   inputProps={inputProps}
    // />
    // <Search
    //   placeholder="input email address"
    //   size="large"
    //   onSearch={getSuggestions}
    //   enterButton />
    <AutoComplete
      // value={value}
      size={"large"}
      options={suggestions}
      style={{ width: 200 }}
      onSelect={onSelect}
      onSearch={getSuggestions}
      // onChange={onChange}
      placeholder="Search by email"
    />
  );
}

export default ContactSearch;
