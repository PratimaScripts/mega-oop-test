import { Select, Typography } from "antd";
import { getAgreements } from "config/queries/agreement";
import React, { Fragment } from "react";
import { useQuery } from "react-apollo";

const { Option } = Select;

const Tenancy = ({ value, onChange, name, caption, isDisabled = false }) => {
  const { data } = useQuery(getAgreements);
  return (
    <Fragment>
      <Typography>Tenancy</Typography>
      <div>
        <Select
          defaultValue={""}
          value={value}
          disabled={isDisabled}
          onChange={(e) => onChange(name, e)}
          style={{ width: "100%" }}
        >
          <Option value="" disabled>
            Choose Tenancy
          </Option>
          {data?.getAgreements?.data?.length &&
            data?.getAgreements?.data.map((item) => (
              <Option value={item._id} key={item._id}>
                {item.agreementTitle}
              </Option>
            ))}
        </Select>
        <br />
        <small>Choose a tenancy or a reservation.</small>
      </div>
    </Fragment>
  );
};

export default Tenancy;
