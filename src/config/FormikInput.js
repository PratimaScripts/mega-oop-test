import React from "react";
import { Field } from "formik";

const CustomInput = props => {
  return (
    <Field
      autoComplete={"none"}
      {...props}
      className={
        props.values && props.values[props.name] ? "tab__deatils--input greenger" :
        props.errors && props.errors[props.name]
          ? "tab__deatils--input error__field_show"
          : "tab__deatils--input"
      }
    />
  );
};

export default CustomInput;
