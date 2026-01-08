import React from "react";
import ReactPhoneInput from "react-phone-input-2";
import get from "lodash/get";
import "react-phone-input-2/dist/style.css";
import { CountryArray } from "utils";
// import { message } from "antd";

const CountryCode = (props) => {
  let country,
    countryCode,
    phnumber = "";
  if (props.value) {
    if (props?.countryCode) {
      countryCode = props.countryCode;
      phnumber = props.value;
    } else {
      if (props.value) {
        countryCode = props.value.substring(0, 2);
        phnumber = String(props.value).substring(2);
      }
    }

    const countryIndex = CountryArray.findIndex(
      (item) => item.dial_code === countryCode
    );

    if (countryIndex !== -1) {
      country = CountryArray[countryIndex];
    } else {
      // message.error("Country is not supported!");
    }
  }

  return (
    <ReactPhoneInput
      inputExtraProps={{
        name: get(props, "name", "phoneNumber"),
        className: get(props, "className", ""),
        required: true,
      }}
      disabled={props.disabled}
      defaultCountry={
        country && country.code ? country.code.toLowerCase() : "gb"
      }
      enableSearchField={true}
      value={phnumber ? phnumber : ""}
      onChange={(value, data) => {
        if (data && data?.dialCode) {
          props.setValue(
            value.replace(/[^0-9]+/g, "").slice(data.dialCode.length),
            data.dialCode
          );
          props.onChange && props.onChange();
        }
      }}
    />
  );
};

export default CountryCode;
