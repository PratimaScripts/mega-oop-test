/* eslint-disable array-callback-return */
import React, { useEffect, useState, useRef } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PropertySteps from "./PropertySteps";
import { withRouter } from "react-router-dom";
import showNotification from "config/Notification";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import PropertyQueries from "config/queries/property";
import NProgress from "nprogress";
import PropertyQuery from "config/queries/property";

import get from "lodash/get";
import "./styles.scss";

const AddListing = (props) => {
  // const { dispatch: interfaceDispatch } = useContext(InterfaceContext)

  const visitedTabs = useRef([0]);

  let isPreviewMode = window.location.pathname.includes("listing/preview")
    ? true
    : false;

  const isListingAdd = window.location.pathname.includes("listings/add")
    ? true
    : false;

  const [listingData, setListingData] = useState(
    get(props, "location.state.selectedProperty.listing", {})
  );

  const [isEnabled, setEnabled] = useState(
    get(listingData, "listingId") ? true : false || isPreviewMode
  );

  const [propertyData, setPropertyData] = useState(
    get(props, "location.state.selectedProperty", {})
  );

  const submitButtonRef = useRef();

  const [activeTab, setActiveTab] = useState(
    window.location.href.includes("listing") &&
      window.location.href.includes("listing/edit")
      ? 1
      : 0
  );
  const activeTabIndexRef = useRef(activeTab);

  const [fetchPropertyQuery] = useLazyQuery(PropertyQueries.getPropertyById, {
    onCompleted: ({ getPropertyById }) => {
      NProgress.done();
      if (getPropertyById.success) {
        const data = getPropertyById.data;
        for (var propName in data) {
          if (data[propName] === null || data[propName] === undefined) {
            delete data[propName];
          }
        }
        setPropertyData(data);
        setListingData(data.listing);
      }
    },
  });

  useEffect(() => {
    if (propertyData?.propertyId) {
      NProgress.start();
      fetchPropertyQuery({
        variables: {
          propertyId: propertyData.propertyId,
          isDraft: window.location.href.includes("listing/edit"),
        },
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyData]);

  const [updatePropertyMutation] = useMutation(PropertyQuery.updateProperty, {
    onCompleted: ({ updateProperty }) => {
      if (get(updateProperty.success)) {
        setPropertyData(updateProperty.data);
      }
      NProgress.done();
      setActiveTab(activeTab + 1);
    },
  });

  const updatePropertyData = async (data) => {
    NProgress.start();
    const updateDataPromise = Object.keys(data).map((propName, i) => {
      if (data[propName] === null || data[propName] === undefined) {
        delete data[propName];
      }
    });
    await Promise.all(updateDataPromise);

    updatePropertyMutation({ variables: { ...propertyData, ...data } });
  };

  const updateListingData = async (data) => {
    NProgress.start();
    const updateDataPromise = Object.keys(data).map((propName, i) => {
      if (data[propName] === null || data[propName] === undefined) {
        delete data[propName];
      }
    });
    await Promise.all(updateDataPromise);

    // const dataToUpdate = {...propertyData, ...listingData, ...data}
    const dataToUpdate = { ...data };
    delete dataToUpdate["listing"];

    const updateListingDataPromise = Object.keys(dataToUpdate).map(
      (propName, i) => {
        if (
          dataToUpdate[propName] === null ||
          dataToUpdate[propName] === undefined
        ) {
          delete dataToUpdate[propName];
        }
      }
    );
    await Promise.all(updateListingDataPromise);

    if (listingData?.listingId) {
      updateListingMutation({ variables: dataToUpdate });
    } else {
      createListingMutation({ variables: dataToUpdate });
    }

    setActiveTab(activeTab + 1);
  };

  const updateActiveTab = (tab) => {
    activeTabIndexRef.current += 1;
    setActiveTab(tab ? tab : activeTabIndexRef.current);
  };

  const [createListingMutation] = useMutation(PropertyQueries.createListing, {
    onCompleted: ({ createListing }) => {
      NProgress.done();
      if (get(createListing, "success", false)) {
        setListingData(get(createListing, "data", listingData));
      } else {
        showNotification("error", "Failed to add Data!", "");
      }
    },
  });

  const [updateListingMutation] = useMutation(PropertyQueries.updateListing, {
    onCompleted: ({ updateListing }) => {
      NProgress.done();
      if (get(updateListing, "success", false)) {
        setListingData(get(updateListing, "data", listingData));
      } else {
        showNotification("error", "Failed to update Data!", "");
      }
    },
  });

  let isEpcDisabled = ["House", "Apartment"].includes(
    get(propertyData, "propertyType")
  )
    ? false
    : true;

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="property__wrapper addTask--wrapper">
            <p className="property-selected__title">
              {!propertyData.title?.includes(get(propertyData, "subType", ""))
                ? `${get(propertyData, "numberOfBed", "0")} Bed ${get(
                    propertyData,
                    "subType",
                    ""
                  )} ${get(propertyData, "title", "property title")}`
                : get(propertyData, "title", "property title")}{" "}
              {propertyData.uniqueId &&
              !propertyData.title?.includes(propertyData.uniqueId)
                ? propertyData.uniqueId
                : ""}
            </p>

            <Tabs
              selectedIndex={activeTab}
              onSelect={(index) => {
                if (
                  isEnabled ||
                  !(activeTab < index + 1) ||
                  visitedTabs.current.includes(index)
                ) {
                  activeTabIndexRef.current = index - 1;
                  visitedTabs.current = [...visitedTabs.current, index];
                } else {
                  if (index <= activeTab) {
                    activeTabIndexRef.current = index - 1; // subtracting 1 as 1 will be added in the end of updateListingMutation
                  }
                }

                if (submitButtonRef?.current) {
                  submitButtonRef.current.click();
                } else {
                  updateActiveTab();
                }
              }}
            >
              <TabList>
                <Tab>Property</Tab>
                <Tab>Rental Details</Tab>
                <Tab>Amenities</Tab>
                <Tab>Schedule</Tab>
                <Tab>Gallery</Tab>
                <Tab onClick={() => setEnabled(true)}>Review</Tab>
              </TabList>

              <TabPanel>
                <PropertySteps.Property
                  allProperties={get(props, "location.state.allProperties", [])}
                  propertyData={propertyData}
                  setActiveTab={setActiveTab}
                  setListingData={setListingData}
                  setPropertyData={setPropertyData}
                  isListingAdd={isListingAdd}
                  isPreviewMode={isPreviewMode}
                  updatePropertyData={updatePropertyData}
                  submitButtonRef={submitButtonRef}
                  // updateListingData={updateListingData}
                  // {...props}
                />
              </TabPanel>
              <TabPanel>
                <PropertySteps.RentalDetails
                  propertyData={propertyData}
                  setPropertyData={setPropertyData}
                  listingData={listingData}
                  setListingData={setListingData}
                  updateActiveTab={updateActiveTab}
                  isPreviewMode={isPreviewMode}
                  isEpcDisabled={isEpcDisabled}
                  submitButtonRef={submitButtonRef}
                />
              </TabPanel>
              <TabPanel>
                <PropertySteps.Amenities
                  listingData={listingData}
                  propertyData={propertyData}
                  setPropertyData={setPropertyData}
                  setListingData={setListingData}
                  updateActiveTab={updateActiveTab}
                  isPreviewMode={isPreviewMode}
                  submitButtonRef={submitButtonRef}

                  // {...props}
                />
              </TabPanel>
              <TabPanel>
                <PropertySteps.Schedule
                  listingData={listingData}
                  propertyData={propertyData}
                  setPropertyData={setPropertyData}
                  setListingData={setListingData}
                  updateActiveTab={updateActiveTab}
                  updateListingData={updateListingData}
                  isPreviewMode={isPreviewMode}
                  submitButtonRef={submitButtonRef}

                  // {...props}
                />
              </TabPanel>
              <TabPanel>
                <PropertySteps.GalleryAndDocument
                  listingData={listingData}
                  propertyData={propertyData}
                  setPropertyData={setPropertyData}
                  setListingData={setListingData}
                  updateActiveTab={updateActiveTab}
                  isListingAdd={isListingAdd}
                  isEpcDisabled={isEpcDisabled}
                  isPreviewMode={isPreviewMode}
                  submitButtonRef={submitButtonRef}

                  // {...props}
                />
              </TabPanel>
              <TabPanel>
                <PropertySteps.Review
                  listingData={listingData}
                  propertyData={propertyData}
                  setPropertyData={setPropertyData}
                  setActiveTab={setActiveTab}
                  updateListingData={updateListingData}
                  isListingAdd={isListingAdd}
                  isPreviewMode={isPreviewMode}
                  // {...props}
                />
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(AddListing);
