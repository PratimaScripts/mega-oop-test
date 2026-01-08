import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import find from "lodash/find";
import { useQuery } from "@apollo/react-hooks";
import PropertyQuery from "../../../../config/queries/property";
import useForceUpdate from "use-force-update";
import SelectField from "components/Common/FormFields/SelectField";
import { LoadingOutlined } from "@ant-design/icons";


import "components/Common/SettingsTabs/CommonInfo/stylesConnect.scss";
import "components/Common/PropertyDemo/style.scss";

const AddressComp = (props) => {
  const forceUpdate = useForceUpdate();

  let allProperties = get(props, "allProperties", []);

  // const formRef = useRef(null);
  const { data } = useQuery(PropertyQuery.getPropertyType);
  let subTypes = get(data, "getPropertyType.data");
  const [isFormSubmitting] = useState(false);
  const [initialDataProperty, setInitialData] = useState(
    get(props, "propertyData", {})
  );

  // useEffect(() => {
  //   if (!isEmpty(get(props, "propertyData", {}))) {
  //     setInitialData(get(props, "propertyData", {}));
  //   }
  // }, [props]);

  const selectProperty = async (property) => {
    setInitialData(property);

    props.setListingData(get(property, "listing", {}));
    props.setPropertyData(property);
    forceUpdate();
  };

  // const updatePropertySubType = (propertyType) => {
  //   // if (isUpdateProperty()) {
  //     getValues("propertyType") === defaultValues.propertyType
  //       ? setValue("subType", defaultValues.subType)
  //       : setValue("subType", undefined);
  //   // }
  //   forceUpdate();
  // };

  return (
    <>
      <Formik
        enableReinitialize
        // ref={formRef}
        initialValues={initialDataProperty}
        onSubmit={(values, { validateForm, setSubmitting }) => {
          setSubmitting(true);
          // values.propertyId = values.propertyId;
          // delete values["_id"];
          // if (!isEmpty(initialDataProperty)) {
          //   saveData(values);
          // }
          props.updatePropertyData(values);
        }}
      >
        {({ isSubmitting, setFieldValue, values, errors }) => (
          <Form>
            <div>
              <div className="property--wrap">
                <div className="m-3">
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="property-input_wrapper">
                        <div className="title__input">
                          <label className="head_label mb-2">
                            Which Property is this Listing for?
                          </label>
                          <label className="label_title_input">
                            Choose a property
                          </label>
                          <div className="form-group">
                            <div className="flex__div">
                              <div className="input-group-prepend">
                                <div className="input-group-text input_icon border-radius__l">
                                  <i className="fa fa-map-marker"></i>
                                </div>
                              </div>
                              <SelectField
                                disabled={
                                  !props.isListingAdd || props.isPreviewMode
                                }
                                name="propertyId"
                                placeholder="Select Property"
                                onChange={(value) => {
                                  if (value !== "new") {
                                    selectProperty(
                                      find(allProperties, { propertyId: value })
                                    );
                                  }

                                  if (value === "new") {
                                    props.history.push(
                                      "/landlord/property/add?redirect=true"
                                    );
                                  }
                                }}
                                defaultValue={initialDataProperty.propertyId}
                                className="w-100"
                                required
                              >
                                <option value="new">Add New Property</option>
                                {!isEmpty(allProperties) &&
                                  allProperties.map((p, i) => {
                                    return (
                                      <option
                                        value={p.propertyId}
                                        key={p.propertyId}
                                      >
                                        {p.title}{" "}
                                        {p.uniqueId &&
                                        !p.title?.includes(p.uniqueId)
                                          ? p.uniqueId
                                          : ""}
                                      </option>
                                    );
                                  })}
                              </SelectField>
                            </div>
                          </div>
                        </div>

                        <label className="label_title_input mt-2">
                          Let's start with property location?
                        </label>
                        <div className="form-group">
                          {/* <Field
                            type="text"
                            id="Label"
                            name="Label"
                            value={get(values, "address.Label")}
                            className="form-control"
                            placeholder="Start typing your address and Select from option"
                            disabled
                          /> */}
                          {/* <SuggestionDropdown
                            LoqateAddress={LoqateAddress}
                            findAddress={findAddress}
                            loqateData={get(values, "address")}
                            disabled={true}
                          /> */}
                        </div>
                        <div className="form-group"></div>
                        <div className="form-group">
                          <Field
                            type="text"
                            id="line1"
                            name="addressLine1"
                            value={get(values, "address.addressLine1")}
                            className="form-control"
                            placeholder="Address Line 1*"
                            disabled
                          />
                        </div>
                        <div className="form-group">
                          <Field
                            type="text"
                            id="line2"
                            name="addressLine2"
                            value={get(values, "address.addressLine2")}
                            className="form-control"
                            placeholder="Address Line 2*"
                            disabled
                          />
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <Field
                                type="text"
                                id="city"
                                name="city"
                                value={get(values, "address.city")}
                                className="form-control"
                                placeholder="City *"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <Field
                                type="text"
                                id="zip"
                                name="zip"
                                value={get(values, "address.zip")}
                                className="form-control"
                                placeholder="Post Code/ZIP *"
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <Field
                                type="text"
                                id="province"
                                name="state"
                                value={get(values, "address.state")}
                                className="form-control"
                                placeholder="Country / State / Region"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <Field
                                type="text"
                                id="country"
                                name="country"
                                value={get(values, "address.country")}
                                className="form-control"
                                placeholder="Country *"
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="type__property--wrapper">
                        <label className="label_title_input type__property">
                          What type of property do you have?
                        </label>
                        <ul>
                          <li>
                            <div
                              onClick={() =>
                                setFieldValue("propertyType", "House")
                              }
                              className={`property--type ${
                                get(values, "propertyType", "") === "House" &&
                                "active"
                              }`}
                            >
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/house.png"
                                alt="loading..."
                              />
                            </div>
                            <p>House</p>
                          </li>
                          <li>
                            <div
                              onClick={() =>
                                setFieldValue("propertyType", "Apartment")
                              }
                              className={`property--type ${
                                get(values, "propertyType", "") ===
                                  "Apartment" && "active"
                              }`}
                            >
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/appartment.png"
                                alt="loading..."
                              />
                            </div>
                            <p>Apartment</p>
                          </li>
                          <li>
                            <div
                              onClick={() =>
                                setFieldValue("propertyType", "Shared Property")
                              }
                              className={`property--type ${
                                get(values, "propertyType", "") ===
                                  "Shared Property" && "active"
                              }`}
                            >
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/Shared.png"
                                alt="loading..."
                              />
                            </div>
                            <p>Shared Property</p>
                          </li>
                          <li>
                            <div
                              onClick={() =>
                                setFieldValue("propertyType", "Other")
                              }
                              className={`property--type ${
                                get(values, "propertyType", "") === "Other" &&
                                "active"
                              }`}
                            >
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/other.png"
                                alt="loading..."
                              />
                            </div>
                            <p>Other</p>
                          </li>
                        </ul>
                        <div className="property--sub__type">
                          <label className="label_title_input">
                            Property Sub-Type*
                          </label>
                          <Field
                            component="select"
                            name="subType"
                            className="form-control"
                            // disabled
                            defaultValue="select"
                          >
                            <option key="select" value="select">
                              Select Subtype
                            </option>
                            {find(subTypes, {
                              propertyName: get(values, "propertyType"),
                            }) &&
                              !isEmpty(
                                find(subTypes, {
                                  propertyName: get(values, "propertyType"),
                                }).propertySubType
                              ) &&
                              find(subTypes, {
                                propertyName: get(values, "propertyType"),
                              }).propertySubType.map((sub, j) => {
                                return (
                                  <option key={j} value={sub}>
                                    {sub}
                                  </option>
                                );
                              })}
                          </Field>
                          {/*  */}
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <label className="label_title_input">
                              Number of bed *
                            </label>
                            <div className="form-group">
                              <div className="flex__div">
                                <div className="input-group-prepend">
                                  <div className="input-group-text input_icon border-radius__l">
                                    <i className="fas fa-bed"></i>
                                  </div>
                                </div>
                                <Field
                                  autoComplete={"none"}
                                  placeholder="No. of Beds"
                                  name="numberOfBed"
                                  className="tab__deatils--input"
                                  style={{height: 42}}
                                  type="number"
                                  required
                                  min={1}
                                  // disabled
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label className="label_title_input">
                              Number of bath *
                            </label>
                            <div className="form-group">
                              <div className="flex__div">
                                <div className="input-group-prepend">
                                  <div className="input-group-text input_icon border-radius__l">
                                    <i className="fas fa-bath"></i>
                                  </div>
                                </div>
                                <Field
                                  autoComplete={"none"}
                                  placeholder="No. of Bath"
                                  name="numberOfBath"
                                  className="tab__deatils--input"
                                  style={{height: 42}}
                                  type="number"
                                  required
                                  min={0}
                                  // disabled
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label className="label_title_input">
                              Number of reception *
                            </label>
                            <div className="form-group">
                              <div className="flex__div">
                                <div className="input-group-prepend">
                                  <div className="input-group-text input_icon border-radius__l">
                                    <i className="fas fa-couch"></i>
                                  </div>
                                </div>
                                <Field
                                  autoComplete={"none"}
                                  name="numberOfReception"
                                  placeholder="No. of reception"
                                  className="tab__deatils--input"
                                  style={{height: 42}}
                                  type="number"
                                  required
                                  min={0}
                                  // disabled
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label className="label_title_input">
                              Size in Sq. Feet
                            </label>
                            <div className="form-group">
                              <div className="flex__div">
                                <div className="input-group-prepend">
                                  <div className="input-group-text input_icon border-radius__l">
                                    <i className="fas fa-tape"></i>
                                  </div>
                                </div>
                                <Field
                                  autoComplete={"none"}
                                  placeholder="Size in Sq. Feet"
                                  name="sizeInSquareFeet"
                                  className="tab__deatils--input"
                                  style={{height: 42}}
                                  type="number"
                                  required
                                  min={0}
                                  // disabled
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 property__btn">
                      <button
                        type="submit"
                        ref={props.submitButtonRef}
                        disabled={isFormSubmitting || isSubmitting}
                        className="btn add--listing"
                      >
                        {isSubmitting ? <LoadingOutlined /> : "Save & Next "}
                        <i
                          className="fa fa-angle-double-right"
                          aria-hidden="true"
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};
export default withRouter(AddressComp);
