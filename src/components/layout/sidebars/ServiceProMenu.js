import React, { useContext } from "react";
import { Menu, Tooltip } from "antd";
import { Link } from "react-router-dom";

import { UserDataContext } from "store/contexts/UserContext";
import { InterfaceContext } from "store/contexts/InterfaceContext";
import StorageLevel from "components/Common/StorageLevel";

const ServiceProMenu = (props) => { 
  // isMenuDisabled,
  const { hideScroll } = props;
  const { state: userState } = useContext(UserDataContext);
  const { state: interfaceState } = useContext(InterfaceContext);
  const { sidebarCollapsed } = interfaceState;
// permissions 
  const { userData } = userState;
  const userRole = userData.role;

  // const { SubMenu } = Menu;

  // const allPermAr = [];

  // permissions.forEach((p, i) => {
  //     allPermAr.push(p.tab);
  // });
  if (sidebarCollapsed)
    return (
      <Menu
        defaultOpenKeys={[]}
        mode="inline"
        theme="light"
        onClick={() => props.hideSideBarOnMobileOnClick()}
        // onClick={hideSidebarMenuClick}
        onMouseOver={() => hideScroll("show")}
        onMouseOut={() => hideScroll("hide")}
        openKeys={props.openKeys}
        onOpenChange={props.onOpenChange}
      >
        <Menu.Item key="1">
          <Tooltip
            overlayClassName="hover__menu__sidebar"
            mouseLeaveDelay={0.15}
            mouseEnterDelay={-0.15}
            placement="right"
            title={
              <div onClick={() => props.history.push(`/${userRole}/dashboard`)}>
                Dashboard
              </div>
            }
          >
            <Link to={`/${userRole}/dashboard`}>
              <i className="mdi mdi-home" />
              <span className="padd__left">Dashboard</span>
            </Link>
          </Tooltip>
        </Menu.Item>

        <Menu.Item key="2">
          <Tooltip
            overlayClassName="hover__menu__sidebar"
            mouseLeaveDelay={0.15}
            mouseEnterDelay={-0.15}
            placement="right"
            title={
              <span onClick={() => props.history.push(`/${userRole}/findit`)}>
                Find It
              </span>
            }
          >
            <Link to={`/${userRole}/findit`}>
              <i className="mdi mdi-file-search-outline" />

              <span className="padd__left"> Find It </span>
            </Link>
          </Tooltip>
        </Menu.Item>

        <Menu.Item key="3">
          <Tooltip
            overlayClassName="hover__menu__sidebar"
            mouseLeaveDelay={0.15}
            mouseEnterDelay={-0.15}
            placement="right"
            title={
              <div onClick={() => props.history.push(`/${userRole}/fixit`)}>
                Fix It
              </div>
            }
          >
            <Link to={`/${userRole}/fixit`}>
              <i className="mdi mdi-hand-pointing-right"></i>
              <span>Fix It</span>
            </Link>
          </Tooltip>
        </Menu.Item>

        <Menu.Item key="4">
          <Tooltip
            overlayClassName="hover__menu__sidebar no__margin"
            mouseLeaveDelay={0.15}
            mouseEnterDelay={-0.15}
            placement="right"
            title={<>My Services</>}
          >
            <Link to={`/${userRole}/myservices`}>
              <i className="mdi mdi-file-document-outline"></i>
              <span className="padd__left">My Services</span>
            </Link>
          </Tooltip>
        </Menu.Item>

        <Menu.Item key="5">
          <Tooltip
            overlayClassName="hover__menu__sidebar no__margin"
            mouseLeaveDelay={0.15}
            mouseEnterDelay={-0.15}
            placement="right"
            title={
              <span onClick={() => props.history.push(`/${userRole}/contacts`)}>
                My Clients
              </span>
            }
          >
            <Link to={`/${userRole}/contacts`}>
              <i className="mdi mdi-account-multiple-outline"></i>
              <span className="padd__left">My Clients</span>
            </Link>
          </Tooltip>
        </Menu.Item>

        <Menu.Item key="6">
          <Tooltip
            overlayClassName="hover__menu__sidebar no__margin"
            mouseLeaveDelay={0.15}
            mouseEnterDelay={-0.15}
            placement="right"
            title={<>My Money</>}
          >
            <Link to={`/${userRole}/mymoney`}>
              <i className="mdi mdi-cash-multiple"></i>
              <span className="padd__left">My Money</span>
            </Link>
          </Tooltip>
        </Menu.Item>

        <Menu.Item key="8">
          <Tooltip
            overlayClassName="hover__menu__sidebar no__margin"
            mouseLeaveDelay={0.15}
            mouseEnterDelay={-0.15}
            placement="right"
            title={
              <div onClick={() => props.history.push(`/${userRole}/screening`)}>
                Screening
              </div>
            }
          >
            <Link to={`/${userRole}/screening`}>
              <i className="mdi mdi-file-search-outline"></i>
              <span className="padd__left">Screening</span>
            </Link>
          </Tooltip>
        </Menu.Item>

        <Menu.Item key="7" className="fixed__btm--reminders">
          <Tooltip
            overlayClassName="hover__menu__sidebar"
            mouseLeaveDelay={0.15}
            mouseEnterDelay={-0.15}
            placement="right"
            title={
              <div onClick={() => props.history.push(`/${userRole}/calendar`)}>
                Reminders
              </div>
            }
          >
            <Link to={`/${userRole}/calendar`}>
              <i className="mdi mdi-calendar"></i>
              <span>Reminders</span>
            </Link>
          </Tooltip>
        </Menu.Item>

        <Menu.Item key="9" className="fixed__btm--settings">
          <Tooltip
            overlayClassName="hover__menu__sidebar"
            mouseLeaveDelay={0.15}
            mouseEnterDelay={-0.15}
            placement="right"
            title={
              <div onClick={() => props.history.push(`/${userRole}/settings`)}>
                Settings
              </div>
            }
          >
            <Link to={`/${userRole}/settings`}>
              <i className="mdi mdi-settings"></i>
              <span className="padd__left">Settings</span>
            </Link>
          </Tooltip>
        </Menu.Item>

        <Menu.Item key="10" className="fixed__btm--support">
          <Tooltip
            overlayClassName="hover__menu__sidebar no__margin"
            mouseLeaveDelay={0.15}
            mouseEnterDelay={-0.15}
            placement="right"
            title={<>Support</>}
          >
            <a
              rel="noopener noreferrer"
              href={`https://rentoncloud.freshdesk.com/support/home`}
              target="_blank"
            >
              <i className="mdi mdi-headphones"></i>
              <span>Support</span>
            </a>
          </Tooltip>
        </Menu.Item>

        <div className="used_space text-center fixed__btm--progressbar">
          <StorageLevel />
        </div>
      </Menu>
    );
  return (
    <Menu
      defaultOpenKeys={[]}
      onClick={() => props.hideSideBarOnMobileOnClick()}
      mode="inline"
      theme="light"
      openKeys={props.openKeys}
      onOpenChange={props.onOpenChange}
    >
      <Menu.Item key="1">
        <Link to={`/${userRole}/dashboard`}>
          <i className="mdi mdi-home" />
          <span className="padd__left">Dashboard</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="2">
        <Link to={`/${userRole}/findit`}>
          <i className="mdi mdi-file-search-outline" />

          <span className="padd__left">Find It </span>
        </Link>
      </Menu.Item>

      <Menu.Item key="3">
        <Link to={`/${userRole}/fixit`}>
          <i className="mdi mdi-hand-pointing-right"></i>
          <span className="padd__left">Fix It</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="4">
        <Link to={`/${userRole}/myservices`}>
          <i className="mdi mdi-file-document-outline"></i>
          <span className="padd__left">My Services</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="5">
        <Link to={`/${userRole}/contacts`}>
          <i className="mdi mdi-account-multiple-outline"></i>
          <span className="padd__left">My Clients </span>
        </Link>
      </Menu.Item>

      <Menu.Item key="6">
        <Link to={`/${userRole}/mymoney`}>
          <i className="mdi mdi-cash-multiple"></i>
          <span className="padd__left">My Money</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="8">
        <Link to={`/${userRole}/screening`}>
          <i className="mdi mdi-file-search-outline"></i>
          <span className="padd__left">Screening</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="7" className="fixed__btm--reminders">
        <Link to={`/${userRole}/calendar`}>
          <i className="mdi mdi-calendar"></i>
          <span className="padd__left">Reminders</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="9" className="fixed__btm--settings">
        <Link to={`/${userRole}/settings`}>
          <i className="mdi mdi-settings"></i>
          <span className="padd__left">Settings</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="10" className="fixed__btm--support">
        <a
          rel="noopener noreferrer"
          href={`https://rentoncloud.freshdesk.com/support/home`}
          target="_blank"
        >
          <i className="mdi mdi-headphones"></i>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span>Support</span>
        </a>
      </Menu.Item>

      <div className="used_space text-center fixed__btm--progressbar">
        <StorageLevel />
      </div>
    </Menu>
  );
};

export default ServiceProMenu;
