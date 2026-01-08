import React, { useState, useEffect } from "react";
import { Datepicker } from "react-formik-ui";
import { Formik, Form, ErrorMessage } from "formik";
import MyNumberInput from "../../../../../../config/CustomNumberInput";
import * as Yup from "yup";
// import moment from "moment";

const ProfessionFormSection = (props) => {
  const [smoking, setSmokingStatus] = useState(props.otherInformation.smoking);
  const [disability, setDisabledStatus] = useState(
    props.otherInformation.disability
  );
  const [incomeSupport, setIncomeSupportStatus] = useState(
    props.otherInformation.incomeSupport
  );

  const OtherInfoFormSchema = Yup.object().shape({
    noOfAdult: Yup.number()
      .min(1, "Must be more than 1")
      .max(9, "Must be less than 9")
      .nullable(),
    noOfChild: Yup.number()
      .min(1, "Must be more than 1")
      .max(9, "Must be less than 9")
      .nullable(),
    noOfPets: Yup.number()
      .max(9, "Must be less than 9")
      .nullable(),
    noOfCars: Yup.number()
      .min(1, "Must be more than 1")
      .max(9, "Must be less than 9")
      .nullable(),
  });

  useEffect(() => {
    setSmokingStatus(props.otherInformation.smoking);
    setDisabledStatus(props.otherInformation.disability);
    setIncomeSupportStatus(props.otherInformation.incomeSupport);
  }, [props, props.accountPreferences]);

  // let accountSetting = props.accountSetting;
  return (
    <Formik
      enableReinitialize
      initialValues={{ ...props.otherInformation }}
      //   validationSchema={props.LandlordPersonaSchema.ProfessionSchema}
      validationSchema={OtherInfoFormSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        values.smoking = smoking;
        values.disability = disability;
        values.incomeSupport = incomeSupport;
        props.saveOtherInformation({
          ...values,
          noOfPets: !values.noOfPets ? 0 : values.noOfPets,
        });
      }}
      validateOnChange
    >
      {({ isSubmitting, handleBlur, setFieldValue, values, errors }) => (
        <Form>
          <div className="otherinfo__tabs">
            <div className="tab__details">
              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <div className="flex__div">
                      <div className="input-group-prepend">
                        <div className="input-group-text input_icon border-radius__l">
                          <i className="mdi mdi-account-tie" />
                        </div>
                      </div>
                      <MyNumberInput
                        placeholder="No. of Adult"
                        name="noOfAdult"
                        className={
                          errors && errors["noOfAdult"]
                            ? "tab__deatils--input error__field_show"
                            : "tab__deatils--input"
                        }
                        mask="_"
                        errors={errors}
                        value={values.noOfAdult !== 0 && values.noOfAdult}
                        onBlur={handleBlur}
                        onValueChange={(val) =>
                          setFieldValue("noOfAdult", val.floatValue)
                        }
                      />
                    </div>
                    <ErrorMessage
                      name="noOfAdult"
                      component="div"
                      className="all__errors"
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <div className="flex__div">
                      <div className="input-group-prepend">
                        <div className="input-group-text input_icon border-radius__l">
                          <i className="mdi mdi-baby" />
                        </div>
                      </div>
                      <MyNumberInput
                        placeholder="No of child"
                        name="noOfChild"
                        className={
                          errors && errors["noOfChild"]
                            ? "tab__deatils--input error__field_show"
                            : "tab__deatils--input"
                        }
                        mask="_"
                        value={values.noOfChild !== 0 && values.noOfChild}
                        onBlur={handleBlur}
                        onValueChange={(val) =>
                          setFieldValue("noOfChild", val.floatValue)
                        }
                      />
                    </div>
                    <ErrorMessage
                      name="noOfChild"
                      component="div"
                      className="all__errors"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <div className="flex__div">
                      <div className="input-group-prepend">
                        <div className="input-group-text input_icon border-radius__l">
                          <i className="mdi mdi-dog-side" />
                        </div>
                      </div>
                      <MyNumberInput
                        placeholder="No of pets"
                        name="noOfPets"
                        className={
                          errors && errors["noOfPets"]
                            ? "tab__deatils--input error__field_show"
                            : "tab__deatils--input"
                        }
                        mask="_"
                        value={values.noOfPets !== 0 && values.noOfPets}
                        onBlur={handleBlur}
                        onValueChange={(val) =>
                          setFieldValue("noOfPets", val.floatValue)
                        }
                      />
                    </div>
                    <ErrorMessage
                      name="noOfPets"
                      component="div"
                      className="all__errors"
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <div className="flex__div">
                      <div className="input-group-prepend">
                        <div className="input-group-text input_icon border-radius__l">
                          <i className="mdi mdi-car" />
                        </div>
                      </div>
                      <MyNumberInput
                        placeholder="No of cars"
                        name="noOfCars"
                        className={
                          errors && errors["noOfCars"]
                            ? "tab__deatils--input error__field_show"
                            : "tab__deatils--input"
                        }
                        mask="_"
                        value={values.noOfCars !== 0 && values.noOfCars}
                        onBlur={handleBlur}
                        onValueChange={(val) =>
                          setFieldValue("noOfCars", val.floatValue)
                        }
                      />
                    </div>
                    <ErrorMessage
                      name="noOfCars"
                      component="div"
                      className="all__errors"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <div className="flex__div">
                      <div className="input-group-prepend">
                        <div className="input-group-text input_icon border-radius__l">
                          <i className="fa fa-calendar" />
                        </div>
                      </div>
                      <Datepicker
                        name="moveInDate"
                        placeholder="Move In Date"
                        todayButton="Today"
                        showYearDropdown
                        dateFormat={"dd-MM-yyyy"}
                        showMonthDropdown
                        dropdownMode={"select"}
                        style={{ width: "100%" }}
                        disabledKeyboardNavigation={false}
                        className={
                          errors && errors["moveInDate"]
                            ? "tab__deatils--input error__field_show"
                            : "tab__deatils--input"
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <div className="form-group yes__no--toogle">
                      <label className="tab__deatils--label toggle_icon">
                        <i className="mdi mdi-smoking fs-22"></i> Smoking?
                      </label>
                      <div className="btn-group ml-3">
                        <label className="switch" for="smoking">
                          <input
                            onChange={(e) => setSmokingStatus(e.target.checked)}
                            checked={smoking}
                            disabled={props.isPreviewMode}
                            type="checkbox"
                            id="smoking"
                          />
                          <div className="slider round"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group yes__no--toogle">
                    <label className="tab__deatils--label toggle_icon">
                      <i className="mdi mdi-wheelchair-accessibility fs-22"></i>{" "}
                      Disability?
                    </label>
                    <div className="btn-group ml-3">
                      <label className="switch" for="disability">
                        <input
                          onChange={(e) => setDisabledStatus(e.target.checked)}
                          disabled={props.isPreviewMode}
                          checked={disability}
                          type="checkbox"
                          id="disability"
                        />
                        <div className="slider round"></div>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group yes__no--toogle mb-3">
                    <label className="tab__deatils--label toggle_icon">
                      <i className="mdi mdi-account-supervisor fs-22"></i>{" "}
                      Income Support ?
                    </label>
                    <div className="btn-group ml-3">
                      <label className="switch" for="incomesupport">
                        <input
                          onChange={(e) =>
                            setIncomeSupportStatus(e.target.checked)
                          }
                          checked={incomeSupport}
                          disabled={props.isPreviewMode}
                          type="checkbox"
                          id="incomesupport"
                        />
                        <div className="slider round"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4">
                  <div className="form-group">
                    <button
                      hidden={props.hideSaveButton}
                      ref={props.otherInformationRef}
                      type="submit"
                      className="btn btn-primary btn-sm px-5"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ProfessionFormSection;
