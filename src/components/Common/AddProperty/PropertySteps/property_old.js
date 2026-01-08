import React, { useState, useRef, useEffect } from "react";
import LoqateAddress from "config/AddressAutoCompleteLoqate";
import LoqateAddressFull from "config/LoqateGetFullAddress";
import { withRouter } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import find from "lodash/find";
import { useQuery } from "@apollo/react-hooks";
import PropertyQuery from "config/queries/property";
import SuggestionDropdown from "SettingsTabs/CommonInfo/Downshift";
import useForceUpdate from "use-force-update";
import SelectField from "components/Common/FormFields/SelectField";

import "components/Common/SettingsTabs/CommonInfo/stylesConnect.scss";
import "components/Common/PropertyDemo/style.scss";


const AddressComp = props => {
  const forceUpdate = useForceUpdate();

  let allProperties = get(props, "allProperties", []);

  const formRef = useRef(null);
  const { data } = useQuery(PropertyQuery.getPropertyType);
  let subTypes = get(data, "getPropertyType.data");
  const [isFormSubmitting, setFormSubmitting] = useState(false);
  const [initialDataProperty, setInitialData] = useState(
    get(props, "propertyData", {})
  );

  useEffect(() => {
    if (!isEmpty(get(props, "propertyData", {}))) {
      setInitialData(get(props, "propertyData", {}));
    }
  }, [props]);

  const saveData = async data => {
    let documents = [];
    setFormSubmitting(true);

    data.documents = documents;
    saveProperty(data);
  };

  const saveProperty = async data => {
    props.setPropertyData(data);
    props.setActiveTab(1);
  };

  const findAddress = async address => {
    let fullAddress = await LoqateAddressFull(address.Id);
    let completeAddress = fullAddress.Items[0];
    if (completeAddress) {
      // setInitialData

      let addressObj = {
        fullAddress: completeAddress.Label,
        addressLine1: completeAddress["Company"]
          ? completeAddress["Company"]
          : completeAddress["Line1"],
        addressLine2: completeAddress["Company"]
          ? `${completeAddress["Line1"]}, ${completeAddress["Line2"]}`
          : completeAddress["Line2"],
        city: completeAddress["City"],
        state: completeAddress["Province"],
        zip: completeAddress["PostalCode"],
        country: completeAddress["CountryName"],
        ...completeAddress
      };

      let obj = initialDataProperty;
      obj["address"] = addressObj;
      setInitialData(obj);
      setLoqateData({ address: addressObj });
    }
  };
  // address
  const [loqateData, setLoqateData] = useState({
    address: get(props, "location.state.address", {})
  });

  let submitBtnToShow = get(props, "location.pathname").includes("listing") ? (
    <button
      type="submit"
      disabled={isFormSubmitting}
      className="btn add--listing"
    >
      Save and Next{" "}
      <i className="fa fa-angle-double-right" aria-hidden="true"></i>
    </button>
  ) : (
    <>
      <button type="button" disabled={isFormSubmitting} className="btn cancel">
        Cancel
      </button>
      <button
        type="submit"
        disabled={isFormSubmitting}
        className="btn btn-primary"
      >
        Create Property
      </button>
      <button
        type="button"
        onClick={() => {
          props.history.push("listing", {
            ...get(loqateData, "address"),
            ...get(formRef, "current.state.values")
          });
        }}
        disabled={isFormSubmitting}
        className="btn add--listing"
      >
        Add Listing
      </button>
    </>
  );

  const selectProperty = async property => {
    let obj = initialDataProperty;
    // eslint-disable-next-line array-callback-return
    let setData = Object.keys(property).map((p, i) => {
      obj[p] = property[p];
    });

    await Promise.all(setData);
    setInitialData(obj);
    forceUpdate();
  };

  return (
    <>
      <div className="col-md-12">
        <div className="title__input">
          <label>Which Property is this Listing for?</label>
          <SelectField
            disabled={!props.isListingAdd || props.isPreviewMode}
            name="propertyId"
            placeholder="Select Property"
            onChange={value => {
              if (value !== "new") {
                selectProperty(
                  find(allProperties, { propertyId: value })
                );
              }

              if (value === "new") {
                props.history.push("/landlord/property/add");
              }
            }}
            defaultValue={initialDataProperty.propertyId}
            className="w-100"
            required
          >
            {!isEmpty(allProperties) &&
              allProperties.map((p, i) => {
                return <option value={p.propertyId} key={p.propertyId}>{p.title}</option>;
              })}
            <option value="new">Add New Property</option>
          </SelectField>
        </div>
      </div>
      <Formik
        enableReinitialize
        ref={formRef}
        initialValues={initialDataProperty}
        onSubmit={(values, { validateForm, setSubmitting }) => {
          setSubmitting(true);
          // values.propertyId = values.propertyId;
          // delete values["_id"];
          if (!isEmpty(initialDataProperty)) {
            saveData(values);
          }
        }}
      >
        {({ isSubmitting, setFieldValue, values, errors }) => (
          <Form>
            <div>
              <div className="property--wrap">
                <div className="container">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="property-input_wrapper">
                        <label className="mt-4">
                          Let's start with property location
                        </label>
                        <div className="form-group">
                          <SuggestionDropdown
                            LoqateAddress={LoqateAddress}
                            findAddress={findAddress}
                            loqateData={get(values, "address")}
                          />
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
                            placeholder="Address Line 2"
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
                        <label className="mt-4 type__property">
                          What type of property do you have?
                        </label>
                        <ul>
                          <li>
                            <div
                              onClick={() =>
                                setFieldValue("propertyType", "House")
                              }
                              className={`property--type ${get(
                                values,
                                "propertyType",
                                ""
                              ) === "House" && "active"}`}
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
                              className={`property--type ${get(
                                values,
                                "propertyType",
                                ""
                              ) === "Apartment" && "active"}`}
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
                              className={`property--type ${get(
                                values,
                                "propertyType",
                                ""
                              ) === "Shared Property" && "active"}`}
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
                              className={`property--type ${get(
                                values,
                                "propertyType",
                                ""
                              ) === "Other" && "active"}`}
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
                          <label>Property Sub-Type*</label>
                          <Field
                            component=""
                            name="subType"
                            className="form-control"
                          >
                            <option selected disabled>
                              Select Subtype
                            </option>
                            {find(subTypes, {
                              propertyName: get(values, "propertyType")
                            }) &&
                              !isEmpty(
                                find(subTypes, {
                                  propertyName: get(values, "propertyType")
                                }).propertySubType
                              ) &&
                              find(subTypes, {
                                propertyName: get(values, "propertyType")
                              }).propertySubType.map((sub, j) => {
                                return (
                                  <option key={sub} value={sub}>
                                    {sub}
                                  </option>
                                );
                              })}
                          </Field>
                          {/*  */}
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <label>Number of bed *</label>
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
                                  type="number"
                                  required
                                  min={0}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label>Number of bath *</label>
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
                                  type="number"
                                  required
                                  min={0}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label>Number of reception *</label>
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
                                  type="number"
                                  required
                                  min={0}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label>Size in Sq. Feet</label>
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
                                  type="number"
                                  required
                                  min={0}
                                >
                                </Field>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 property__btn">
                      {submitBtnToShow}
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
