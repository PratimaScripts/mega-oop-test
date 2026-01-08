import { Button, Select, Spin, Tooltip } from "antd";
import {
  deleteInventory,
  getInventoryFilters,
  getInventories,
  updateInventoryStatus,
} from "../../../../../config/queries/inventory";
import React, { useCallback, useState } from "react";
import { useMutation, useQuery } from "react-apollo";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

import "./styles.scss";
import InventoryDataTable from "./Table";
import { useHistory } from "react-router";
import { isEmpty } from "lodash";
import EmptyInventory from "components/layout/emptyviews/EmptyInventory";
import {
  CloudUploadOutlined,
  DeleteOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import showNotification from "config/Notification";

const DELETE = "delete";

const DEFAULT_PAGINATION = { page: 0, pageSize: 5 };
const DEFAULT_FILTER = { property: "", tenant: "" };

const Inventory = () => {
  const history = useHistory();

  const { loading, refetch } = useQuery(getInventories, {
    onCompleted: ({ getInventories }) => {
      if (getInventories.success) {
        if (currentIndex === 0) {
          setInventories(getInventories.data);
        } else {
          setArchiveInventories(getInventories.data);
        }
        setTotalInventoriesCount(getInventories.count);
      } else {
        showNotification(
          "error",
          getInventories.message || "Something went wrong"
        );
      }
    },
  });

  const { loading: fetchingFilters } = useQuery(getInventoryFilters, {
    onCompleted: ({ getInventoryFilters }) => {
      if (getInventoryFilters.success) {
        setFilterArr({
          ...filterArr,
          properties: getInventoryFilters.data?.properties || [],
          tenants: getInventoryFilters.data?.tenants || [],
        });
      } else {
        showNotification(
          "error",
          getInventoryFilters.message || "Something went wrong"
        );
      }
    },
  });

  const [totalInventoriesCount, setTotalInventoriesCount] = useState(0);
  const [inventories, setInventories] = useState([]);
  const [archiveInventories, setArchiveInventories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedInventories, setSelectedInventories] = useState([]);

  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [archiveTabPagination, setArchiveTabPagination] =
    useState(DEFAULT_PAGINATION);

  const [filterArr, setFilterArr] = useState({ properties: [], tenants: [] });
  const [filter, setFilter] = useState(DEFAULT_FILTER);

  const archived = currentIndex === 0 ? false : true;

  const onTabChange = useCallback(
    (index) => {
      if (currentIndex !== index) {
        setCurrentIndex(index);
        if (index === 1) {
          refetch({ ...archiveTabPagination, ...filter, archived: true });
        } else {
          refetch({ ...pagination, ...filter, archived: false });
        }
      }
    },
    [currentIndex, refetch, archiveTabPagination, filter, pagination]
  );

  const applyFilter = (key, value) => {
    let newFilter = { ...filter, [key]: value || "" };
    setFilter(newFilter);
    setPagination(DEFAULT_PAGINATION);
    setArchiveTabPagination(DEFAULT_PAGINATION);

    if (!value) {
      return refetch({ ...newFilter, ...DEFAULT_PAGINATION, archived });
    }
    refetch({ ...newFilter, ...DEFAULT_PAGINATION, archived });
  };

  const [changeInventoryStateMutation] = useMutation(updateInventoryStatus, {
    onCompleted: ({ updateInventoryStatus }) => {
      if (updateInventoryStatus.success) {
        showNotification("success", "Inventory status changed successfully!");

        if (refetch) {
          refetch({ ...filter, ...DEFAULT_PAGINATION, archived });
        }
      } else {
        showNotification(
          "error",
          updateInventoryStatus.message || "Something went wrong!"
        );
      }
    },
  });

  const [deleteInventoryMutation] = useMutation(deleteInventory, {
    onCompleted: ({ deleteInventory }) => {
      if (deleteInventory.success) {
        showNotification("success", "Inventory deleted successfully!");
        refetch({ ...filter, ...DEFAULT_PAGINATION, archived });
      } else {
        showNotification(
          "error",
          deleteInventory.message || "Something went wrong!"
        );
      }
    },
  });

  const updateStatus = (status) => {
    if (selectedInventories.length) {
      if (status === DELETE) {
        return deleteInventoryMutation({
          variables: { inventoryId: selectedInventories },
        });
      }
      changeInventoryStateMutation({
        variables: { inventoryId: selectedInventories, status },
      });
    }
  };

  return (
    <div>
      <Tabs defaultIndex="0" onSelect={onTabChange}>
        <div className="container inventory__tables">
          <div className="row">
            <div className="col-md-12 p-0">
              <div className="d-flex justify-content-between align-items-center flex-wrap inventory__wrapper">
                <div className="d-flex align-items-center flex-1 inventory__top--left mb-2 mr-2">
                  <TabList>
                    <Tab>All</Tab>
                    <Tab>Archived</Tab>
                  </TabList>
                </div>
                <div className="row align-items-center ">
                  <div
                    className="col d-flex"
                    style={{ minWidth: 110, maxWidth: 110 }}
                  >
                    <Tooltip title="Delete">
                      <Button
                        className="btn mr-3"
                        size="large"
                        style={{
                          background: "#ffff",
                          borderRadius: "0.25em",
                        }}
                        icon={<DeleteOutlined />}
                        onClick={() => updateStatus(DELETE)}
                      />
                    </Tooltip>
                    <Tooltip
                      title={currentIndex === 0 ? "Archive" : "Un-archive"}
                    >
                      <Button
                        className="btn mr-3"
                        size="large"
                        style={{
                          background: "#ffff",
                          borderRadius: "0.25em",
                        }}
                        icon={
                          currentIndex === 0 ? (
                            <InboxOutlined />
                          ) : (
                            <CloudUploadOutlined />
                          )
                        }
                        onClick={() =>
                          updateStatus(
                            currentIndex === 0 ? "Archived" : "Published"
                          )
                        }
                      />
                    </Tooltip>
                  </div>
                  <div className="col-4 col-sm-4 col-lg-3 px-2">
                    <Select
                      size="large"
                      className="mr-3 w-100"
                      placeholder="Select Property"
                      loading={fetchingFilters}
                      onChange={(value) => applyFilter("property", value)}
                      allowClear
                    >
                      {filterArr.properties.map((property) => (
                        <Select.Option value={property}>
                          {property}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>

                  <div className="col-4 col-sm-4 col-lg-3 px-2">
                    <Select
                      size="large"
                      className="mr-3 w-100"
                      placeholder="Select Tenant"
                      loading={fetchingFilters}
                      onChange={(value) => applyFilter("tenant", value)}
                      allowClear
                    >
                      {filterArr.tenants.map((tenant) => (
                        <Select.Option value={tenant}>{tenant}</Select.Option>
                      ))}
                    </Select>
                  </div>

                  <div
                    onClick={() => history.push(`/landlord/inventory/add`)}
                    className="col-12 col-sm-4 col-lg-3 py-3"
                        style={{minWidth: 220}}
                  >
                    <button className="btn btn-secondary px-4 w-100">
                      + New Inventory
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="clearfix" />

        <Spin tip="Loading..." spinning={loading}>
          <div className="container inventory__tables">
            <div className="row">
              <div className="col-md-12 px-0">
                <TabPanel key="0">
                  {isEmpty(inventories) ? (
                    <EmptyInventory currentTab={currentIndex} />
                  ) : (
                    <InventoryDataTable
                      data={inventories}
                      loading={loading}
                      refetch={refetch}
                      totalInventoriesCount={totalInventoriesCount}
                      setSelectedInventories={setSelectedInventories}
                      pagination={pagination}
                      setPagination={setPagination}
                    />
                  )}
                </TabPanel>

                <TabPanel key="1">
                  {isEmpty(archiveInventories) ? (
                    <EmptyInventory currentTab={currentIndex} />
                  ) : (
                    <InventoryDataTable
                      data={archiveInventories}
                      refetch={refetch}
                      loading={loading}
                      totalInventoriesCount={totalInventoriesCount}
                      setSelectedInventories={setSelectedInventories}
                      pagination={archiveTabPagination}
                      setPagination={setArchiveTabPagination}
                    />
                  )}
                </TabPanel>
              </div>
            </div>
          </div>
        </Spin>
      </Tabs>
    </div>
  );
};

export default Inventory;
