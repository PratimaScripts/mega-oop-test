import React, { useContext } from "react";
import { Menu, Tooltip } from "antd";
import { Link, useHistory } from "react-router-dom";
import StorageLevel from "../../Common/StorageLevel";
import { UserDataContext } from "store/contexts/UserContext";
import { InterfaceContext } from "store/contexts/InterfaceContext";

const LandlordMenu = (props) => {
  const history = useHistory();
  const { hideScroll } = props;
  const { state: userState } = useContext(UserDataContext);
  const { state: interfaceState } = useContext(InterfaceContext);
  const { sidebarCollapsed } = interfaceState;

  const { userData, isImpersonate } = userState;
  const userRole = userData.role;

  const { SubMenu } = Menu;

  const allPermAr = [];

  // permissions.forEach((p, i) => {
  //     allPermAr.push(p.tab);
  // });

  if (isImpersonate && false)
    return (
      <Menu
        defaultOpenKeys={[1]}
        mode="inline"
        theme="light"
        onClick={() => props.hideSideBarOnMobileOnClick()}
        openKeys={props.openKeys}
        onOpenChange={props.onOpenChange}
      >
        <Menu.Item key="1">
          <Link to={`/${userRole}/dashboard`}>
            <i className="mdi mdi-home" />
            <span>Dashboard</span>
          </Link>
        </Menu.Item>

        {!allPermAr.includes("Properties") && (
          <Menu.Item key="2">
            <i className="mdi mdi-office-building" />
            <span>Properties</span>
          </Menu.Item>
        )}

        {!allPermAr.includes("Listings") && (
          <Menu.Item key="3">
            <Link to={`/${userRole}/listing`}>
              <i className="mdi mdi-format-list-numbered"></i>
              <span>Listings</span>
            </Link>
          </Menu.Item>
        )}

        {!allPermAr.includes("Applications") && (
          <Menu.Item key="4">
            <Link to={`/${userRole}/applications`}>
              <i className="mdi mdi-account-box-outline"></i>
              <span>Applications</span>
            </Link>
          </Menu.Item>
        )}

        {!allPermAr.includes("Screening") && (
          <Menu.Item key="5">
            <Link to={`/${userRole}/screening`}>
              <i className="mdi mdi-file-search-outline"></i>
              <span>Screening</span>
            </Link>
          </Menu.Item>
        )}
        {!allPermAr.includes("Contacts") && (
          <Menu.Item key="6">
            <Link to={`/${userRole}/contacts`}>
              <i className="mdi mdi-account-multiple-plus-outline"></i>
              <span>Contacts</span>
            </Link>
          </Menu.Item>
        )}

        {!allPermAr.includes("Tenancies") && (
          <SubMenu
            key="Tenancies"
            title={
              <span>
                <i className="mdi mdi-briefcase-account"></i>
                <span>Tenancies</span>
              </span>
            }
          >
            <Menu.Item key="7">Agreement</Menu.Item>
            <Menu.Item key="8">Documents</Menu.Item>
            <Menu.Item key="9">Inventory</Menu.Item>
          </SubMenu>
        )}

        {!allPermAr.includes("Accounting") && (
          <SubMenu
            key="Accounting"
            title={
              <span>
                <i className="mdi mdi-scale-balance"></i>
                <span>Accounting</span>
              </span>
            }
          >
            <Menu.Item key="10">Rental Invoice</Menu.Item>
            <Menu.Item key="11">Transactions</Menu.Item>
            <Menu.Item key="12">Deposits</Menu.Item>
          </SubMenu>
        )}

        {!allPermAr.includes("Report") && (
          <Menu.Item key="13">
            <i className="mdi mdi-chart-bar"></i>
            <span>Report</span>
          </Menu.Item>
        )}

        {!allPermAr.includes("FixIt") && (
          <Menu.Item key="14">
            <i className="mdi mdi-hand-pointing-right"></i>
            <span>Fix It</span>
          </Menu.Item>
        )}

        <Menu.Item key="15" className="fixed__btm--reminders">
          <Link to={`/${userRole}/calendar`}>
            <i className="mdi mdi-calendar"></i>
            <span className="padd__left">Reminders</span>
          </Link>
        </Menu.Item>

        <Menu.Item key="16" className="fixed__btm--settings">
          <Link to={`/${userRole}/settings`}>
            <i className="mdi mdi-settings"></i>
            <span className="padd__left">Settings</span>
          </Link>
        </Menu.Item>

        <Menu.Item key="17" className="fixed__btm--support">
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
  else if (!sidebarCollapsed)
    return (
      <Menu
        defaultOpenKeys={[]}
        mode="inline"
        theme="light"
        onClick={() => props.hideSideBarOnMobileOnClick()}
        openKeys={props.openKeys}
        onOpenChange={props.onOpenChange}
        // onClick={hideSidebarMenuClick}
      >
        <Menu.Item key="1">
          <Link to={`/${userRole}/dashboard`}>
            <i className="mdi mdi-home" />
            <span className="padd__left">Dashboard</span>
          </Link>
        </Menu.Item>

        <Menu.Item key="2">
          <Link to={`/${userRole}/property`}>
            <i className="mdi mdi-office-building" />
            <span className="padd__left">Properties</span>
          </Link>
        </Menu.Item>

        <Menu.Item key="3">
          <Link to={`/${userRole}/listings`}>
            <i className="mdi mdi-format-list-numbered"></i>
            <span className="padd__left">Listings</span>
          </Link>
        </Menu.Item>

        <Menu.Item key="4">
          <Link to={`/${userRole}/applications`}>
            <i className="mdi mdi-account-box-outline"></i>
            <span className="padd__left">Applications</span>
          </Link>
        </Menu.Item>

        <Menu.Item key="5">
          <Link to={`/${userRole}/screening`}>
            <i className="mdi mdi-file-search-outline"></i>
            <span className="padd__left">Screening</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="6">
          <Link to={`/${userRole}/contacts`}>
            <i className="mdi mdi-account-multiple-plus-outline"></i>
            <span className="padd__left">Contacts</span>
          </Link>
        </Menu.Item>

        <SubMenu
          key="Tenancies"
          title={
            <span>
              <i className="mdi mdi-briefcase-account"></i>
              <span className="padd__left">Tenancies</span>
            </span>
          }
        >
          <Menu.Item key="7">
            <Link to={`/${userRole}/agreement`}>Agreement</Link>
          </Menu.Item>
          <Menu.Item key="8">
            <Link to={`/${userRole}/documents`}>Documents</Link>
          </Menu.Item>
          <Menu.Item key="9">
            <Link to={`/${userRole}/inventory`}>Inventory</Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu
          key="Accounting"
          title={
            <span>
              <i className="mdi mdi-scale-balance"></i>
              <span className="padd__left">Accounting</span>
            </span>
          }
        >
          <Menu.Item key="10">
            <Link to={`/${userRole}/accounting/rental-invoice`}>
              Rental Invoice
            </Link>
          </Menu.Item>
          <Menu.Item key="11">
            <Link to={`/${userRole}/accounting/rental-transaction`}>
              Transactions
            </Link>
          </Menu.Item>
          <Menu.Item key="12">
            <Link to={`/${userRole}/accounting/rental-deposits`}>Deposits</Link>
          </Menu.Item>
        </SubMenu>

        <Menu.Item key="13">
          <Link to={`/${userRole}/reports`}>
            <i className="mdi mdi-chart-bar"></i>
            <span className="padd__left">Report</span>
          </Link>
        </Menu.Item>

        <Menu.Item key="14">
          <Link to={`/${userRole}/fixit`}>
            <i className="mdi mdi-hand-pointing-right"></i>
            <span className="padd__left">Fix It</span>
          </Link>
        </Menu.Item>

        <Menu.Item key="15-servicepro">
          <Link to={`/${userRole}/service-orders`}>
            <i className="mdi mdi-file-document-outline"></i>
            <span className="padd__left">Service Orders</span>
          </Link>
        </Menu.Item>

        <Menu.Item key="18-manage-mandates-2">
          <Link to={`/${userRole}/mandates`}>
            <i className="mdi mdi-credit-card-settings-outline"></i>
            <span className="padd__left">Manage Mandates</span>
          </Link>
        </Menu.Item>

        <Menu.Item key="15-reminders" className="fixed__btm--reminders">
          <Link to={`/${userRole}/calendar`}>
            <i className="mdi mdi-calendar"></i>
            <span className="padd__left">Reminders</span>
          </Link>
        </Menu.Item>

        <Menu.Item key="16" className="fixed__btm--settings">
          <Link to={`/${userRole}/settings`}>
            <i className="mdi mdi-settings"></i>
            <span className="padd__left">Settings</span>
          </Link>
        </Menu.Item>

        <Menu.Item key="17" className="fixed__btm--support">
          <a
            rel="noopener noreferrer"
            href={`https://rentoncloud.freshdesk.com/support/home`}
            target="_blank"
          >
            <i className="mdi mdi-headphones"></i>
            <span className="padd__left">Support</span>
          </a>
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
      // onClick={() => dispatch({ type: 'SET_LOCATION', payload: window.location })}
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
          arrowPointAtCenter={true}
          title={
            <div onClick={() => history.push(`/${userRole}/dashboard`)}>
              Dashboard
            </div>
          }
        >
          <Link to={`/${userRole}/dashboard`}>
            <i className="mdi mdi-home" />
            <span>Dashboard</span>
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
            <div onClick={() => history.push(`/${userRole}/property`)}>
              Properties
            </div>
          }
        >
          <Link to={`/${userRole}/property`}>
            <i className="mdi mdi-office-building" />
            <span>Properties</span>
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
            <div onClick={() => history.push(`/${userRole}/listings`)}>
              Listings
            </div>
          }
        >
          <Link to={`/${userRole}/listings`}>
            <i className="mdi mdi-format-list-numbered"></i>
            <span>Listings</span>
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
            <div onClick={() => history.push(`/${userRole}/applications`)}>
              Applications
            </div>
          }
        >
          <Link to={`/${userRole}/applications`}>
            <i className="mdi mdi-account-box-outline"></i>
            <span>Applications</span>
          </Link>
        </Tooltip>
      </Menu.Item>

      <Menu.Item key="5">
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
            <span>Screening</span>
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
            <div onClick={() => history.push(`/${userRole}/contacts`)}>
              Contacts
            </div>
          }
        >
          <Link to={`/${userRole}/contacts`}>
            <i className="mdi mdi-account-multiple-plus-outline"></i>
            <span>Contacts</span>
          </Link>
        </Tooltip>
      </Menu.Item>

      <SubMenu
        key="Tenancies"
        title={
          <span>
            <i className="mdi mdi-briefcase-account"></i>
            <span>Tenancies</span>
          </span>
        }
      >
        <Menu.Item key="7">
          <Link to={`/${userRole}/agreement`}>Agreement</Link>
        </Menu.Item>
        <Menu.Item key="8">
          <Link to={`/${userRole}/documents`}>Documents</Link>
        </Menu.Item>
        <Menu.Item key="9">
          <Link to={`/${userRole}/inventory`}>Inventory</Link>
        </Menu.Item>
      </SubMenu>

      <SubMenu
        key="Accounting"
        title={
          <span>
            <i className="mdi mdi-scale-balance"></i>
            <span>Accounting</span>
          </span>
        }
      >
        <Menu.Item key="10">
          <Link to={`/${userRole}/accounting/rental-invoice`}>
            Rental Invoice
          </Link>
        </Menu.Item>
        <Menu.Item key="11">
          <Link to={`/${userRole}/accounting/rental-transaction`}>
            Transactions
          </Link>
        </Menu.Item>
        <Menu.Item key="12">
          <Link to={`/${userRole}/settings`}>Deposits</Link>
        </Menu.Item>
      </SubMenu>

      <Menu.Item key="13">
        <Tooltip
          overlayClassName="hover__menu__sidebar"
          mouseLeaveDelay={0.15}
          mouseEnterDelay={-0.15}
          placement="right"
          title={<>Report</>}
        >
          <Link to={`/${userRole}/settings`}>
            <i className="mdi mdi-chart-bar"></i>
            <span>Report</span>
          </Link>
        </Tooltip>
      </Menu.Item>

      <Menu.Item key="14">
        <Tooltip
          overlayClassName="hover__menu__sidebar"
          mouseLeaveDelay={0.15}
          mouseEnterDelay={-0.15}
          placement="right"
          title={
            <div onClick={() => history.push(`/${userRole}/fixit`)}>Fix It</div>
          }
        >
          <Link to={`/${userRole}/fixit`}>
            <i className="mdi mdi-hand-pointing-right"></i>
            <span>Fix It</span>
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

      <Menu.Item key="15" className="fixed__btm--reminders">
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

      <Menu.Item key="16" className="fixed__btm--settings">
        <Tooltip
          overlayClassName="hover__menu__sidebar"
          mouseLeaveDelay={0.15}
          mouseEnterDelay={-0.15}
          placement="right"
          // arrowPointAtCenter={true}
          title={
            <div onClick={() => history.push(`/${userRole}/settings`)}>
              Settings
            </div>
          }
        >
          <Link to={`/${userRole}/settings`}>
            <i className="mdi mdi-settings"></i>
            <span>Settings</span>
          </Link>
        </Tooltip>
      </Menu.Item>

      <Menu.Item key="17" className="fixed__btm--support">
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
};

export default LandlordMenu;
