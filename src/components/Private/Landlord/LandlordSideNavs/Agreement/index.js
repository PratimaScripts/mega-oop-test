import React, { useState } from "react";
import { useMutation, useQuery } from "react-apollo";
import { useHistory } from "react-router-dom";
import { TabList, Tabs, Tab, TabPanel } from "react-tabs";
import { Spin } from "antd";
import AgreementTable from "./Table";
import { archiveAgreement, getAgreements } from "config/queries/agreement";

import EmptyAgreement from "components/layout/emptyviews/EmptyAgreement";
import { PlusOutlined } from "@ant-design/icons";
import "./styles.scss";
import showNotification from "config/Notification";

const Agreement = () => {
  const history = useHistory();

  const { loading, refetch } = useQuery(getAgreements, {
    onCompleted: ({ getAgreements }) => {
      if (getAgreements?.success) {
        let data = getAgreements?.data || [];
        let archived = [];
        let all = [];

        data.map((item) => {
          if (item.archived) {
            return archived.push(item);
          } else {
            return all.push(item);
          }
        });
        setAgreements({ all, archived });
      } else {
        showNotification(
          "error",
          getAgreements?.message || "Something went wrong"
        );
      }
    },
  });

  const [archive] = useMutation(archiveAgreement, {
    onCompleted: ({ archiveAgreement }) => {
      if (archiveAgreement.success) {
        refetch();
        showNotification("success", archiveAgreement.message || "Success");
      } else {
        showNotification(
          "error",
          archiveAgreement?.message || "Something went wrong"
        );
      }
    },
  });

  const [agreements, setAgreements] = useState({ all: [], archived: [] });

  return (
    <div>
      <Tabs defaultIndex={"0"}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 p-0 agreement_wrap">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div className="d-flex align-items-center flex-1 mb-2 mr-2">
                  <TabList>
                    <Tab>All</Tab>
                    <Tab>Archived</Tab>
                  </TabList>
                </div>
                <div
                  onClick={() => history.push(`/landlord/agreement/add`)}
                  className="mb-2"
                >
                  <button className="btn btn__new__agreement">
                    <PlusOutlined
                      className="mr-2"
                      style={{ verticalAlign: "middle" }}
                    />{" "}
                    New Agreement{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="clearfix" />

        <Spin tip="Loading..." spinning={loading}>
          {!agreements.all.length ? (
            <EmptyAgreement />
          ) : (
            <div className="agreement__tables">
              <div className="row">
                <div className="col-md-12">
                  <TabPanel>
                    <AgreementTable
                      refreshAgreements={refetch}
                      archive={archive}
                      data={agreements.all}
                    />
                  </TabPanel>

                  <TabPanel>
                    <AgreementTable
                      refreshAgreements={refetch}
                      archive={archive}
                      data={agreements.archived}
                    />
                  </TabPanel>
                </div>
              </div>
            </div>
          )}
        </Spin>
      </Tabs>
    </div>
  );
};

export default Agreement;
