import { Select } from "antd";
import { get } from "lodash";
import React, { Fragment, useEffect, useState } from "react";
import { useQuery, useLazyQuery } from "react-apollo";
import PropertyQuery from "../../../config/queries/property";
import { useHistory } from "react-router-dom";

const { Option } = Select;

const PropertyDropdown = (props) => {
  const { push } = useHistory();

  useQuery(PropertyQuery.fetchProperty, {
    onCompleted: (data) => {
      if (data) setProperties(get(data, "fetchProperty.data", []));
    },
  });

  const [getProperty] = useLazyQuery(PropertyQuery.getPropertyById, {
    onCompleted: ({ getPropertyById }) => {
      if (getPropertyById.success) {
        const data = getPropertyById.data;
        setPropertyTitle(data.title);
      }
    },
  });

  useEffect(() => {
    if (props?.propertyId || props?.propertyId !== "") {
      getProperty({ variables: { propertyId: props.propertyId } });
    }
    setProperty(props.propertyId); // eslint-disable-next-line
  }, [props.propertyId]);

  const [properties, setProperties] = useState([]);
  const [property, setProperty] = useState("");
  const [propertyTitle, setPropertyTitle] = useState("");

  return (
    <Fragment>
      <Select
        placeholder="Select Property"
        style={{ width: "100%" }}
        disabled={props.disabled}
        value={property ? propertyTitle : undefined}
        onChange={(value) => {
          props.onPropertyChange(value);
          if (value !== "new") {
            setProperty(value);
          }
          if (value === "new") {
            push("/landlord/property/add");
          }
        }}
      >
        <Option disabled>Select Property</Option>
        <option value="new">Add New Property</option>
        {properties.map((pr) => (
          <>
            {pr.title ? (
              <Option key={pr.propertyId} value={pr.propertyId}>
                {pr.title}
              </Option>
            ) : null}
          </>
        ))}
      </Select>
    </Fragment>
  );
};

export default PropertyDropdown;
