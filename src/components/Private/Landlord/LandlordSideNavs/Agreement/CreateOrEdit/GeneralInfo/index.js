import { Typography, Col, Row, Input, Switch, DatePicker, message } from "antd";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import PropertyDropdown from "components/Common/PropertyDropdown";
import moment from "moment";
import React, { useEffect, useState, useContext } from "react";
import "./styles.scss";
import showNotification from "config/Notification";
import { TitleContentWrapper } from "../index";
import { BackButton, NextButton } from "../Buttons";
import ContactsDropdown from "../../../../../../Common/Contacts/ContactsDropdown";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { UserDataContext } from "store/contexts/UserContext";

const { RangePicker } = DatePicker;

const parseDays = (value) => {
  let months = 0,
    years = 0,
    days = 0;
  while (value) {
    if (value >= 365) {
      years++;
      value -= 365;
    } else if (value >= 30) {
      months++;
      value -= 30;
    } else {
      days++;
      value--;
    }
  }
  return `${years} years ${months} months ${days} days`;
};

const GeneralInfo = ({ generalInfo, onGeneralDataChange, onBack }) => {
  const { state } = useContext(UserDataContext);
  const accountSetting = state.accountSettings;
  const dateFormat = !isEmpty(accountSetting)
    ? get(accountSetting, "dateFormat", process.env.REACT_APP_DATE_FORMAT)
    : process.env.REACT_APP_DATE_FORMAT;
  const todaysDate = new Date();
  const [durationString, setDurationString] = useState("");
  const [data, setData] = useState({
    occupation: {
      adults: 0,
      kids: 0,
      pets: 0,
      occupantNames: [],
    },
    duration: {
      start: todaysDate,
      end: todaysDate,
      leaveOpen: false,
    },
    contacts: [],
    propertyId: "",
  });

  useEffect(() => {
    try {
      setData({
        ...data,
        ...generalInfo,
        duration: {
          ...generalInfo.duration,
          start: new Date(generalInfo.duration.start),
          end: new Date(generalInfo.duration.end),
        },
      });
      setDurationString(
        parseDays(
          moment(generalInfo.duration.end).diff(
            moment(generalInfo.duration.start),
            "days"
          )
        )
      );
    } catch (error) {
      console.log(error);
    }
    //eslint-disable-next-line
  }, [generalInfo]);

  const handleDataChange = (_data) => setData({ ...data, ..._data });

  const handleDurationChange = ({ start, end }) => {
    // leave open
    if (data.duration.leaveOpen) {
      return setData({
        ...data,
        duration: {
          ...data.duration,
          start: new Date(start),
          // start: new Date(dateInFormat(start)),
        },
      });
    }

    // start to end
    if (start && end) {
      const d1 = new Date(start);
      const d2 = new Date(end);
      const diff = new Date(d2).getTime() - new Date(d1).getTime(); 
      // const yeardiff = Number((diff / 31536000000).toFixed(0)); 
      var daydiff = diff / (1000 * 60 * 60 * 24); 

      // if (yeardiff > 3) {
      //   return showNotification(
      //     "info",
      //     "Agreement duration cannot be greater than 3 years!"
      //   );
      // }
      var year = d1.getFullYear();
      var month = d1.getMonth();
      var day = d1.getDate();
      const maximumDuration = new Date(year + 3 , month, day);

      if (d2 > maximumDuration) {
        return showNotification(
          "info",
          "Consult legal advisor, our template doesn't support rental period more than 3 years"
        );
      }
   
      setDurationString(parseDays(daydiff));

      return setData({
        ...data,
        duration: {
          ...data.duration,
          start: new Date(start),
          end: new Date(end),
        },
      });
    } else {
      showNotification(
        "info",
        "Invalid duration",
        "Please select a duration to display."
      );
    }
  };

  const handleOccupationChange = (key, value) => {
    if (value > 9) {
      return message.error(`${key} should be 1 to 9!`);
    }
    setData({ ...data, occupation: { ...data.occupation, [key]: value } });
  };

  const handleOnNext = async () => {
    try {
      // const durationStartDate = new Date(
      //   dateInFormat(data.duration.start)
      // )
      // const durationEndDate = new Date(
      //   dateInFormat(data.duration.end)
      // )

      // const _data = { ...data };
      // _data.duration.start = durationStartDate;
      // _data.duration.end = durationEndDate;

      // await generalInfoValidation.validate(_data);

      if (!data.propertyId) {
        throw new Error("Property required!");
      }

      if (!data.contacts.length) {
        throw new Error("Minimum one contact required!");
      }

      if (!parseInt(data.occupation.adults)) {
        throw new Error("There should be at least one adult!");
      }

      if (
        !data.duration.leaveOpen &&
        +data.duration.start === +data.duration.end
      ) {
        throw new Error("Agreement starting date and ending date must be different!");
      }

      onGeneralDataChange(data);
    } catch (error) {
      showNotification("error", "Validation Error", error.message);
    }
  };

  // const handleOccupationsNameChange = (names) => {
  //   setData({
  //     ...data,
  //     occupation: {
  //       ...data.occupation,
  //       occupantNames: names,
  //     },
  //   });
  //   console.log(data);
  // };

  const handleUpdateDurationString = () => {
    const start = moment(data.duration.start);
    const end = moment(data.duration.end);
    setDurationString(parseDays(end.diff(start, "days")));
  };

  const [hasOccupants, setHasOccupants] = useState(false);
  const [occumentData, setOccumentData] = useState([]);
  const occupantsItem = "";

  const handleAddNewOccupants = () =>
    setOccumentData([...occumentData, occupantsItem]);

  const handleRemoveOccupants = (index) =>
    setOccumentData(occumentData.filter((_, i) => i !== index));

  const handleChangeOccupantsData = (index, value) => {
    setOccumentData((items) => [
      ...items.slice(0, index),
      value,
      ...items.slice(index + 1),
    ]);
    // setData({
    //   ...data,
    //   occupation: {
    //     ...data.occupation,
    //     occupantNames: names,
    //   },
    // });
    // onOccupantsChange(occumentData);
  };

  useEffect(() => {
    setData({
      ...data,
      ...generalInfo,
      occupation: {
        ...data.occupation,
        ...generalInfo.occupation,
        occupantNames: occumentData,
      },
    });
    //eslint-disable-next-line
  }, [occumentData]);
  const handleChangeOccupants = () => {
    if (!hasOccupants && !occumentData.length) {
      setOccumentData([""]);
    }
    setHasOccupants(!hasOccupants);
  };

  const start = data.duration.start;
  const end = data.duration.end;
  return (
    <div className="agreement-general-info">
      <Row gutter={[16, 16]}>
        <Col span={24} className="agreement-row-item">
          <h5>Rented Property</h5>
          <PropertyDropdown
            propertyId={data.propertyId}
            disabled={generalInfo.propertyId}
            onPropertyChange={(propertyId) => handleDataChange({ propertyId })}
          />
        </Col>
      </Row>
      <div className="row">
        <div className="col-12 col-md-12 col-lg-8">
          <h5>Tenant Information</h5>
          <Typography.Paragraph>
            Select the Renters from the dropdown menu. If your Renter is
            connected with you, the agreement will be automatically shared with
            them.
          </Typography.Paragraph>

          <ContactsDropdown
            contacts={data.contacts}
            onContactUpdate={(value) => handleDataChange({ contacts: value })}
            beingRenderedFrom="agreement"
          />
        </div>

        <div
          span={14}
          className="col-12 col-md-12 col-lg-8 col-lg-6 agreement-row-item"
        >
          <h5>Maximum Occupancy</h5>
          <div className="row">
            <TitleContentWrapper title="Count of adults">
              <Input
                className="input-field"
                type="number"
                placeholder="Count of adults"
                value={data.occupation.adults}
                onChange={(e) =>
                  handleOccupationChange("adults", e.target.value)
                }
              />
            </TitleContentWrapper>
            <TitleContentWrapper title="Count of kids">
              <Input
                className="input-field"
                type="number"
                placeholder="Count of kids"
                value={data.occupation.kids}
                onChange={(e) => handleOccupationChange("kids", e.target.value)}
              />
            </TitleContentWrapper>
            <TitleContentWrapper title="Count of pets">
              <Input
                className="input-field"
                type="number"
                placeholder="Count of pets"
                value={data.occupation.pets}
                onChange={(e) => handleOccupationChange("pets", e.target.value)}
              />
            </TitleContentWrapper>
          </div>
        </div>
        <div span={24} className="col-12">
          <h6>
            List name of occupants{" "}
            <Switch
              checkedChildren={
                <CheckOutlined style={{ verticalAlign: "middle" }} />
              }
              unCheckedChildren={
                <CloseOutlined style={{ verticalAlign: "middle" }} />
              }
              checked={hasOccupants}
              onClick={handleChangeOccupants}
            />
          </h6>

          {hasOccupants && (
            <>
              {occumentData.map((item, index) => (
                <div className="row my-3" span={16} key={index}>
                  <div className="col-8 pr-0">
                    <Input
                      className="mr-3 input-field py-2 rounded"
                      style={{ fontSize: 16 }}
                      placeholder="Full Name of Occupant"
                      value={item}
                      name={`name-${index}`}
                      onChange={(e) =>
                        handleChangeOccupantsData(index, e.target.value)
                      }
                    />
                  </div>
                  <div className="col-4 pr-0">
                    <button
                      style={{ color: "red", fontSize: 16 }}
                      onClick={() => handleRemoveOccupants(index)}
                      className="btn btn-delete py-2 d-block btn-outline-danger"
                    >
                      <DeleteOutlined
                        style={{ verticalAlign: "middle" }}
                        className="d-inline"
                      />{" "}
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
          {hasOccupants && (
            <div>
              <button
                onClick={handleAddNewOccupants}
                className="btn btn-outline-primary mb-3 mt-1"
              >
                <PlusOutlined style={{ verticalAlign: "middle" }} /> Add new
              </button>
            </div>
          )}
          {/* <Select
            mode="tags"
            value={data.occupation.occupantNames}
            style={{ width: "100%" }}
            allowClear
            autoClearSearchValue
            placeholder="List name of occupants ?"
            onChange={handleOccupationsNameChange}
          /> */}
        </div>
      </div>
      <div className="row">
        <div className="col-12 agreement-row-item">
          <h5>Rental Duration</h5>
          <div className="row">
            <div className="col-lg-4 col-md-8 mb-3">
              {data.duration.leaveOpen ? (
                <DatePicker
                  className="picker "
                  value={moment(start)}
                  onChange={(date) => handleDurationChange({ start: date })}
                  format={dateFormat}
                  allowClear={false}
                />
              ) : (
                <RangePicker
                  allowClear={false}
                  className="picker "
                  onCalendarChange={(dates) => {
                    if (dates[0] !== "" && dates[1] !== "") {
                      handleDurationChange({
                        start: dates[0],
                        end: dates[1],
                      });
                    }
                  }}
                  value={[moment(start), moment(end)]}
                  format={dateFormat}
                />
              )}
            </div>
            <div className="d-flex col-lg-4 mb-3">
              <Switch
                className="mr-2"
                checked={data.duration.leaveOpen}
                onChange={(value) => {
                  if (!value) handleUpdateDurationString();
                  setData({
                    ...data,
                    duration: {
                      ...data.duration,
                      leaveOpen: value,
                    },
                  });
                }}
              />
              <Typography>Month to Month (no end date)</Typography>
            </div>
            {!data.duration.leaveOpen && (
              <Typography className="col-lg-4 mb-3">
                {durationString}
              </Typography>
            )}
          </div>
        </div>
        <div className="col-12 agreement-row-item text-right">
          <BackButton onClick={onBack}>
            <i className="fa fa-angle-double-left mr-2" />
            Back
          </BackButton>
          <NextButton onClick={handleOnNext}>
            Continue <i className="fa fa-angle-double-right ml-2" />
          </NextButton>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfo;
