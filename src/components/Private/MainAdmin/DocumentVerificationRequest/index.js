import React, { useState } from "react";
import { Table, Modal, Input, Button, Popconfirm, Tooltip } from "antd";
import { SearchOutlined, CheckCircleTwoTone, CloseCircleTwoTone, EyeTwoTone } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useMutation, useQuery } from "react-apollo";
import get from "lodash/get";

import AdminQueries from "config/queries/admin";
import showNotification from "config/Notification";


const DocumentVerification = () => {
  const [verificationDocList, setVerificationList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('');

  const getFileExtension3 = filename => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  useQuery(AdminQueries.docVerificationList, {
    onCompleted: ({ getDocumentList }) => {
      if (getDocumentList.success) {
        setVerificationList(getDocumentList.data)
      }
      setLoading(false)
    }
  })

  const [setDocumentStatusMutation] = useMutation(AdminQueries.updateDocumentAdmin, {
    onCompleted: ({ updateDocument }) => {
      if (updateDocument.success) {
        showNotification('success', 'Document Updated', '')
      } else {
        showNotification('error', 'Failed', updateDocument.message)
      }
    }
  })

  const previewDocument = async document => {
    let url = get(document, "supportingDocuments.documentUrl");
    let type = await getFileExtension3(url);
    // console.log(type, url);
    Modal.info({
      title: get(document, "supportingDocuments.document"),
      width: 900,
      content: (
        <>
          {(type === "png" || type === "jpg" || type === "jpeg") && (
            <img src={url} alt="preview of doc" />
          )}
        </>
      ),
      onOk() { }
    });
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => node}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      // <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
      <SearchOutlined style={{ color: filtered ? "#1890ff" : "black" }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex] &&
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        // setTimeout(() => searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text}
      />
    )
  });

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText("");
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "users.email",
      key: "email",
      ...getColumnSearchProps("users.email")
    },
    {
      title: "Document",
      dataIndex: "supportingDocuments",
      key: "supportingDocuments.document",
      ...getColumnSearchProps("supportingDocuments.document"),
      render: supportingDocuments => supportingDocuments.document
    },
    {
      title: "Action",
      key: "action",
      render: record => (
        <span>
          <Tooltip title="View Document">
            <EyeTwoTone
              twoToneColor="lightblue"
              onClick={() => previewDocument(record)}
              style={{ fontSize: "1.5rem" }} />
            {/* <Icon
                onClick={() => previewDocument(record)}
                theme="twoTone"
                twoToneColor="lightblue"
                style={{ fontSize: "1.5rem" }}
                type="eye"
              /> */}
          </Tooltip>
          &nbsp;&nbsp;
          <Popconfirm
            title="Are you sure to approve this document?"
            onConfirm={() =>
              setDocumentStatusMutation({
                variables: {
                  documentId: record._id,
                  status: "Approved",
                  description: "No Special Reason"
                }
              })
            }
            onCancel={null}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Approve Document">
              {/* <Icon
                  theme="twoTone"
                  twoToneColor="#52c41a"
                  style={{ fontSize: "1.5rem" }}
                  type="check-circle"
                /> */}
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                style={{ fontSize: "1.5rem" }}
              />
            </Tooltip>
          </Popconfirm>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Popconfirm
            title="Are you sure to reject this document?"
            onConfirm={() =>
              setDocumentStatusMutation({
                variables: {
                  documentId: record._id,
                  status: "Reject",
                  description: "No Special Reason"
                }
              })
            }
            onCancel={null}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Reject Document">
              <CloseCircleTwoTone
                twoToneColor="#eb2f96"
                style={{ fontSize: "1.5rem" }}
              />
              {/* <Icon
                  style={{ fontSize: "1.5rem" }}
                  type="close-circle"
                  theme="twoTone"
                  twoToneColor="#eb2f96"
                /> */}
            </Tooltip>
          </Popconfirm>
        </span>
      )
    }
  ];


  return (
    <>
      <Table
        rowKey="_id"
        columns={columns}
        loading={loading}
        dataSource={verificationDocList}
      />
    </>
  );
}

export default DocumentVerification;
