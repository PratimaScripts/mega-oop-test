import { Checkbox, Dropdown, Menu, Modal, Tag } from "antd";
import showNotification from "config/Notification";
import {
  deleteInventory,
  duplicateInventory,
  getInventoryById,
  updateInventoryStatus,
} from "../../../../../../config/queries/inventory";
import React from "react";
import { useLazyQuery, useMutation } from "react-apollo";
import { useHistory } from "react-router";
import {
  CloudUploadOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  FilePdfOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { pdf } from "@react-pdf/renderer";
import InventoryPDF from "../InventoryPDF";
import menuIcon from "img/ellipsis-vertical-circle.svg";

const Row = ({ item, ...props }) => {
  const history = useHistory();

  const [getInventoryByIdQuery] = useLazyQuery(getInventoryById, {
    onCompleted: async (data) => {
      // console.log(data);
      if (data.getInventoryById) {
        const blob = await pdf(
          <InventoryPDF inventory={data.getInventoryById} />
        ).toBlob();
        const file = new Blob([blob], { type: "application/pdf" });
        window.open(window.URL.createObjectURL(file), "_blank");
      }
    },
  });

  const [deleteInventoryMutation] = useMutation(deleteInventory, {
    onCompleted: ({ deleteInventory }) => {
      if (deleteInventory.success) {
        showNotification("success", "Inventory deleted successfully!");
        if (props.refetch) {
          props.refetch();
        }
      } else {
        showNotification(
          "error",
          deleteInventory.message || "Something went wrong!"
        );
      }
    },
  });

  const [changeInventoryStateMutation] = useMutation(updateInventoryStatus, {
    onCompleted: ({ updateInventoryStatus }) => {
      if (updateInventoryStatus.success) {
        showNotification("success", "Inventory status changed successfully!");

        if (props.refetch) {
          props.refetch();
        }
      } else {
        showNotification(
          "error",
          updateInventoryStatus.message || "Something went wrong!"
        );
      }
    },
  });

  const [duplicateInventoryMutation] = useMutation(duplicateInventory, {
    onCompleted: ({ duplicateInventory }) => {
      if (duplicateInventory.success) {
        showNotification("success", "Inventory cloned successfully!");
        if (props.refetch) {
          props.refetch();
        }
      } else {
        showNotification(
          "error",
          duplicateInventory.message || "Something went wrong"
        );
      }
    },
  });

  const handleChangeServiceState = (status) =>
    changeInventoryStateMutation({
      variables: {
        inventoryId: [item._id],
        status,
      },
    });

  const handleDeleteInventory = () =>
    deleteInventoryMutation({ variables: { inventoryId: [item._id] } });

  const handleEditInventory = () =>
    history.push(`/landlord/inventory/edit`, { id: item._id });

  const handleDuplicateInventory = () =>
    duplicateInventoryMutation({ variables: { inventoryId: item._id } });

  const generatePdfDocument = async () => {
    getInventoryByIdQuery({ variables: { inventoryId: item._id } });
    showNotification("info", "Getting PDF data!");
  };

  const openConfirmModal = () =>
    Modal.confirm({
      title: "Are you sure to delete this inventory?",
      okText: "Yes",
      cancelText: "No",
      onOk: handleDeleteInventory,
    });

  return (
    <tr key={item._id} className="inventory-table__row">
      <td className="border__invited">
        <Checkbox
          checked={
            props.selectedInventories[item._id] ||
            props.selectedInventories["all"]
          }
          onChange={() => props.onCheck(item._id)}
        />
        <span className="mx-2">{item.inventoryId}</span>
        <Tag color="#909291">{item.status}</Tag>
      </td>
      <td className="bold__txt">
        {item.inventoryType === "checkIn"
          ? "Check-in inventory"
          : "Check-out inventory"}
      </td>
      <td>
        {item?.agreementData?.propertyAddress ? (
          <Tag color="#f3a74f">{item.agreementData.propertyAddress}</Tag>
        ) : (
          <Tag color="#2dc4d7">No Property Associated</Tag>
        )}
      </td>
      <td>
        {item?.agreementData?.tenants?.length ? (
          item.agreementData.tenants.map((tenant) => (
            <Tag color="#6acb67">{tenant}</Tag>
          ))
        ) : (
          <Tag color="#afafaf">No Tenants</Tag>
        )}
      </td>
      <td>{item.agreementData.templateType}</td>
      <td>
        {item.signatures.reduce(
          (prev, current) => prev + +Boolean(current.isSigned),
          0
        )}
        /2
      </td>
      <td>
        <Dropdown
          trigger={["click"]}
          overlay={
            <Menu>
              <Menu.Item onClick={handleEditInventory} icon={<EditOutlined />}>
                Edit
              </Menu.Item>
              <Menu.Item
                onClick={generatePdfDocument}
                icon={<FilePdfOutlined />}
              >
                Export to pdf
              </Menu.Item>
              <Menu.Item
                onClick={handleDuplicateInventory}
                icon={<CopyOutlined />}
              >
                Duplicate
              </Menu.Item>
              <Menu.Item
                onClick={() =>
                  handleChangeServiceState(
                    item.status !== "Archived" ? "Archived" : "Published"
                  )
                }
                icon={
                  item.status !== "Archived" ? (
                    <InboxOutlined />
                  ) : (
                    <CloudUploadOutlined />
                  )
                }
              >
                {item.status !== "Archived" ? "Archive" : "Publish"}
              </Menu.Item>
              <Menu.Item
                icon={
                  <img
                    style={{ width: "12px" }}
                    src="https://img.icons8.com/ios/50/000000/signature.png"
                    alt="sign"
                  />
                }
              >
                Sign & Send
              </Menu.Item>
              <Menu.Item onClick={openConfirmModal} icon={<DeleteOutlined />}>
                Delete
              </Menu.Item>
            </Menu>
          }
        >
          <img
            src={menuIcon}
            style={{
              width: "30px",
              height: "30px",
            }}
            alt="menu"
          />
        </Dropdown>
      </td>
    </tr>
  );
};

export default Row;
