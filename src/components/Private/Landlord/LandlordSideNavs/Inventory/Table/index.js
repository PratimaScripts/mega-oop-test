import React, { useState, useEffect, useMemo, useCallback } from "react";
import TableWithRowSpacing from "components/Common/Table";
import { Dropdown, Menu, Tag, Modal } from "antd";
import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  FilePdfOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useLazyQuery, useMutation } from "react-apollo";
import {
  deleteInventory,
  duplicateInventory,
  getInventoryById,
  sendInventoryForSign,
  updateInventoryStatus,
} from "config/queries/inventory";
import showNotification from "config/Notification";
import menuIcon from "img/ellipsis-vertical-circle.svg";
import { pdf } from "@react-pdf/renderer";
import InventoryPDF from "../InventoryPDF";

const InventoryDataTable = ({ data, ...props }) => {
  const [dataSource, setDataSource] = useState([]);
  const history = useHistory();

  const [getInventoryByIdQuery] = useLazyQuery(getInventoryById, {
    onCompleted: async (data) => {
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

  const [duplicateInventoryMutation, { loading: duplicating }] = useMutation(
    duplicateInventory,
    {
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
    }
  );

  const [sendForSign] = useMutation(sendInventoryForSign, {
    onCompleted: ({ sendInventoryForSign }) => {
      if (sendInventoryForSign?.success) {
        showNotification("success", sendInventoryForSign.message);
      } else {
        showNotification(
          "error",
          sendInventoryForSign.message || "Something went wrong"
        );
      }
    },
  });

  const handleChangeServiceState = useCallback(
    (id, status) =>
      changeInventoryStateMutation({
        variables: {
          inventoryId: [id],
          status,
        },
      }),
    [changeInventoryStateMutation]
  );

  const handleDeleteInventory = useCallback(
    (id) => deleteInventoryMutation({ variables: { inventoryId: [id] } }),
    [deleteInventoryMutation]
  );

  const handleEditInventory = useCallback(
    (id) => history.push(`/landlord/inventory/edit`, { id }),
    [history]
  );

  const handleDuplicateInventory = useCallback(
    (id) => duplicateInventoryMutation({ variables: { inventoryId: id } }),
    [duplicateInventoryMutation]
  );

  const generatePdfDocument = useCallback(
    async (id) => {
      getInventoryByIdQuery({ variables: { inventoryId: id } });
      showNotification("info", "Getting PDF data!");
    },
    [getInventoryByIdQuery]
  );

  const openConfirmModal = useCallback(
    (id) =>
      Modal.confirm({
        title: "Are you sure to delete this inventory?",
        okText: "Yes",
        cancelText: "No",
        onOk: () => handleDeleteInventory(id),
      }),
    [handleDeleteInventory]
  );

  const getTagColor = (status) => {
    switch (status) {
      case "Published":
        return "green";
      case "Archived":
        return "yellow";
      default:
        return "grey";
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "inventoryId",
        key: "inventoryId",
        render: (id, data) => (
          <div className="d-flex align-items-center">
            {id}
            <Tag
              className="ml-2"
              color={getTagColor(data.archived ? "Archived" : data.status)}
            >
              {data.archived ? "Archived" : data.status}
            </Tag>
          </div>
        ),

        sorter: (a, b) => a.inventoryId.localeCompare(b.inventoryId),
      },
      {
        title: "Type",
        dataIndex: "inventoryType",
        key: "inventoryType",
        render: (type) => (type === "checkIn" ? "Check-in" : "Check-out"),
        sorter: (a, b) => a.inventoryType.localeCompare(b.inventoryType),
      },
      {
        title: "Property",
        dataIndex: ["agreementData", "propertyAddress"],
        key: "propertyAddress",
        render: (address) => <Tag color="#f3a74f">{address}</Tag>,
        sorter: (a, b) =>
          a.agreementData.propertyAddress.localeCompare(
            b.agreementData.propertyAddress
          ),
      },
      {
        title: "Tenant",
        dataIndex: ["agreementData", "tenants"],
        key: "inventoryType",
        render: (tenants) => (
          <>
            {tenants.map((tenant) => (
              <Tag color="#6acb67">{tenant}</Tag>
            ))}
          </>
        ),
      },
      {
        title: "Template",
        dataIndex: ["agreementData", "templateType"],
        key: "inventoryType",
        sorter: (a, b) =>
          a.agreementData.templateType.localeCompare(
            b.agreementData.templateType
          ),
      },
      {
        title: "Signed By",
        dataIndex: "signatures",
        key: "signatures",
        render: (signatures) => (
          <>
            {signatures.reduce(
              (prev, current) => prev + +Boolean(current.isSigned),
              0
            )}
            /2
          </>
        ),
        sorter: (a, b) => {
          let signedByInA = a.signatures.reduce(
            (prev, current) => prev + +Boolean(current.isSigned),
            0
          );
          let signedByInB = b.signatures.reduce(
            (prev, current) => prev + +Boolean(current.isSigned),
            0
          );
          return signedByInA - signedByInB;
        },
      },
      {
        title: "Action",
        dataIndex: "_id",
        fixed: "right",
        key: "_id",
        render: (id, data) => (
          <Dropdown
            trigger={["click"]}
            overlay={
              <Menu>
                <Menu.Item
                  onClick={() => handleEditInventory(id)}
                  icon={<EditOutlined />}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  onClick={() => generatePdfDocument(id)}
                  icon={<FilePdfOutlined />}
                >
                  Export to pdf
                </Menu.Item>
                <Menu.Item
                  onClick={() => handleDuplicateInventory(id)}
                  icon={<CopyOutlined />}
                >
                  Duplicate
                </Menu.Item>

                <Menu.Item
                  onClick={() => handleChangeServiceState(id, "Published")}
                  icon={<CloudUploadOutlined />}
                >
                  Publish
                </Menu.Item>

                <Menu.Item
                  onClick={() =>
                    handleChangeServiceState(
                      id,
                      data.archived ? "Unarchive" : "Archived"
                    )
                  }
                  icon={
                    data.archived ? (
                      <CloudDownloadOutlined />
                    ) : (
                      <InboxOutlined />
                    )
                  }
                >
                  {data.archived ? "Unarchive" : "Archive"}
                </Menu.Item>
                <Menu.Item
                  onClick={() =>
                    sendForSign({ variables: { inventoryId: id } })
                  }
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
                <Menu.Item
                  onClick={() => openConfirmModal(id)}
                  icon={<DeleteOutlined />}
                >
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
        ),
      },
    ],
    [
      generatePdfDocument,
      handleChangeServiceState,
      handleDuplicateInventory,
      handleEditInventory,
      openConfirmModal,
      sendForSign,
    ]
  );

  useEffect(() => {
    setDataSource(data.map((item) => ({ ...item, key: item._id })));
  }, [data]);

  const onPaginationChange = (page, pageSize) => {
    let newPagination = { page, pageSize };
    props.setPagination(newPagination);
    props.refetch({ ...newPagination });
  };

  return (
    <div className="table-responsive">
      <TableWithRowSpacing
        {...props}
        rowClassName={(record) =>
          getTagColor(record.archived ? "Archived" : record.status)
        }
        loading={duplicating}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          defaultCurrent: 1,
          showSizeChanger: true,
          current: props.pagination.page + 1,
          pageSize: props.pagination.pageSize,
          total: props.totalInventoriesCount,
          pageSizeOptions: [5, 10, 15, 20],
          onChange: (page, pageSize) => onPaginationChange(page - 1, pageSize),
          showTotal: (_, range) =>
            `${range[0]}-${range[1]} of ${props.totalInventoriesCount} items`,
        }}
      />
    </div>
  );
};

export default InventoryDataTable;
