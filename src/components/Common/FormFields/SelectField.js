import React from "react";
import { Select } from "antd";
import "./SelectField.css";

const SelectField = (props) => {
    const { children, ...restProps } = props

    return (
        <Select   {...restProps}>
            {children}
        </Select>
    )
}

export default SelectField;