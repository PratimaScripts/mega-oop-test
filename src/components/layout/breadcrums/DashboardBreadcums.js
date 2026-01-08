import { Breadcrumb, Tag } from "antd";
import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { InterfaceContext } from "store/contexts/InterfaceContext";
import AdminBreadcrums from "./AdminBreadcrums";
import LandlordBreadcrums from "./LandlordBreadcrums";
import RenterBreadcrums from "./RenterBreadcrums";
import ServiceProBreadCrums from "./ServiceProBreadcrums";

const DashboardBreadcrums = ({ role }) => {
  const { state: interfaceState } = useContext(InterfaceContext);
  const { location } = useHistory();
  // const location = interfaceState.location
  const breadcrumbNameMap =
    role === "landlord"
      ? LandlordBreadcrums
      : role === "servicepro"
      ? ServiceProBreadCrums
      : role === "admin"
      ? AdminBreadcrums
      : RenterBreadcrums;

  const currentPath = location.pathname;
  const parentPath = location.pathname.slice(0, -1);
  const possiblePaths = currentPath
    .split("/")
    .slice(1)
    .reduce(
      (parentPath, currentPath, idx) => [
        ...parentPath,
        `${parentPath[idx - 1] || ""}/${currentPath}`,
      ],
      []
    );

  return (
    <div className="dashboard__header">
      {/* {!location.pathname.includes("dashboard") && ( */}
      <div className="row">
        <div
          className={`${
            process.env.NODE_ENV === "development" ? "col-4 col-lg-4" : "col-12"
          }`}
        >
          <h2>
            {breadcrumbNameMap[currentPath]
              ? breadcrumbNameMap[currentPath]
              : breadcrumbNameMap[parentPath]}
          </h2>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="col-2 mb-3">
            <Tag color="green">
              Dimension : {interfaceState.windowWidth}X
              {interfaceState.windowHeight}
            </Tag>
          </div>
        )}
        <div className="col-12">
          <Breadcrumb separator="" className="breadcrumb">
            {!location.pathname.includes("dashboard")
              ? possiblePaths.map((possiblePath, index, self) => (
                  <>
                    {breadcrumbNameMap[possiblePath] ? (
                      <Breadcrumb.Item
                        key={possiblePath}
                        className="breadcrumb-item"
                      >
                        <Link to={possiblePath}>
                          {breadcrumbNameMap[possiblePath]}
                        </Link>
                        {index !== self.length - 1 && (
                          <span className="pathArrow">&#62;</span>
                        )}
                      </Breadcrumb.Item>
                    ) : null}
                  </>
                ))
              : "Dashboard"}
          </Breadcrumb>
        </div>
      </div>
    </div>
  );
};

export default DashboardBreadcrums;
