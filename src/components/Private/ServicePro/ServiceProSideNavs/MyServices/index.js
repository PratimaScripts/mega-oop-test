import { Button, Select, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useQuery } from "@apollo/react-hooks";

import TableHeader from "./TableHeader";
import "./styles.scss";
import { getServices } from "config/queries/service";
import TableRow from "./TableRow";
import AdminQueries from "../../../../../config/queries/admin";
import { useHistory } from "react-router-dom";
import ServiceOrder from "../ServiceOrder";
import ViewWebpageButton from "./ViewWebpageButton";

const { Option } = Select;

function MyServices(props) {
  const history = useHistory();

  const { loading, data, called } = useQuery(getServices);

  const { data: categories } = useQuery(AdminQueries.getTaskCategories);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [allService, setAllService] = useState([]);

  useEffect(() => {
    if (called && data?.getServices) {
      const _services = data?.getServices;
      setAllService(_services);
    }
  }, [data, called]);

  useEffect(() => {
    if (called && data?.getServices) {
      const _services = data?.getServices;
      if (selectedCategory === "") {
        setAllService(_services);
      } else {
        setAllService(
          _services.filter((item) => item.category === selectedCategory)
        );
      }
    }
  }, [selectedCategory, data, called]);

  const handleAddNewService = () => {
    history.push("myservices/new");
  };

  const categoryData = categories?.getTaskCategories?.data;

  return (
    <div>
      <Tabs defaultIndex={"0"}>
        <div className="service__tables">
          <div className="row">
            <div className="col-md-12">
              <div className="service__wrapper d-flex justify-content-between flex-wrap">
                <div
                  className="service__top--left d-flex align-items-center mr-2"
                >
                  <TabList>
                    <Tab>All</Tab>
                    <Tab>Direct Orders</Tab>
                  </TabList>
                </div>
                <div className="service__top--right d-flex align-items-center flex-grow-1 justify-content-end mb-2 flex-wrap flex-sm-nowrap">
                  {categoryData && (
                    <Select
                      className="select___category mb-2 mb-sm-0"
                      defaultValue={selectedCategory}
                      onChange={(value) => setSelectedCategory(value)}
                    >
                      <Option value="">Select Category</Option>
                      {categoryData.map((item, key) => (
                        <Option key={key} value={item.name}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                  <ViewWebpageButton userData={props.userData} />

                  <Button
                    onClick={handleAddNewService}
                    className="btn btn__new--service"
                  >
                    <PlusOutlined
                      className="mr-2"
                      style={{ verticalAlign: "middle" }}
                    />{" "}
                    New Service
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="title">List services for clients to buy online</h2>

        <div className="clearfix" />

        <Spin tip="Loading..." spinning={loading}>
          <div className="service__tables">
            <div className="row">
              <div className="col-md-12">
                <TabPanel>
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <TableHeader />
                      <tbody>
                        {allService.map((service, index) => (
                          <TableRow key={service._id} service={service} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabPanel>

                <TabPanel>
                  <ServiceOrder />
                </TabPanel>
              </div>
            </div>
          </div>
        </Spin>
      </Tabs>
    </div>
  );
}

export default MyServices;
