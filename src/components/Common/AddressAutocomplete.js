import React, { useState } from "react";
// import Autosuggest from "react-autosuggest";
import { Modal, Select, Table, Space, message } from "antd";
import {
  HomeOutlined,
  RightCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import findAddressApi from "config/AddressAutoCompleteLoqate";

import "./addressAutocomplete.css";

const AddressAutocomplete = ({
  value = undefined,
  onChange = (f) => f,
  findAddress = (f) => f,
  placeholder = "Type property address and select",
  disabled = false,
  required = true,
}) => {
  // const placeholder = placeholder1 ? placeholder1:"Type property address and select";
  const [options, setOptions] = useState([]);
  // const suggestions = useRef([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [nestedAddress, setNestedAddress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [primaryDataLoading, setPrimaryDataLoading] = useState(false);
  const { Option } = Select;

  // const renderItem = (item, index) => ({
  //   value: item.Text,
  //   item,
  //   label: (
  //     <div
  //       key={item.Id}
  //       style={{
  //         display: 'flex',
  //         justifyContent: 'start',
  //       }}
  //     >

  //  <Space size="middle" align={"basline"}>
  //      <HomeOutlined />
  //      <span> {item.Text},  {item.Description}{" "} </span>
  //      <span>{item.Type!=="Address" && <RightCircleOutlined />}</span>
  //   </Space>
  //     </div>
  //   ),
  // });

  // const handleChange = async (index) => {
  //   const address = options[index]
  //   if(address?.Type==="Address") {
  //     findAddress(address)
  //     onChange(address.Description)
  // } else if(address) {
  //     setLoading(true)
  //     setModalVisible(true)
  //     const fullAddress = await findAddressApi(address.Text, address.Id);
  //     setNestedAddress(fullAddress?.Items ? fullAddress.Items : [])
  //     setLoading(false)
  // } else {
  //     message.error("Not a valid address, choose another one")
  // }
  // }

  const renderItem = (item, index) => (
    <Option
      key={item.Id + item.Description}
      value={item.Description}
      data={item}
    >
      <Space size="middle" align={"basline"}>
        <span>
          {" "}
          {item.Text}, {item.Description}{" "}
        </span>
        <span>{item.Type !== "Address" && <RightCircleOutlined />}</span>
      </Space>
    </Option>
  );

  const getSuggestionValue = async (address) => {
    // setNestedObjectValues()
    if (address?.Type === "Address") {
      findAddress(address);
    } else if (address) {
      setLoading(true);
      setModalVisible(true);
      const fullAddress = await findAddressApi(address.Text, address.Id);
      setNestedAddress(fullAddress?.Items ? fullAddress.Items : []);
      setLoading(false);
    } else {
      message.error("Not a valid address, choose another one");
    }
  };
  // Teach Autosuggest how to calculate suggestions for any given input value.

  const getSuggestions = async (value) => {
    const inputValue = value ? value.trim().toLowerCase() : "";
    const inputLength = inputValue ? inputValue.length : 0;

    if (inputLength !== 0) {
      setPrimaryDataLoading(true);
      const addressResponse = await findAddressApi(value);
      // console.log(addressResponse, addressResponse.Items?.length, addressResponse.Items)
      setOptions(
        await (addressResponse.Items?.length > 0
          ? addressResponse.Items?.map((item) => renderItem(item))
          : [])
      );
      // console.log("options", options)
    }
    setPrimaryDataLoading(false);

    //   setSuggestions(addressesResponse?.map((item) => renderItem(item)))
    // console.log("suggestions", suggestions.current)

    // return addressesResponse;
  };

  const columns = [
    {
      title: "Select Your Address",
      key: "Id",
      render: (item) => (
        <Space size={"large"}>
          <HomeOutlined />{" "}
          <span>
            {" "}
            {item.Text}, {item.Description}{" "}
          </span>
        </Space>
      ),
    },
  ];

  const onSelect = (value, option) => {
    // console.log(option)
    // setValue(data.firstName)
    getSuggestionValue(option.data);
    // console.log(option)
  };
  // Finally, render it!
  return (
    <>
      <Select
        showSearch
        showArrow={false}
        size={"large"}
        defaultActiveFirstOption={false}
        filterOption={false}
        allowClear={true}
        style={{ width: "100%" }}
        onSearch={getSuggestions}
        placeholder={placeholder}
        disabled={disabled}
        value={value && value.length > 0 ? value : undefined}
        onChange={onChange}
        onSelect={onSelect}
        required={required}
        loading={primaryDataLoading}
        notFoundContent={
          primaryDataLoading ? (
            <>
              <LoadingOutlined /> Data Loading
            </>
          ) : (
            "No address found"
          )
        }
      >
        {options}
      </Select>
      {isModalVisible && (
        <Modal
          footer={null}
          title={null}
          visible={isModalVisible}
          closable={true}
          onCancel={() => setModalVisible(false)}
        >
          <Table
            dataSource={nestedAddress}
            columns={columns}
            loading={loading}
            bordered={true}
            pagination={false}
            onRow={(record, rowIndex) => {
              return {
                onClick: async (event) => {
                  setLoading(true);
                  await findAddress(record);
                  setModalVisible(false);
                  // onChange(record.Description)
                  setLoading(false);
                },
              };
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default AddressAutocomplete;
