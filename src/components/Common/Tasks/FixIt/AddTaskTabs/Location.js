import React, { useState, useEffect, useContext } from "react";
import { Formik, Form, Field } from "formik";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import PropertyQuery from "../../../../../config/queries/property";
import AccountQuery from "../../../../../config/queries/account";

import AddProperty from "../../../PropertyDemo";
import InviteForm from "../../../PropertyDemo/InviteForm";
import SelectField from "components/Common/FormFields/SelectField";

import { Drawer, Spin } from "antd";
import get from "lodash/get";
import * as Yup from "yup";
import { Steps } from "antd";
import isEmpty from "lodash/isEmpty";
import "../styles.scss";
import { UserDataContext } from "store/contexts/UserContext";
import { Fragment } from "react";

const { Step } = Steps;

const LocationSchema = Yup.object().shape({
  propertyId: Yup.string().nullable().required("Property Id is Required!"),
  dayAvailability: Yup.string().required(""),
  timeAvailability: Yup.string().required(""),
});

const Location = (props) => {
  const { state: userState } = useContext(UserDataContext);
  const { userData } = userState;
  const currentRole = userData.role;

  const [current, setCurrent] = useState(0);
  const [invitedLandlordData, setInvitedLandlordData] = useState({});
  const [isAddInvitePropertyDrawerOpen, toggleAddInvitePropertyDrawer] =
    useState(false);
  const [isAddPropertyDrawerOpen, toggleAddPropertyDrawer] = useState(false);
  const [properties, setProperties] = useState([]);
  const [locationData, setData] = useState(get(props, "locationData"));

  const [fetchPropertyTitleAndId, { loading }] = useLazyQuery(
    PropertyQuery.fetchPropertyTitleAndId,
    {
      onCompleted: (data) =>
        setProperties(get(data, "fetchPropertyTitleAndId.data", [])),
    }
  );

  useEffect(() => {
    fetchPropertyTitleAndId();

    //eslint-disable-next-line
  }, []);

  const [inviteLandlord] = useMutation(AccountQuery.inviteLandlord);

  const refreshProperty = () => {
    fetchPropertyTitleAndId();
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  let propertyOptions =
    !isEmpty(properties) &&
    properties.map((pr, i) => {
      return (
        <option key={i} value={pr.propertyId}>
          {pr.title}
        </option>
      );
    });
  useEffect(() => {
    setData(get(props, "locationData"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.locationData]);

  const steps = [
    {
      title: "Add Landlord Details",
      content: (
        <InviteForm
          next={next}
          invitedLandlordData={invitedLandlordData}
          setInvitedLandlordData={setInvitedLandlordData}
        />
      ),
    },
    {
      title: "Add Property",
      content: (
        <AddProperty
          setData={setData}
          landlordData={invitedLandlordData}
          toggleAddPropertyDrawer={() => {
            // inviteLandlord
            inviteLandlord({
              variables: {
                ...invitedLandlordData,
              },
            });
            toggleAddInvitePropertyDrawer(false);
          }}
          setProperties={refreshProperty}
          isDrawer={true}
          {...props}
        />
      ),
    },
  ];

  return (
    <Fragment>
      <p className="head--task">
        <b>New Task:</b> Say where and when task to be done
      </p>

      {/* FOrmik test */}

      <Formik
        enableReinitialize
        validationSchema={LocationSchema}
        initialValues={{ ...locationData }}
        onSubmit={(values, { setSubmitting }) => {
          props.setLocationData(values);
          props.setActiveClass(1);
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form key={values}>
            <Spin spinning={loading} tip="loading">
              <div className="col-md-12">
                <div className="form-group">
                  <label className="font-16">Select Property *</label>
                  <div className="form-group">
                    <div className="flex__div">
                      <div className="input-group-prepend">
                        <div className="input-group-text input_icon border-radius__l">
                          <i className="fas fa-map-marker-alt"></i>
                        </div>
                      </div>
                      <SelectField
                        placeholder="Select Property"
                        component="select"
                        name="propertyId"
                        onSelect={(e) => {
                          // e.preventDefault();
                          // let selectedVal = e.target.e;
                          let currentRoleText =
                            currentRole === "landlord"
                              ? "Add New"
                              : "Add New -Renter";
                          if (e === currentRoleText) {
                            currentRole === "landlord"
                              ? toggleAddPropertyDrawer(true)
                              : toggleAddInvitePropertyDrawer(true);
                          }
                          if (e !== currentRoleText) {
                            setFieldValue("propertyId", e);
                          }
                        }}
                        className="w-100"
                        required
                      >
                        {/* <option value disabled selected>
                        Select Property
                      </option> */}
                        {currentRole === "landlord" ? (
                          <option value="Add New">+ Add Property</option>
                        ) : (
                          <option value="Add New -Renter">
                            + Add Property and Invite
                          </option>
                        )}
                        {propertyOptions}
                      </SelectField>
                      {/* <input
                      className="form-control"
                      type="text"
                      placeholder="Property"
                    /> */}
                    </div>
                  </div>
                </div>
                <div className="availability--task">
                  <label>Select Day Availability</label>
                  <div className="form-group">
                    <div className="radio-box">
                      <label htmlFor="radio11">
                        <Field
                          type="radio"
                          value="Weekdays"
                          required
                          defaultChecked={
                            get(values, "dayAvailability") === "Weekdays"
                          }
                          name="dayAvailability"
                          id="radio11"
                        />
                        <div className="radio-item">
                          <span>Weekdays </span>
                        </div>
                      </label>
                      <label htmlFor="radio12">
                        <Field
                          type="radio"
                          value="Weekend"
                          name="dayAvailability"
                          defaultChecked={
                            get(values, "dayAvailability") === "Weekend"
                          }
                          id="radio12"
                        />
                        <div className="radio-item">
                          <span>Weekend</span>
                        </div>
                      </label>
                      <label htmlFor="radio13">
                        <Field
                          type="radio"
                          value="All Day"
                          name="dayAvailability"
                          defaultChecked={
                            get(values, "dayAvailability") === "All Day"
                          }
                          id="radio13"
                        />
                        <div className="radio-item">
                          <span>All Day</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  <label>Select Time Availability</label>
                  <div className="form-group">
                    <div className="radio-box">
                      <label htmlFor="radio21">
                        <Field
                          type="radio"
                          name="timeAvailability"
                          value="Morning 8 am - 12 pm"
                          required
                          defaultChecked={
                            get(values, "timeAvailability") ===
                            "Morning 8 am - 12 pm"
                          }
                          id="radio21"
                        />
                        <div className="radio-item">
                          <span>Morning 8 am - 12 pm </span>
                        </div>
                      </label>
                      <label htmlFor="radio22">
                        <Field
                          type="radio"
                          name="timeAvailability"
                          value="Afternoon 12 pm - 4 pm"
                          defaultChecked={
                            get(values, "timeAvailability") ===
                            "Afternoon 12 pm - 4 pm"
                          }
                          id="radio22"
                        />
                        <div className="radio-item">
                          <span>Afternoon 12 pm - 4 pm </span>
                        </div>
                      </label>
                      <label htmlFor="radio23">
                        <Field
                          type="radio"
                          name="timeAvailability"
                          value="Evening 4 pm - 8 pm"
                          defaultChecked={
                            get(values, "timeAvailability") ===
                            "Evening 4 pm - 8 pm"
                          }
                          id="radio23"
                        />
                        <div className="radio-item">
                          <span>Evening 4 pm - 8 pm </span>
                        </div>
                      </label>
                      <label htmlFor="radio24">
                        <Field
                          type="radio"
                          name="timeAvailability"
                          value="Any Time"
                          defaultChecked={
                            get(values, "timeAvailability") === "Any Time"
                          }
                          id="radio24"
                        />
                        <div className="radio-item">
                          <span>Any Time</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <button
                    type="submit"
                    // onClick={saveData}
                    className="btn btn-warning  pull-right"
                  >
                    Next &nbsp;
                    <i
                      className="fa fa-angle-double-right"
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>
              </div>
            </Spin>
          </Form>
        )}
      </Formik>

      <Drawer
        title="Add Property"
        placement="right"
        width={980}
        closable={true}
        maskClosable={false}
        destroyOnClose
        onClose={() => toggleAddPropertyDrawer(!isAddPropertyDrawerOpen)}
        visible={isAddPropertyDrawerOpen}
      >
        <AddProperty
          setData={setData}
          toggleAddPropertyDrawer={toggleAddPropertyDrawer}
          setProperties={setProperties}
          isDrawer={true}
          {...props}
        />
      </Drawer>

      <Drawer
        title="Invite Landlord and Add Rented Property"
        placement="right"
        width={980}
        closable={true}
        maskClosable={false}
        destroyOnClose
        onClose={() => {
          toggleAddInvitePropertyDrawer(!isAddInvitePropertyDrawerOpen);
        }}
        visible={isAddInvitePropertyDrawerOpen}
      >
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[current].content}</div>
        <div className="steps-action">
          {current > 0 && (
            <button
              className="btn btn-secondary"
              style={{ marginLeft: 8 }}
              onClick={() => prev()}
            >
              Previous
            </button>
          )}
        </div>
      </Drawer>
    </Fragment>
  );
};

export default Location;
