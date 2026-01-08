import React, { useEffect, useState, useRef } from "react";
import { withRouter } from "react-router-dom";
import PropertyQuery from "../../../../../config/queries/property";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Skeleton } from "antd";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { Select, Modal } from "antd";

import { ExclamationCircleOutlined } from "@ant-design/icons";
// updatePropertyStatus
import "./styles.scss";
import Review from "./Review";
import showNotification from "config/Notification";

import { getRentedRequestedProperties } from "config/queries/landlord";
import Property from "components/Common/Property";
import EmptyProperty from "components/layout/emptyviews/EmptyProperty";

const { Option } = Select;

const TaskDash = (props) => {
  const [openReview, setOpenReview] = useState(false);

  const [properties, setProperties] = useState([]);
  const [initialPropData, setInitalPropData] = useState([]);
  const currentProperty = useRef({});

  const { loading: rentalRequestedLoading, data: rentalRequestedProperties } =
    useQuery(getRentedRequestedProperties);

  const { loading } = useQuery(PropertyQuery.fetchProperty, {
    onCompleted: (pro) => {
      setInitalPropData(get(pro, "fetchProperty.data", []));
      setProperties(get(pro, "fetchProperty.data", []));
    },
  });

  const [updatePropertyStatus] = useMutation(
    PropertyQuery.updatePropertyStatus,
    {
      onCompleted: ({ updatePropertyStatus }) => {
        if (updatePropertyStatus.success) {
          setProperties(updatePropertyStatus.data);
          setInitalPropData(updatePropertyStatus.data);
          showNotification("success", updatePropertyStatus.message, "");
        } else {
          showNotification("error", updatePropertyStatus.message, "");
        }
      },
      onError: (error) => {
        showNotification("error", `Failed to update status ${error}`, "");
      },
    }
  );
  const filterData = async (filterText) => {
    let filtered;
    if (filterText === "") {
      filtered = initialPropData;
    } else {
      filtered = await initialPropData.filter((str) => {
        let category = get(str, "title", "sometitle");
        let zip = get(str, "address.zip");

        return (
          (category &&
            category.toLowerCase().includes(filterText.toLowerCase())) ||
          (zip && zip.toLowerCase().includes(filterText.toLowerCase()))
        );
      });
    }
    setProperties(filtered);
  };

  function confirmModal({
    message = "Are you sure?",
    onOKFunction = (f) => f,
    okText = "Ok",
  }) {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: message,
      okText: okText,
      onOk: onOKFunction,
      cancelText: "Cancel",
    });
  }

  const filterDataByStatus = async (filterText) => {
    let filtered;
    if (filterText === "All") {
      filtered = initialPropData;
    } else {
      filtered = await initialPropData.filter((str) => {
        let category = get(str, "status", "sometitle");
        return category && category.toLowerCase() === filterText.toLowerCase();
      });
    }
    setProperties(filtered);
  };

  useEffect(() => {
    !isEmpty(get(props, "location.state", [])) &&
      setProperties(get(props, "location.state", []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdatePropertyStatus = ({ propertyId, status }) => {
    updatePropertyStatus({
      variables: {
        propertyId,
        status,
      },
    });
  };

  const rentalRequestedProperty =
    rentalRequestedProperties?.getRentedRequestedProperties;

  return (
    <div className={props.responsiveClasses}>
      <div className="property_header_wrapper">
        <div className="property_title">
          <h2>Your Properties</h2>
        </div>
        <div className="property_fields">
          <form className="search__wrapper">
            <input
              className="form-control"
              type="search"
              placeholder="Search"
              aria-label="Search"
              onChange={(e) => filterData(e.target.value)}
            />
            <button className="btn" type="submit">
              <i className="mdi mdi-magnify" />
            </button>
          </form>
          <Select
            onChange={(e) => filterDataByStatus(e)}
            placeholder="Filter By Status"
            className="select____property"
          >
            <Option value="All">All</Option>
            <Option value="Listed">Listed</Option>
            <Option value="Un-Listed">Un-Listed</Option>
            <Option value="Occupied">Occupied</Option>
            <Option value="Archived">Archived</Option>
            <Option value="Rented">Rented</Option>
          </Select>
          <button
            className="btn btn__new--property"
            onClick={() => props.history.push("/landlord/property/add")}
          >
            <i className="fa fa-plus"></i> Add Property
          </button>
        </div>
      </div>

      <Skeleton
        tip="Fetch rental requested properties..."
        loading={rentalRequestedLoading}
      >
        {rentalRequestedProperty?.length > 0 && (
          <div className="list__view">
            <h6 className="ml-3">Rental requested properties!</h6>
            <div className="bg_">
              <div className="bg_mainly">
                <div className="container">
                  <div className="row">
                    {rentalRequestedProperty.map((property, index) => {
                      return (
                        <Property
                          currentProperty={currentProperty}
                          initialPropData={initialPropData}
                          property={property}
                          setOpenReview={setOpenReview}
                          updatePropertyStatus={handleUpdatePropertyStatus}
                          key={`requested-property-${index}`}
                          rentalRequested
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Skeleton>

      <Skeleton tip="Fetch Properties..." active loading={loading}>
        <div className="list__view">

          {!loading && !isEmpty(properties) ? (<>
            <h6 className="ml-3">Manage your self-occupied and rental properties!</h6>
            <div className="bg_">
              <div className="bg_mainly">
                <div className="container">
                  <div className="row">
                    {properties.map((property, index) => {
                      return (
                        <Property
                          currentProperty={currentProperty}
                          initialPropData={initialPropData}
                          property={property}
                          setOpenReview={setOpenReview}
                          updatePropertyStatus={handleUpdatePropertyStatus}
                          key={`verified-property-${index}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </>
          ) : (
            <EmptyProperty />
          )}
        </div>
      </Skeleton>
      {openReview && (
        <Modal
          visible={openReview}
          footer={null}
          title={currentProperty.current.title}
          centered
          onCancel={() => setOpenReview(false)}
          onOk={() => setOpenReview(false)}
          style={{
            top: 10,
            overflow: "auto",
          }}
          className="custom"
        >
          <Review
            allProperties={initialPropData}
            property={currentProperty.current}
            listing={currentProperty.current.listing}
            contextData={props.contextData}
            showNotification={showNotification}
            confirmModal={confirmModal}
            updatePropertyStatus={updatePropertyStatus}
          />
        </Modal>
      )}
    </div>
  );
};

export default withRouter(TaskDash);
