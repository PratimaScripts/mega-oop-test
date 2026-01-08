import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Dropdown, Input, Menu, message, Modal, Space, Table, Tooltip } from "antd";
import showNotification from 'config/Notification';
import PropertiesQuery from "config/queries/property";
import { get } from 'lodash';
import React, { Fragment, useRef } from "react";
import { useMutation, useQuery } from "react-apollo";
import "../../Landlord/LandlordSideNavs/Listing/styles.scss";

const getPropertyStatus = (prop, isLower = true) => {
  if (prop.status !== null) {
    const status = prop.status !== "Un-Listed" || !prop.listing.listingId
      ? prop.status
      : "Incomplete";
    return isLower ? status.toLowerCase() : status;
  }
  return isLower ? "un-listed" : "Un-Listed";
};
const confirmModal = ({
  message = "Are you sure?",
  commentRef,
  onOKFunction = (f) => f,
  okText = "Ok",
}) => {
  Modal.confirm({
    title: "Add a Comment",
    icon: <ExclamationCircleOutlined />,
    // content: message,
    okText: okText,
    onOk: onOKFunction,
    cancelText: "Cancel",
    content: <Input.TextArea required rows={5} ref={commentRef} />

  });
};


const PropertyBasicInfoCell = ({ record, onTitleClick, avatarImage, onEdit }) => {
  return <div
    className={`border__${getPropertyStatus(record)} display_inline`}
  >
    {avatarImage && <span className="profile__default">
      <img
        src={avatarImage.url}
        alt={avatarImage.alt}
      />
    </span>}
    <span className="bold__txt">
      <Space size="large">
        <span
          onClick={onTitleClick}
        >
          {!record.title.includes(record?.subType)
            ? `${record.numberOfBed || 0} Bed ${record.subType} ${record?.title || "property title"}`
            : record?.title || "property title"}{" "}
          {record.uniqueId && !record.title?.includes(record.uniqueId)
            ? record.uniqueId
            : ""}
        </span>
      </Space>
      <div className="details">
        <ul>
          {[
            // { icon: "mdi mdi-book", field: "listing.documents" },
            { icon: "fa fa-bed", field: "numberOfBed" },
            { icon: "fa fa-bath", field: "numberOfBath" },
            { icon: "fas fa-couch", field: "numberOfReception" },
            { icon: "fas fa-tape", field: "sizeInSquareFeet" },
            { icon: "fa fa-camera", field: "listing.photos" },
          ].map(({ field, icon }, idx) =>
            <li key={`${idx}_${field}`} title={field.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1")}>
              <p>
                {icon && <i className={icon} aria-hidden="true"></i>}
                {Array.isArray(get(record, field)) ? get(record, field).length : get(record, field)}
              </p>
            </li>)}
          <li>
            <p>
              &nbsp; &nbsp; &nbsp; Rent p/m{" "}
              £ {record.listing.monthlyRent}
            </p>
          </li>

        </ul>
      </div>
    </span>
  </div>
}
const Properties = () => {


  const { loading, data, refetch } = useQuery(PropertiesQuery.fetchProperties);
  const commentRef = useRef(null);

  const [updatePropertyStatus] = useMutation(
    PropertiesQuery.updatePropertyStatus,
    {
      onCompleted: ({ updatePropertyStatus }) => {
        if (updatePropertyStatus.success) {
          showNotification("success", updatePropertyStatus.message, "");
          refetch()
        } else {
          showNotification("error", updatePropertyStatus.message, "");
        }
      },
      onError: (error) => {
        console.log("__ER__", error)
        showNotification("error", `Failed to update status`, "");
      },
    }
  );
  const columns = [
    {
      title: "Property",
      key: "identity",
      render: (record) => <PropertyBasicInfoCell record={record} />,
    },
    {
      title: "Type",
      key: "Type",
      filters: [
        "Apartment",
        "House",
      ].map((item) => ({ text: item, value: item })),
      onFilter: (value, record) => record.propertyType === value,
      render: (va, record) => {
        return <p>
          {record?.propertyType}
        </p>
      }
    },
    {
      title: "Status",
      key: "Status",
      filters: [
        "un-listed",
        "listed",
        "occupied",
        "incomplete"
      ].map((item) => ({ text: item, value: item })),
      onFilter: (value, record) => getPropertyStatus(record) === value,
      render: (va, record) => {
        return <p className={`badge_status_${getPropertyStatus(record)}`}>
          {getPropertyStatus(record)}
        </p>
      }
    },
    {
      title: "Landlord",
      key: 'landlor',
      render: (val, record) => {
        return <p>
          {record?.user?.firstName || "Not Available"}
        </p>
      }
    },
    {
      title: "EPCRating",
      key: "EPCRating",
      filters: [
        "A",
        "B",
        "C",
      ].map((item) => ({ text: item, value: item })),
      onFilter: (value, record) => record.listing?.EPCRating === value,
      render: (va, record) => {
        return <p>
          {record.listing?.EPCRating}
        </p>
      }
    },
    {
      title: "",
      key: "more",
      render: (va, record) => {
        return <Fragment>
          <Tooltip title="Preview" aria-label="preview">
            {" "}
          </Tooltip>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="unList"
                  disabled={record?.status !== "Listed"}
                  onClick={() =>
                    confirmModal({
                      message:
                        "Are you sure want to Un-List this property?",
                      onOKFunction: () => {
                        commentRef?.current?.resizableTextArea?.props?.value
                          ? updatePropertyStatus({
                            variables: {
                              propertyId: record.propertyId,
                              status: "Un-Listed",
                              comment: commentRef?.current?.resizableTextArea?.props?.value
                            },
                          }) : message.error("Please add comment")
                      },
                      commentRef
                    })
                  }>
                  <i className="fa fa-share" aria-hidden="true"></i>{" "}
                  Un-List
                </Menu.Item>
                <Menu.Item
                  key="preview"
                  disabled={!record.listing.publish.link}
                  onClick={() => {
                    record.listing.publish.link && window.open(record.listing.publish.link, '_blank')
                  }}>
                  <i
                    style={record?.status !== "Listed" ? { color: "grey" } : {}}
                    className="fa fa-info-circle"
                    aria-hidden="true"
                  ></i>{" "}
                  Preview
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}>
            <i className="fa fa-ellipsis-v"></i>
          </Dropdown>
        </Fragment>
      }
    }

  ];
  return (
    <div className="services-table">
      <Table
        rowKey={(record) => record.propertyId}
        loading={loading}
        columns={columns}
        dataSource={data?.fetchProperties || []}
        pagination={{
          pageSize: 10,
          size: "small",
        }}
      />
    </div>
  );
};

export default Properties;
