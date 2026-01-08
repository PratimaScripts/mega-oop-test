import React, { useContext } from "react";
import { Menu, Tooltip } from "antd";
import { Link, useHistory } from "react-router-dom";

import { UserDataContext } from "store/contexts/UserContext";
import { InterfaceContext } from "store/contexts/InterfaceContext";
import StorageLevel from "components/Common/StorageLevel";

const { SubMenu } = Menu;

const RenterMenu = (props) => {
  const history = useHistory();
  //isMenuDisabled,
  const { hideScroll } = props;
  const { state: userState } = useContext(UserDataContext);
  const { state: interfaceState } = useContext(InterfaceContext);
  const { sidebarCollapsed } = interfaceState;

  const { userData } = userState;
  const userRole = userData.role;

  if (sidebarCollapsed)
    return (
      <Menu
        // onClick={hideSidebarMenuClick}
        defaultOpenKeys={[]}
        mode="inline"
        theme="light"
        onClick={() => props.hideSideBarOnMobileOnClick()}
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
              <div onClick={() => history.push(`/${userRole}/dashboard`)}>
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
            title={<>Manage Rent</>}
          >
            <SubMenu
              key="Accounting"
              title={
                <span>
                  <i className="mdi mdi-scale-balance"></i>
                  <span className="padd__left">Accounting</span>
                </span>
              }
            >
              <Menu.Item key="2">
                <Link to={`/${userRole}/manage-rent`}>
                  <i className="mdi mdi-currency-gbp" />
                  <span className="padd__left">Manage Rent</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="1b1">
                <Link to={`/${userRole}/manage-deposit`}>
                  <i className="mdi mdi-currency-gbp" />
                  <span className="padd__left">Manage Deposits</span>
                </Link>
              </Menu.Item>
            </SubMenu>
          </Tooltip>
        </Menu.Item>

        <Menu.Item key="3">
          <Tooltip
            overlayClassName="hover__menu__sidebar"
            mouseLeaveDelay={0.15}
            mouseEnterDelay={-0.15}
            placement="right"
            title={
              <div onClick={() => history.push(`/${userRole}/myrental`)}>
                My Rental
              </div>
            }
          >
            <Link to={`/${userRole}/myrental`}>
              <i className="mdi mdi-home-account"></i>
              <span className="padd__left">My Rental</span>
            </Link>
          </Tooltip>
        </Menu.Item>

        <Menu.Item key="4">
          <Tooltip
            overlayClassName="hover__menu__sidebar"
            mouseLeaveDelay={0.15}
            mouseEnterDelay={-0.15}
            placement="right"
            title={
              <div onClick={() => history.push(`/${userRole}/fixit`)}>
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

        <Menu.Item key="6">
          <Tooltip
            overlayClassName="hover__menu__sidebar"
            mouseLeaveDelay={0.15}
            mouseEnterDelay={-0.15}
            placement="right"
            title={
              <div onClick={() => history.push(`/${userRole}/dashboard`)}>
                Applications
              </div>
            }
          >
            <Link to={`/${userRole}/dashboard`}>
              <i className="mdi mdi-account-box-outline"></i>
              <span className="padd__left">Applications</span>
            </Link>
          </Tooltip>
        </Menu.Item>

        <Menu.Item key="7">
          <Tooltip
            overlayClassName="hover__menu__sidebar"
            mouseLeaveDelay={0.15}
            mouseEnterDelay={-0.15}
            placement="right"
            title={
              <div onClick={() => history.push(`/${userRole}/screening`)}>
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

        <Menu.Item key="8">
          <Tooltip
            overlayClassName="hover__menu__sidebar"
            mouseLeaveDelay={0.15}
            mouseEnterDelay={-0.15}
            placement="right"
            title={
              <span onClick={() => history.push(`/${userRole}/contacts`)}>
                Contacts
              </span>
            }
          >
            <Link to={`/${userRole}/contacts`}>
              <i className="mdi mdi-account-multiple-plus-outline"></i>
              <span className="padd__left">Contacts</span>
            </Link>
          </Tooltip>
        </Menu.Item>

        <Menu.Item key="9">
          <Tooltip
            overlayClassName="hover__menu__sidebar"
            mouseLeaveDelay={0.15}
            mouseEnterDelay={-0.15}
            placement="right"
            title={
              <span onClick={() => history.push(`/${userRole}/wishlist`)}>
                Rental Wishlist
              </span>
            }
          >
            <Link to={`/${userRole}/wishlist`}>
              <i className="mdi mdi-account-heart-outline"></i>
              <span className="padd__left">Rental Wishlist</span>
            </Link>
          </Tooltip>
        </Menu.Item>

        <Menu.Item key="9-service-order">
          <Tooltip
            overlayClassName="hover__menu__sidebar"
            mouseLeaveDelay={0.15}
            mouseEnterDelay={-0.15}
            placement="right"
            title={
              <span onClick={() => history.push(`/${userRole}/service-orders`)}>
                Service Orders
              </span>
            }
          >
            <Link to={`/${userRole}/service-orders`}>
              <i className="mdi mdi-file-document-outline"></i>
              <span className="padd__left">Service Orders</span>
            </Link>
          </Tooltip>
        </Menu.Item>

        <Menu.Item key="5" className="fixed__btm--reminders">
          <Tooltip
            overlayClassName="hover__menu__sidebar"
            mouseLeaveDelay={0.15}
            mouseEnterDelay={-0.15}
            placement="right"
            title={
              <div onClick={() => history.push(`/${userRole}/calendar`)}>
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

        <Menu.Item key="9-settings" className="fixed__btm--settings">
          <Tooltip
            overlayClassName="hover__menu__sidebar"
            mouseLeaveDelay={0.15}
            mouseEnterDelay={-0.15}
            placement="right"
            title={
              <div onClick={() => history.push(`/${userRole}/settings`)}>
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
            overlayClassName="hover__menu__sidebar"
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
      mode="inline"
      theme="light"
      onClick={() => props.hideSideBarOnMobileOnClick()}
      openKeys={props.openKeys}
      onOpenChange={props.onOpenChange}
    >
      <Menu.Item key="1">
        <Link to={`/${userRole}/dashboard`}>
          <i className="mdi mdi-home" />
          <span className="padd__left">Dashboard</span>
        </Link>
      </Menu.Item>

      <SubMenu
        key="Accounting"
        title={
          <span>
            <i className="mdi mdi-scale-balance"></i>
            <span className="padd__left">Accounting</span>
          </span>
        }
      >
        <Menu.Item key="2">
          <Link to={`/${userRole}/manage-rent`}>
            <i className="mdi mdi-currency-gbp" />
            <span className="padd__left">Manage Rent</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="1b1">
          <Link to={`/${userRole}/manage-deposit`}>
            <i className="mdi mdi-currency-gbp" />
            <span className="padd__left">Manage Deposits</span>
          </Link>
        </Menu.Item>
      </SubMenu>

      <Menu.Item key="3">
        <Link to={`/${userRole}/myrental`}>
          <i className="mdi mdi-home-account"></i>
          <span className="padd__left">My Rental</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="4">
        <Link to={`/${userRole}/fixit`}>
          <i className="mdi mdi-hand-pointing-right"></i>
          <span className="padd__left">Fix It</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="6">
        <Link to={`/${userRole}/dashboard`}>
          <i className="mdi mdi-account-box-outline"></i>
          <span className="padd__left">Applications</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="7">
        <Link to={`/${userRole}/screening`}>
          <i className="mdi mdi-file-search-outline"></i>
          <span className="padd__left">Screening</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="8">
        <Link to={`/${userRole}/contacts`}>
          <i className="mdi mdi-account-multiple-plus-outline"></i>
          <span className="padd__left">Contacts</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="9">
        <Link to={`/${userRole}/wishlist`}>
          <i className="mdi mdi-account-heart-outline"></i>
          <span className="padd__left">Rental Wishlist</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="9-service-orders-2">
        <Link to={`/${userRole}/service-orders`}>
          <i className="mdi mdi-file-document-outline"></i>
          <span className="padd__left">Service Orders</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="9-manage-mandates-2">
        <Link to={`/${userRole}/mandates`}>
          <i className="mdi mdi-credit-card-settings-outline"></i>
          <span className="padd__left">Manage Mandates</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="5" className="fixed__btm--reminders">
        <Link to={`/${userRole}/calendar`}>
          <i className="mdi mdi-calendar"></i>
          <span className="padd__left">Reminders</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="9-settings" className="fixed__btm--settings">
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

export default RenterMenu;
