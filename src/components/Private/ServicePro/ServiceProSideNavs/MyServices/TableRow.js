import {
  FundViewOutlined,
  // MoreOutlined,
  SelectOutlined,
} from "@ant-design/icons";
import {
  Button,
  // Dropdown,
  // Menu,
  message,
  Popconfirm,
  Modal,
  Tag,
  Image,
} from "antd";
import { changeServiceState, deleteServiceState } from "config/queries/service";
import React, { useState } from "react";
import { useMutation } from "react-apollo";
import { useHistory } from "react-router";
// import { useLocation } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

const ActionButton = ({ type, name, color, fontSize, ...props }) => (
  <Button type="text" {...props}>
    <i style={{ color, fontSize }} className={`mdi mdi-${type}`}></i>
    <span>{name}</span>
  </Button>
);

const getSlug = (id, title) =>
  `${id.substr(1, 8)}-${String(title).replace(/\s+/g, "-").toLowerCase()}`;

const TableRow = ({ service }) => {
  const history = useHistory();
  // const location = useLocation();

  const [isModalOpen, toggleModal] = useState(false);
  const [selectedTab, selectTab] = useState(0);

  const [executeChangeServiceStateMutation] = useMutation(changeServiceState, {
    onCompleted: (data) => {
      if (data) {
        message.success("Service status changed successfully!");
        history.replace("/servicepro/myservices");
      }
    },
  });

  const [executeDeleteServiceMutation] = useMutation(deleteServiceState, {
    onCompleted: (data) => {
      if (data) {
        // console.log(data);
        message.success("Service status deleted successfully!");
        history.replace("/servicepro/myservices");
      }
    },
  });

  const handleChangeServiceState = (serviceId, status, title) => {
    // console.log(serviceId, status);
    executeChangeServiceStateMutation({
      variables: {
        serviceId,
        status,
        title,
      },
    });
  };

  const handleDelete = (serviceId) => {
    executeDeleteServiceMutation({
      variables: { serviceId },
    });
  };

  const handleEdit = (serviceId) => {
    history.push(`/servicepro/myservices/${serviceId}`);
  };

  const handleOpenPopup = () => {
    toggleModal(!isModalOpen);
  };

  const classes = {};
  let statusChangeButton = null;

  switch (service?.status) {
    case "Draft":
      classes.leftBorderClass = "border__draft";
      classes.statusBorderClass = "status__draft";
      statusChangeButton = (
        <>
          <ActionButton
            type="publish"
            name="Publish"
            fontSize="18px"
            color="rgb(128, 128, 128)"
            onClick={() =>
              handleChangeServiceState(service._id, "Published", service.title)
            }
          />

          <Popconfirm
            placement="topLeft"
            title={"You will not receive new order after this action!"}
            onConfirm={() =>
              handleChangeServiceState(service._id, "Archived", service.title)
            }
            okText="Yes"
            cancelText="No"
          >
            <ActionButton type="archive" name="Archive" />
          </Popconfirm>
        </>
      );
      break;

    case "Published":
      classes.leftBorderClass = "border__published";
      classes.statusBorderClass = "status__published";
      statusChangeButton = (
        <Popconfirm
          placement="topLeft"
          title={"You will not receive new invitation after this action!"}
          onConfirm={() =>
            handleChangeServiceState(service._id, "Archived", service.title)
          }
          okText="Yes"
          cancelText="No"
        >
          <ActionButton type="archive" name="Archive" />
        </Popconfirm>
      );
      break;

    case "Archived":
      classes.leftBorderClass = "border__archived";
      classes.statusBorderClass = "status__archived";
      statusChangeButton = (
        <ActionButton
          type="publish"
          name="Publish"
          fontSize="18px"
          color="rgb(128, 128, 128)"
          onClick={() =>
            handleChangeServiceState(service._id, "Published", service.title)
          }
        />
      );
      break;

    default:
      break;
  }

  if (!service.slug || service.slug.includes("undefined")) {
    service.slug = getSlug(service._id, service.title);
  }
  const publicPageLink = `${process.env.REACT_APP_ROC_PUBLIC}/service/${service.slug}`;

  return (
    <>
      <tr>
        <td className={classes.leftBorderClass}>
          <span
            className="bold__txt text-primary"
            onClick={() => handleOpenPopup(service)}
          >
            {service?.title}
          </span>
        </td>
        <td className="skill__tag text-center">
          {service?.tags?.map((tag) => (
            <p className="d-inline-block">{tag}</p>
          ))}
        </td>
        <td className="text-center">
          £
          {service.hasVariants
            ? service.variants[0] && service.variants[0].price
            : service?.price}
        </td>
        <td className="status text-center">
          <p className={classes.statusBorderClass}>{service?.status}</p>
        </td>
        <td className="action__section">
          {statusChangeButton}

          <ActionButton
            type="pencil"
            name="Edit"
            fontSize="18px"
            color="rgb(128, 128, 128)"
            onClick={() => handleEdit(service._id)}
          />

          <Popconfirm
            placement="topLeft"
            title={"Are you sure to delete this service!"}
            onConfirm={() => handleDelete(service._id)}
            okText="Yes"
            cancelText="No"
          >
            <ActionButton
              type="delete"
              name="Delete"
              fontSize="18px"
              color="rgb(128, 128, 128)"
            />
          </Popconfirm>

          <Button
            type="text"
            onClick={() =>
              Modal.info({
                title: "Public page link",
                content: <div>Your public link: {publicPageLink}</div>,
              })
            }
            icon={<SelectOutlined />}
          >
            Share
          </Button>
          <Button
            type="text"
            disabled={service.status !== "Published"}
            onClick={() => window.open(publicPageLink, "_blank").focus()}
            icon={<FundViewOutlined />}
          >
            Preview
          </Button>
        </td>
      </tr>
      <Modal
        title={service.title}
        visible={isModalOpen}
        // onOk={() => toggleModal(!isModalOpen)}
        onCancel={() => toggleModal(!isModalOpen)}
        // footer={null}
        footer={[
          <Button
            key="1"
            onClick={() => {
              history.push(`/servicepro/myservices/${service._id}`);
            }}
          >
            Edit
          </Button>,
          <Button
            key="2"
            onClick={() => toggleModal(!isModalOpen)}
            type="primary"
          >
            Ok
          </Button>,
        ]}
      >
        <div className="modal_wrap">
          <div
            className="row modal__image px-2"
            style={{ position: "relative" }}
          >
            <Tag className="status__tag">{service.status}</Tag>
            <Image
              width={500}
              className="upper_images"
              src={service.images[0]}
              fallback="data:image/png;base64,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"
            />
          </div>

          <div className="modal__content">
            <p className="property__types border d-block">
              {service.category} &gt; {service.subCategory}{" "}
            </p>
            <div className="d-flex justify-content-between">
              <p className="skills__tag">
                {service.tags.length &&
                  (service.tags.length > 3
                    ? service.tags.slice(0, 2)
                    : service.tags
                  ).map((tag) => <Tag>{tag}</Tag>)}
              </p>
              <p>£{service.price}</p>
            </div>
          </div>

          <div className="my-2">{service.description}</div>

          {service.hasVariants && (
            <Tabs
              onSelect={(tab) => selectTab(tab)}
              defaultIndex={"0"}
              selectedTabClassName={`selectedtab-${
                (selectedTab === 0 && "premium") ||
                (selectedTab === 1 && "standard") ||
                (selectedTab === 2 && "basic")
              }`}
            >
              <TabList>
                {service.variants.length > 0 &&
                  service.variants.map((variant) => {
                    return <Tab>{variant.title} Plan</Tab>;
                  })}
              </TabList>
              {service.variants.length > 0 &&
                service.variants.map((variant) => {
                  return (
                    <TabPanel>
                      <div className="wrap_basic_plan">
                        <div className="head_wrap">
                          <h1>{variant.title} Package - For Start-up</h1>
                          <h1>{variant.price}</h1>
                        </div>
                      </div>
                      <p className="text_card">{variant.description}</p>
                    </TabPanel>
                  );
                })}
            </Tabs>
          )}
        </div>
      </Modal>
    </>
  );
};

export default TableRow;
