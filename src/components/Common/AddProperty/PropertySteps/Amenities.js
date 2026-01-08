import React from "react";
import { Formik, Form, Field } from "formik";
import get from "lodash/get";
import { createOrUpdateListingAmenitiesUtilities } from "config/queries/listing";
import { useMutation } from "@apollo/react-hooks";
import showNotification from "config/Notification";

import "../styles.scss";
import { Button } from "antd";

const Amenities = (props) => {
  // const [intialData, setInitialData] = useState(get(props, "listingData", {}));

  const [createOrUpdateListingAmenitiesUtilitiesMutation, { loading }] =
    useMutation(createOrUpdateListingAmenitiesUtilities, {
      onCompleted: ({ createOrUpdateListingAmenitiesUtilities }) => {
        if (get(createOrUpdateListingAmenitiesUtilities, "success", false)) {
          showNotification(
            "success",
            "Your changes have been successfully saved!"
          );
          props.setPropertyData((prevState) => ({
            ...prevState,
            isDraft: createOrUpdateListingAmenitiesUtilities?.data?.isDraft,
          }));
          props.setListingData({
            ...props.listingData,
            ...createOrUpdateListingAmenitiesUtilities.data,
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
    });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={props.listingData}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          await createOrUpdateListingAmenitiesUtilitiesMutation({
            variables: {
              propertyId: props.propertyData.propertyId,
              listingAmenities: values.amenities,
              listingUtilities: values.utility,
            },
          }).finally(() => setSubmitting(false));
        }}
      >
        {({ setFieldValue, values, dirty, handleSubmit }) => (
          <Form>
            <div className="row">
              <div className="col-md-12 schedule__left--wrapper">
                <h3 className="schedule__left--heading">
                  Provide additional details about amenities to get maximum
                  visibility
                </h3>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-8 col-md-12">
                <div className="amenities__listing">
                  <ul>
                    <li>
                      <Field
                        type="checkbox"
                        id="gate"
                        name="amenities"
                        value="gatedEntrance"
                        disabled={props.isPreviewMode}
                        checked={get(values, "amenities.gatedEntrance", false)}
                        className="largerCheckbox"
                        onChange={(e) =>
                          setFieldValue(
                            "amenities.gatedEntrance",
                            e.target.checked
                          )
                        }
                      />
                      <label for="gate">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/shield.png"
                          alt="loading..."
                        />
                        Gated Entrance
                      </label>
                    </li>
                    <li>
                      <Field
                        type="checkbox"
                        id="Intercom"
                        name="amenities"
                        value="intercom"
                        disabled={props.isPreviewMode}
                        checked={get(values, "amenities.intercom", false)}
                        className="largerCheckbox"
                        onChange={(e) =>
                          setFieldValue("amenities.intercom", e.target.checked)
                        }
                      />
                      <label for="Intercom">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/walkietalkie.png"
                          alt="loading..."
                        />
                        Intercom
                      </label>
                    </li>
                    <li>
                      <Field
                        type="checkbox"
                        id="Air Conditioner"
                        name="amenities"
                        disabled={props.isPreviewMode}
                        checked={get(values, "amenities.airConditioner", false)}
                        value="Air Conditioner"
                        className="largerCheckbox"
                        onChange={(e) =>
                          setFieldValue(
                            "amenities.airConditioner",
                            e.target.checked
                          )
                        }
                      />
                      <label for="Air Conditioner">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/air-conditioner.png"
                          alt="loading..."
                        />
                        Air Conditioner
                      </label>
                    </li>

                    <li>
                      <Field
                        type="checkbox"
                        id="Visitor Parking"
                        name="amenities"
                        value="Visitor Parking"
                        className="largerCheckbox"
                        disabled={props.isPreviewMode}
                        checked={get(values, "amenities.visitorParking", false)}
                        onChange={(e) =>
                          setFieldValue(
                            "amenities.visitorParking",
                            e.target.checked
                          )
                        }
                      />
                      <label for="Visitor Parking">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/carpark.png"
                          alt="loading..."
                        />
                        Visitor Parking
                      </label>
                    </li>
                    <li>
                      <Field
                        type="checkbox"
                        id="Conservatory"
                        name="amenities"
                        value="Conservatory"
                        disabled={props.isPreviewMode}
                        className="largerCheckbox"
                        checked={get(values, "amenities.conservatory", false)}
                        onChange={(e) =>
                          setFieldValue(
                            "amenities.conservatory",
                            e.target.checked
                          )
                        }
                      />
                      <label for="Conservatory">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/shield.png"
                          alt="loading..."
                        />
                        Conservatory
                      </label>
                    </li>
                    <li>
                      <Field
                        type="checkbox"
                        id="Gym"
                        name="amenities"
                        value="Gym"
                        disabled={props.isPreviewMode}
                        checked={get(values, "amenities.gym", false)}
                        className="largerCheckbox"
                        onChange={(e) =>
                          setFieldValue("amenities.gym", e.target.checked)
                        }
                      />
                      <label for="Gym">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/dumbbell.png"
                          alt="loading..."
                        />
                        Gym
                      </label>
                    </li>

                    <li>
                      <Field
                        type="checkbox"
                        id="Carpet Floors"
                        name="amenities"
                        value="Carpet Floors"
                        disabled={props.isPreviewMode}
                        className="largerCheckbox"
                        checked={get(values, "amenities.carpetFloors", false)}
                        onChange={(e) =>
                          setFieldValue(
                            "amenities.carpetFloors",
                            e.target.checked
                          )
                        }
                      />
                      <label for="Carpet Floors">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/carpet.png"
                          alt="loading..."
                        />
                        Carpet Floors
                      </label>
                    </li>
                    <li>
                      <Field
                        type="checkbox"
                        id="Wood Floors"
                        name="amenities"
                        value="Wood Floors"
                        disabled={props.isPreviewMode}
                        className="largerCheckbox"
                        checked={get(values, "amenities.woodFloors", false)}
                        onChange={(e) =>
                          setFieldValue(
                            "amenities.woodFloors",
                            e.target.checked
                          )
                        }
                      />
                      <label for="Wood Floors">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/wooden-floor.png"
                          alt="loading..."
                        />
                        Wood Floors
                      </label>
                    </li>
                    <li>
                      <Field
                        type="checkbox"
                        id="Waterfront"
                        name="amenities"
                        value="Waterfront"
                        disabled={props.isPreviewMode}
                        checked={get(values, "amenities.waterfront", false)}
                        className="largerCheckbox"
                        onChange={(e) =>
                          setFieldValue(
                            "amenities.waterfront",
                            e.target.checked
                          )
                        }
                      />
                      <label for="Waterfront">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/water-park.png"
                          alt="loading..."
                        />
                        Waterfront
                      </label>
                    </li>

                    <li>
                      <Field
                        type="checkbox"
                        id="Swimming Pool"
                        name="amenities"
                        value="Swimming Pool"
                        disabled={props.isPreviewMode}
                        checked={get(values, "amenities.swimmingPool", false)}
                        className="largerCheckbox"
                        onChange={(e) =>
                          setFieldValue(
                            "amenities.swimmingPool",
                            e.target.checked
                          )
                        }
                      />
                      <label for="Swimming Pool">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/swimming-filled.png"
                          alt="loading..."
                        />
                        Swimming Pool
                      </label>
                    </li>
                    <li>
                      <Field
                        type="checkbox"
                        id="Central Heating"
                        name="amenities"
                        disabled={props.isPreviewMode}
                        checked={get(values, "amenities.centralHeating", false)}
                        value="Central Heating"
                        onChange={(e) =>
                          setFieldValue(
                            "amenities.centralHeating",
                            e.target.checked
                          )
                        }
                        className="largerCheckbox"
                      />
                      <label for="Central Heating">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/heating-room.png"
                          alt="loading..."
                        />
                        Central Heating
                      </label>
                    </li>
                    <li>
                      <Field
                        type="checkbox"
                        id="Electric Oven"
                        name="amenities"
                        disabled={props.isPreviewMode}
                        checked={get(values, "amenities.ElectricOven", false)}
                        value="Electric Oven"
                        onChange={(e) =>
                          setFieldValue(
                            "amenities.ElectricOven",
                            e.target.checked
                          )
                        }
                        className="largerCheckbox"
                      />
                      <label for="Electric Oven">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/voltage.png"
                          alt="loading..."
                        />
                        Electric Oven
                      </label>
                    </li>

                    <li>
                      <Field
                        type="checkbox"
                        id="Basement / Loft"
                        name="amenities"
                        disabled={props.isPreviewMode}
                        checked={get(values, "amenities.basement", false)}
                        value="Basement / Loft"
                        className="largerCheckbox"
                        onChange={(e) =>
                          setFieldValue("amenities.basement", e.target.checked)
                        }
                      />
                      <label for="Basement / Loft">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/basement.png"
                          alt="loading..."
                        />
                        Basement / Loft
                      </label>
                    </li>
                    <li>
                      <Field
                        type="checkbox"
                        id="Park"
                        name="amenities"
                        disabled={props.isPreviewMode}
                        checked={get(values, "amenities.park", false)}
                        value="Park"
                        onChange={(e) =>
                          setFieldValue("amenities.park", e.target.checked)
                        }
                        className="largerCheckbox"
                      />
                      <label for="Park">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/park-bench.png"
                          alt="loading..."
                        />
                        Park
                      </label>
                    </li>
                    <li>
                      <Field
                        type="checkbox"
                        id="Gas Cooker"
                        disabled={props.isPreviewMode}
                        checked={get(values, "amenities.gasCooker", false)}
                        name="amenities"
                        value="Gas Cooker"
                        onChange={(e) =>
                          setFieldValue("amenities.gasCooker", e.target.checked)
                        }
                        className="largerCheckbox"
                      />
                      <label for="Gas Cooker">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/gas-industry.png"
                          alt="loading..."
                        />
                        Gas Cooker
                      </label>
                    </li>

                    <li>
                      <Field
                        type="checkbox"
                        id="Refrigerator"
                        name="amenities"
                        value="Refrigerator"
                        disabled={props.isPreviewMode}
                        checked={get(values, "amenities.refrigerator", false)}
                        onChange={(e) =>
                          setFieldValue(
                            "amenities.refrigerator",
                            e.target.checked
                          )
                        }
                        className="largerCheckbox"
                      />
                      <label for="Refrigerator">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/fridge.png"
                          alt="loading..."
                        />
                        Refrigerator
                      </label>
                    </li>
                    <li>
                      <Field
                        type="checkbox"
                        id="Lift"
                        name="amenities"
                        disabled={props.isPreviewMode}
                        checked={get(values, "amenities.lift", false)}
                        value="Lift"
                        onChange={(e) =>
                          setFieldValue("amenities.lift", e.target.checked)
                        }
                        className="largerCheckbox"
                      />
                      <label for="Lift">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/elevator.png"
                          alt="loading..."
                        />
                        Lift
                      </label>
                    </li>
                    <li>
                      <Field
                        type="checkbox"
                        id="Fireplace"
                        disabled={props.isPreviewMode}
                        checked={get(values, "amenities.fireplace", false)}
                        name="amenities"
                        value="Fireplace"
                        onChange={(e) =>
                          setFieldValue("amenities.fireplace", e.target.checked)
                        }
                        className="largerCheckbox"
                      />
                      <label for="Fireplace">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/fireplace.png"
                          alt="loading..."
                        />
                        Fireplace
                      </label>
                    </li>

                    <li>
                      <Field
                        type="checkbox"
                        id="Washer/Dryer"
                        name="amenities"
                        disabled={props.isPreviewMode}
                        checked={get(values, "amenities.washerDryer", false)}
                        value="Washer/Dryer"
                        onChange={(e) =>
                          setFieldValue(
                            "amenities.washerDryer",
                            e.target.checked
                          )
                        }
                        className="largerCheckbox"
                      />
                      <label for="Washer/Dryer">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/washing-machine.png"
                          alt="loading..."
                        />
                        Washer/Dryer
                      </label>
                    </li>
                    <li>
                      <Field
                        type="checkbox"
                        id="Diswasher"
                        name="amenities"
                        disabled={props.isPreviewMode}
                        checked={get(values, "amenities.dishWasher", false)}
                        value="Diswasher"
                        onChange={(e) =>
                          setFieldValue(
                            "amenities.dishWasher",
                            e.target.checked
                          )
                        }
                        className="largerCheckbox"
                      />
                      <label for="Diswasher">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/dishwasher.png"
                          alt="loading..."
                        />
                        Diswasher
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-4 col-md-12">
                <div className="schedule__gray--box">
                  <h4>Enter Utility Providers Name</h4>
                  <div className="form-group">
                    <label className="labels__global">Electricity</label>
                    <Field
                      type="text"
                      id="electricity"
                      className="form-control input__global"
                      name="utility.electricity"
                      placeholder="Company or Organization Name"
                      disabled={props.isPreviewMode}
                    />
                  </div>
                  <div className="form-group">
                    <label className="labels__global">Gas</label>
                    <Field
                      type="text"
                      id="gas"
                      className="form-control input__global"
                      name="utility.gas"
                      placeholder="Company or Organization Name"
                      disabled={props.isPreviewMode}
                    />
                  </div>
                  <div className="form-group">
                    <label className="labels__global">Water</label>
                    <Field
                      type="text"
                      id="water"
                      className="form-control input__global"
                      name="utility.water"
                      placeholder="Company or Organization Name"
                      disabled={props.isPreviewMode}
                    />
                  </div>
                  <div className="form-group">
                    <label className="labels__global">Council Tax</label>
                    <Field
                      type="text"
                      id="council_tax"
                      className="form-control input__global"
                      name="utility.councilTax"
                      placeholder="Company or Organization Name"
                      disabled={props.isPreviewMode}
                    />
                  </div>
                  <div className="form-group">
                    <label className="labels__global">Internet/Broadband</label>
                    <Field
                      type="text"
                      id="internet"
                      className="form-control input__global"
                      name="utility.internetBroadband"
                      placeholder="Company or Organization Name"
                      disabled={props.isPreviewMode}
                    />
                  </div>
                  <div className="form-group">
                    <label className="labels__global">Telephone</label>
                    <Field
                      type="text"
                      id="telephone"
                      className="form-control input__global"
                      name="utility.telephone"
                      placeholder="Company or Organization Name"
                      disabled={props.isPreviewMode}
                    />
                  </div>
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
                  ref={props.submitButtonRef}
                  className="btns__warning--schedule"
                  loading={loading}
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

export default Amenities;
