import React, { useContext } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

import { UserDataContext } from "store/contexts/UserContext";

const AdminMenu = (props) => {
  const { state: userState } = useContext(UserDataContext);
  
  const { userData } = userState;
  const userRole = userData.role;

  // const allPermAr = [];

  // permissions.forEach((p, i) => {
  //   allPermAr.push(p.tab);
  // });

  return (
    <Menu
      defaultOpenKeys={["sub1"]}
      mode="inline"
      theme="light"
      openKeys={props.openKeys}
      onOpenChange={props.onOpenChange}
      onClick={() => props.hideSideBarOnMobileOnClick()}
    >
      <Menu.Item key="1">
        <Link to={`/${userRole}/dashboard`}>
          <i className="mdi mdi-home" />
          <span className="padd__left"> Dashboard</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="2">
        <Link to={`/${userRole}/chartOfAccount`}>
          <i className="mdi mdi-chart-bar"></i>
          <span className="padd__left">Chart Of Account</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="3">
        <Link to={`/${userRole}/users`}>
          <i className="mdi mdi-account-group"></i>
          <span className="padd__left">Users</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="4">
        <Link to={`/${userRole}/exportRequests`}>
          <i className="mdi mdi-file-move"></i>
          <span className="padd__left">Export Requests</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="21">
        <Link to={`/${userRole}/properties`}>
          <i className="mdi mdi-office-building"></i>
          <span className="padd__left">Properties</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="20">
        <Link to={`/${userRole}/task`}>
          <i className="mdi mdi-file-move"></i>
          <span className="padd__left">Task</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="5">
        <Link to={`/${userRole}/deleteRequests`}>
          <i className="mdi mdi-account-minus"></i>
          <span className="padd__left">Delete Requests</span>
        </Link>
      </Menu.Item>

      <Menu.Item>
        <Link to={`/${userRole}/services`}>
          <i className="mdi mdi-settings"></i>
          <span className="padd__left">Services</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="6">
        <Link to={`/${userRole}/accrediations`}>
          <i className="mdi mdi-settings"></i>
          <span className="padd__left">Accrediations</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="7">
        <Link to={`/${userRole}/paymentHistory`}>
          <i className="mdi mdi-currency-gbp"></i>
          <span className="padd__left"> Payment History</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="8">
        <Link to={`/${userRole}/docVerification`}>
          <i className="mdi mdi-book"></i>
          <span className="padd__left"> Document Verification</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="10">
        <Link to={`/${userRole}/screeningOrders`}>
          <i className="mdi mdi-briefcase-account"></i>
          <span className="padd__left"> Screening Orders</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="11">
        <Link to={`/${userRole}/taskCategory`}>
          <i className="mdi mdi-briefcase"></i>
          <span className="padd__left">Add Task Categories</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="34">
        <Link to={`/${userRole}/propertySubtype`}>
          <i className="mdi mdi-home"></i>
          <span className="padd__left">Add Property Sub Types</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="16">
        <Link to={`/${userRole}/reports`}>
          <i className="mdi mdi-settings"></i>
          <span className="padd__left"> Reports</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="19">
        <Link to={`/${userRole}/rates`}>
          <i className="mdi mdi-settings"></i>
          <span className="padd__left"> Rates</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="9" className="fixed__btm--settings">
        <Link to={`/${userRole}/settings`}>
          <i className="mdi mdi-settings"></i>
          <span className="padd__left"> Settings</span>
        </Link>
      </Menu.Item>
    </Menu>
  );
};

export default AdminMenu;
