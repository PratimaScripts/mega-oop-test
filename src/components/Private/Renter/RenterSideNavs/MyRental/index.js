import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { Drawer, Skeleton } from "antd";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { Select, Steps } from "antd";
import "./styles.scss";
import { getRentedProperties } from "config/queries/renter";
import AddProperty from "components/Common/PropertyDemo";
import InviteForm from "components/Common/PropertyDemo/InviteForm";
import AccountQuery from "config/queries/account";
import Property from "components/Common/Property";

const { Step } = Steps;

const { Option } = Select;

const MyRental = (props) => {
  const [showInviteLandlordDrawer, setShowInviteLandlordDrawer] =
    useState(false);

  const [invitedLandlordData, setInvitedLandlordData] = useState({});
  const [current, setCurrent] = useState(0);

  const [properties, setProperties] = useState([]);
  const [initialPropData, setInitalPropData] = useState([]);

  const [executeRentedPropertiesQuery, { loading }] = useLazyQuery(
    getRentedProperties,
    {
      onCompleted: (data) => {
        if (data && data.getRentedProperties) {
          setInitalPropData(data.getRentedProperties);
          setProperties(data.getRentedProperties);
        }
      },
    }
  );

  useEffect(() => {
    executeRentedPropertiesQuery();
    //eslint-disable-next-line
  }, []);

  const filterData = async (filterText) => {
    let filtered;
    if (filterText === "") {
      filtered = initialPropData;
    } else {
      filtered = await initialPropData.filter((str) => {
        let category = get(str, "title", "sometitle");
        return (
          category && category.toLowerCase().includes(filterText.toLowerCase())
        );
      });
    }
    setProperties(filtered);
  };

  const filterDataByStatus = async (filterText) => {
    let filtered;
    if (filterText === "All") {
      filtered = initialPropData;
    } else {
      filtered = await initialPropData.filter((str) => {
        let category = get(str, "status", "sometitle");
        return (
          category && category.toLowerCase().includes(filterText.toLowerCase())
        );
      });
    }
    setProperties(filtered);
  };

  useEffect(() => {
    !isEmpty(get(props, "location.state", [])) &&
      setProperties(get(props, "location.state", []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshProperty = () => executeRentedPropertiesQuery();

  const [inviteLandlord] = useMutation(AccountQuery.inviteLandlord);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

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
          setData={() => {}}
          landlordData={invitedLandlordData}
          toggleAddPropertyDrawer={() => {
            // inviteLandlord
            inviteLandlord({
              variables: {
                ...invitedLandlordData,
              },
            });
            setShowInviteLandlordDrawer(false);
          }}
          setProperties={refreshProperty}
          isDrawer={true}
          {...props}
        />
      ),
    },
  ];

  return (
    <div className={props.responsiveClasses}>
      <div className="property_header_wrapper">
        <div className="property_title">
          <h2>Your Rented Properties</h2>
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
            className="btn btn-warning"
            onClick={() => setShowInviteLandlordDrawer(true)}
            // onClick={() => props.history.push("/renter/myrental/add")}
          >
            <i className="fa fa-plus"></i> Invite landlord
          </button>
        </div>
      </div>

      <Skeleton tip="Fetch Properties..." active loading={loading}>
        <div className="list__view">
          <div className="bg_">
            <div className="bg_mainly">
              <div className="container">
                <div className="row">
                  {!loading && !isEmpty(properties) ? (
                    properties.map((property, j) => {
                      return (
                        <Property hideActions property={property} key={j} />
                      );
                    })
                  ) : (
                    <p>Nothing here</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Skeleton>
      <Drawer
        title="Invite Landlord and Add Rented Property"
        placement="right"
        width={980}
        closable={true}
        maskClosable={false}
        onClose={() => setShowInviteLandlordDrawer(!showInviteLandlordDrawer)}
        visible={showInviteLandlordDrawer}
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
    </div>
  );
};

export default withRouter(MyRental);
