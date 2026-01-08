/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import get from "lodash/get";
import RentalDetailsSchema from "config/FormSchemas/RentalDetailsSchema";
import MyNumberInput from "config/CustomNumberInput";
import { Button, Tooltip } from "antd";
import RichTextEditor from "../../RichText";
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { useMutation } from "@apollo/react-hooks";
import { createOrUpdateListingDetail } from "config/queries/listing";
import showNotification from "config/Notification";

import "../styles.scss";
import "./rich-editor.css";

const RentalDetails = (props) => {
  const defaultDescription = `Could this ${props.propertyData.title} ${
    props.propertyData?.uniqueId &&
    !props.propertyData?.title?.includes(props.propertyData?.uniqueId)
      ? props.propertyData.uniqueId
      : ""
  } be your next rented home to live in? There are ${get(
    props,
    "propertyData.numberOfBed",
    0
  )} bedrooms, and ${get(
    props,
    "propertyData.numberOfBath",
    0
  )} bathrooms. <br />
  Just click “Send Message" if you have queries and the landlord will reply on instant chat messenger if online or get notified to respond as soon as available. <br />`;

  const blocksFromHTML = convertFromHTML(
    props.listingData.description !== null
      ? get(props, "listingData.description", defaultDescription)
      : defaultDescription
  );

  const [createOrUpdateListingDetailMutation, { loading }] = useMutation(
    createOrUpdateListingDetail,
    {
      onCompleted: ({ createOrUpdateListingDetail }) => {
        if (get(createOrUpdateListingDetail, "success", false)) {
          showNotification(
            "success",
            "Your changes have been successfully saved!"
          );
          props.setPropertyData((prevState) => ({
            ...prevState,
            isDraft: createOrUpdateListingDetail?.data?.isDraft,
          }));
          props.setListingData({
            ...props.listingData,
            ...createOrUpdateListingDetail.data,
          });
          props.updateActiveTab();
        } else {
          showNotification("error", "Failed to update listing detail", "");
        }
      },
      onError: (error) => {
        showNotification(
          "error",
          "Not able to update",
          "Reload page and try again"
        );
      },
    }
  );
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...props.listingData,
          editorState: EditorState.createWithContent(
            ContentState.createFromBlockArray(
              blocksFromHTML.contentBlocks,
              blocksFromHTML.entityMap
            )
          ),
        }}
        validationSchema={RentalDetailsSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const description = stateToHTML(
            values.editorState.getCurrentContent()
          );

          setSubmitting(true);

          await createOrUpdateListingDetailMutation({
            variables: {
              propertyId: props.propertyData.propertyId,
              listingDetail: {
                monthlyRent: values.monthlyRent,
                deposit: values.deposit,
                minimumDurationInMonth: values.minimumDurationInMonth,
                maxOccupancy: values.maxOccupancy,
                furnishing: values.furnishing,
                parking: values.parking,
                EPCRating: values.EPCRating,
                reasonEPC: values.reasonEPC,
                description,
                preference: values.preference,
                features: values.features,
              },
            },
          }).finally(() => setSubmitting(false));
        }}
      >
        {({ setFieldValue, values, handleBlur, dirty, handleSubmit }) => (
          <Form>
            {/* {!isEmpty(errors) && message.error("Please fill required data!")} */}
            <div className="row">
              <div className="col-lg-6 col-md-12 schedule__left--wrapper">
                <h3 className="special_space">
                  Tell More about Rental property listing?
                </h3>
                <div className="rentaldetail___form_wrap">
                  <ul>
                    <li>
                      <div className="form-group">
                        <label className="labels__global">Monthly Rent *</label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <div className="input-group-text">
                              <i className="fas fa-pound-sign"></i>
                            </div>
                          </div>
                          <MyNumberInput
                            name="monthlyRent"
                            placeholder="0.00"
                            className="form-control select__global"
                            mask="_"
                            required
                            disabled={props.isPreviewMode}
                            value={get(values, "monthlyRent")}
                            onValueChange={(val) =>
                              setFieldValue("monthlyRent", val.floatValue)
                            }
                          />
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="form-group">
                        <label className="labels__global">Deposit *</label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <div className="input-group-text">
                              <i className="fas fa-pound-sign"></i>
                            </div>
                          </div>
                          <MyNumberInput
                            name="deposit"
                            placeholder="0.00"
                            className="form-control select__global"
                            mask="_"
                            required
                            disabled={props.isPreviewMode}
                            value={get(values, "deposit")}
                            onValueChange={(val) =>
                              setFieldValue("deposit", val.floatValue)
                            }
                          />
                        </div>
                      </div>
                    </li>
                  </ul>
                  <ul>
                    <li>
                      <div className="form-group">
                        <label className="labels__global">
                          Minimum Duration in month *
                        </label>
                        <div className="input-group">
                          <Field
                            name="minimumDurationInMonth"
                            type="number"
                            min="1"
                            required
                            disabled={props.isPreviewMode}
                            className="form-control select__global"
                            autoComplete="off"
                            placeholder="Enter Duration"
                          />
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="form-group">
                        <label className="labels__global">
                          Max Occupancy *
                        </label>
                        <Field
                          component="select"
                          className="form-control"
                          name="maxOccupancy"
                          disabled={props.isPreviewMode}
                          required
                        >
                          <option defaultValue>Please Select</option>
                          {Array.from({ length: 8 }).map((d, i) => {
                            return (
                              <option value={i + 1} key={i}>
                                {i + 1}
                              </option>
                            );
                          })}
                        </Field>
                      </div>
                    </li>
                  </ul>
                  <ul>
                    <li>
                      <div className="form-group">
                        <label className="labels__global">Furnishing *</label>
                        <Field
                          component="select"
                          className="form-control"
                          name="furnishing"
                          disabled={props.isPreviewMode}
                          required
                        >
                          <option defaultValue>Please Select</option>
                          <option value="Furnished">Furnished</option>
                          <option value="Unfurnished">Un-furnished</option>
                          <option value="Partfurnished">Part-Furnished</option>
                        </Field>
                      </div>
                    </li>
                    <li>
                      <div className="form-group">
                        <label className="labels__global">Parking *</label>
                        <Field
                          component="select"
                          className="form-control"
                          name="parking"
                          disabled={props.isPreviewMode}
                          required
                        >
                          <option defaultValue>Please Select</option>
                          <option value="Yes"> Yes </option>
                          <option value="No"> No </option>
                        </Field>
                      </div>
                    </li>
                  </ul>
                  <ul>
                    <li>
                      <div className="form-group">
                        <label className="labels__global">
                          EPC Rating
                          <Tooltip
                            overlayClassName="tooltip__color"
                            title="Any properties rented out in the private rented sector to normally have a minimum energy performance rating of E on an Energy Performance Certificate (EPC).  Please find your EPC rating here- search by address - https://www.epcregister.com/reportSearchAddressByPostcode.html"
                          >
                            <img
                              src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                              alt="i"
                              className="ml-2"
                            />
                          </Tooltip>
                        </label>
                        <Field
                          component="select"
                          className="form-control"
                          name="EPCRating"
                          disabled={get(props, "isEpcDisabled", false)}
                          // disabled={props.isPreviewMode}
                          value={
                            get(props, "isEpcDisabled", false)
                              ? "EPC not required"
                              : get(values, "EPCRating")
                          }
                          onChange={(e) => {
                            setFieldValue("EPCRating", e.target.value);
                          }}
                        >
                          <option defaultValue>Please Select</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="E">E</option>
                          <option value="Currently being obtained">
                            Currently being obtained
                          </option>
                          <option
                            value="EPC not required"
                            id="epc_not_required"
                          >
                            EPC Not Required
                          </option>
                        </Field>
                      </div>
                    </li>
                    <li>
                      <div className="form-group">
                        <label className="labels__global">
                          Reason - EPC NOT required
                        </label>
                        <Field
                          component="select"
                          className="form-control"
                          name="reasonEPC"
                          disabled={
                            get(props, "isEpcDisabled", false) ||
                            get(values, "EPCRating", "EPC not required") !==
                              "EPC not required"
                          }
                          value={
                            get(props, "isEpcDisabled", false)
                              ? "None"
                              : get(values, "reasonEPC", undefined)
                          }
                          onChange={(e) => {
                            setFieldValue("reasonEPC", e.target.value);
                          }}
                        >
                          <option defaultValue>Please Select</option>
                          <option value="Reason1">Listed Building</option>
                          <option value="Reason2">
                            Temporary &lt; 2 years use life
                          </option>
                          <option value="Reason3">
                            Rent area &lt; 50 Sq m
                          </option>
                          <option value="Reason4">Due for demolition</option>
                          <option value="Reason5">
                            Holiday lets &lt; 4 months usage/p.a
                          </option>
                          <option value="Reason6">
                            Property not a building
                          </option>
                          <option value="Reason7">None</option>
                        </Field>
                      </div>
                    </li>
                  </ul>
                  <div className="form-group">
                    <label className="labels__global">Description</label>
                    <RichTextEditor
                      name="description"
                      editorState={values.editorState}
                      onChange={setFieldValue}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>
              </div>

              <div className="col-lg-6 col-md-12 schedule__right--wrapper">
                <h3 className="schedule__right--heading">
                  Suitability/Preference
                  <Tooltip
                    overlayClassName="tooltip__color"
                    title="Please tell us about who can apply for your property"
                  >
                    <img
                      src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                      alt="i"
                      className="ml-2"
                    />
                  </Tooltip>
                </h3>
                <div className="rentaldetail___form_wrap pt-4">
                  <ul>
                    <li>
                      <div className="form-group yes__no--toogle">
                        <label className="tab__deatils--label">
                          <span>Family</span>
                        </label>
                        <div className="btn-group btn__yes-no">
                          <label className="switch" htmlFor="family">
                            <input
                              onChange={(e) =>
                                setFieldValue(
                                  "preference.family",
                                  e.target.checked
                                )
                              }
                              checked={get(values, "preference.family", false)}
                              disabled={props.isPreviewMode}
                              type="checkbox"
                              id="family"
                            />
                            <div className="slider round"></div>
                          </label>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="form-group yes__no--toogle">
                        <label className="tab__deatils--label">
                          <span>Student</span>
                        </label>
                        <div className="switch-checkbox">
                          <label className="switch" htmlFor="student">
                            <input
                              onChange={(e) =>
                                setFieldValue(
                                  "preference.student",
                                  e.target.checked
                                )
                              }
                              checked={get(values, "preference.student", false)}
                              disabled={props.isPreviewMode}
                              type="checkbox"
                              id="student"
                            />
                            <div className="slider round"></div>
                          </label>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <ul>
                    <li>
                      <div className="form-group yes__no--toogle">
                        <label className="tab__deatils--label">
                          <span>Couple</span>
                        </label>
                        <div className="switch-checkbox btn__yes-no">
                          <label className="switch" htmlFor="couple">
                            <input
                              onChange={(e) =>
                                setFieldValue(
                                  "preference.couple",
                                  e.target.checked
                                )
                              }
                              checked={get(values, "preference.couple", false)}
                              disabled={props.isPreviewMode}
                              type="checkbox"
                              id="couple"
                            />
                            <div className="slider round"></div>
                          </label>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="form-group yes__no--toogle">
                        <label className="tab__deatils--label">
                          <span>Single</span>
                        </label>
                        <div className="switch-checkbox">
                          <label className="switch" htmlFor="single">
                            <input
                              onChange={(e) =>
                                setFieldValue(
                                  "preference.single",
                                  e.target.checked
                                )
                              }
                              checked={get(values, "preference.single", false)}
                              disabled={props.isPreviewMode}
                              type="checkbox"
                              id="single"
                            />
                            <div className="slider round"></div>
                          </label>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <ul>
                    <li>
                      <div className="form-group yes__no--toogle">
                        <label className="tab__deatils--label">
                          <span>Smoker</span>
                        </label>
                        <div className="switch-checkbox btn__yes-no">
                          <label className="switch" htmlFor="smoker">
                            <input
                              onChange={(e) =>
                                setFieldValue(
                                  "preference.smoker",
                                  e.target.checked
                                )
                              }
                              checked={get(values, "preference.smoker", false)}
                              disabled={props.isPreviewMode}
                              type="checkbox"
                              id="smoker"
                            />
                            <div className="slider round"></div>
                          </label>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="form-group yes__no--toogle">
                        <label className="tab__deatils--label">
                          <span>Pets</span>
                        </label>
                        <div className="switch-checkbox">
                          <label className="switch" htmlFor="pets">
                            <input
                              onChange={(e) =>
                                setFieldValue(
                                  "preference.pets",
                                  e.target.checked
                                )
                              }
                              checked={get(values, "preference.pets", false)}
                              defaultValue={false}
                              disabled={props.isPreviewMode}
                              type="checkbox"
                              id="pets"
                            />
                            <div className="slider round"></div>
                          </label>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <ErrorMessage name="preference">
                    {(msg) => (
                      <div style={{ color: "red" }}>
                        At least one is required
                      </div>
                    )}
                  </ErrorMessage>
                </div>
                <div className="features__wrap">
                  <h3 className="schedule__right--heading">
                    Features
                    <Tooltip
                      overlayClassName="tooltip__color"
                      title="Please tell us about any particular feature you'd like to highlight"
                    >
                      <img
                        src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                        alt="i"
                        className="ml-2 feature_tooltip"
                      />
                    </Tooltip>
                  </h3>
                  <ul>
                    <li>
                      <Field
                        type="checkbox"
                        id="Garden"
                        checked={get(values, "features.garden", false)}
                        defaultValue={false}
                        name="garden"
                        disabled={props.isPreviewMode}
                        onChange={(e) =>
                          !props.isPreviewMode &&
                          setFieldValue("features.garden", e.target.checked)
                        }
                        className="smallCheckbox"
                      />
                      <label htmlFor="Garden">Garden</label>
                    </li>
                    <li>
                      <Field
                        type="checkbox"
                        id="Bills"
                        checked={get(values, "features.billsIncluded", false)}
                        name="bills"
                        disabled={props.isPreviewMode}
                        onChange={(e) =>
                          setFieldValue(
                            "features.billsIncluded",
                            e.target.checked
                          )
                        }
                        className="smallCheckbox"
                      />
                      <label htmlFor="Bills">Bills Included</label>
                    </li>
                    <li>
                      <Field
                        type="checkbox"
                        id="Disabled"
                        name="gate"
                        disabled={props.isPreviewMode}
                        checked={get(
                          values,
                          "features.disabledAccessability",
                          false
                        )}
                        className="smallCheckbox"
                        onChange={(e) =>
                          setFieldValue(
                            "features.disabledAccessability",
                            e.target.checked
                          )
                        }
                      />
                      <label htmlFor="Disabled">Disabled Accesibility</label>
                    </li>
                    <li>
                      <Field
                        type="checkbox"
                        id="Balcony"
                        name="gate"
                        disabled={props.isPreviewMode}
                        checked={get(values, "features.balconyPatio", false)}
                        onChange={(e) =>
                          setFieldValue(
                            "features.balconyPatio",
                            e.target.checked
                          )
                        }
                        className="smallCheckbox"
                      />
                      <label htmlFor="Balcony">Balcony/patio</label>
                    </li>
                    <li>
                      <Field
                        type="checkbox"
                        id="Ensuite"
                        name="gate"
                        disabled={props.isPreviewMode}
                        checked={get(
                          values,
                          "features.unsuitedBathroom",
                          false
                        )}
                        onChange={(e) =>
                          setFieldValue(
                            "features.unsuitedBathroom",
                            e.target.checked
                          )
                        }
                        className="smallCheckbox"
                      />
                      <label htmlFor="Ensuite">Ensuite Bathroom</label>
                    </li>
                    <li>
                      <Field
                        type="checkbox"
                        id="Laundry"
                        name="gate"
                        disabled={props.isPreviewMode}
                        checked={get(
                          values,
                          "features.laundryUtilityRoom",
                          false
                        )}
                        onChange={(e) =>
                          setFieldValue(
                            "features.laundryUtilityRoom",
                            e.target.checked
                          )
                        }
                        className="smallCheckbox"
                      />
                      <label htmlFor="Laundry">Laundry/Utility room</label>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <hr />
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 text-right">
                <Button
                  size="large"
                  type="submit"
                  disabled={loading}
                  className="btns__warning--schedule"
                  loading={loading}
                  ref={props.submitButtonRef}
                  onClick={(e) => {
                    e.preventDefault();
                    if (dirty) {
                      handleSubmit();
                    } else {
                      props.updateActiveTab();
                    }
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default RentalDetails;
