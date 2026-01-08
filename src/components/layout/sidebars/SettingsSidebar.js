import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { InterfaceContext } from "store/contexts/InterfaceContext";

import { Dropdown, Menu } from "antd";

const SettingsSidebar = ({ pathname, currentUserRole }) => {
  const { state: interfaceState } = useContext(InterfaceContext);
  const identifier = `/${currentUserRole}/settings`;

  const menu = (
    <Menu className="shift__dropdown">
      <Menu.Item key="0" className={pathname === "info" ? "active" : ""}>
        <Link
          onClick={(e) => pathname === "info" && e.preventDefault()}
          to={`${identifier}/info`}
        >
          Profile Info
        </Link>
      </Menu.Item>
      <Menu.Item key="1" className={pathname === "social-connect" ? "active" : ""}>
        <Link
          onClick={(e) => pathname === "social-connect" && e.preventDefault()}
          to={`${identifier}/social-connect`}
        >
          Social Connect
        </Link>
      </Menu.Item>
      <Menu.Item key="2" className={pathname === "payment-method" ? "active" : ""}>
        <Link
          onClick={(e) => pathname === "payment-method" && e.preventDefault()}
          to={`${identifier}/payment-method`}
        >
          Payment Method
        </Link>
      </Menu.Item>
      <Menu.Item key="3" className={pathname === "persona" ? "active" : ""}>
        <Link
          onClick={(e) => pathname === "persona" && e.preventDefault()}
          to={`${identifier}/persona`}
        >
          Persona Profile
        </Link>
      </Menu.Item>
      <Menu.Item key="4" className={pathname === "accountsetting" ? "active" : ""}>
        <Link
          onClick={(e) => pathname === "accountsetting" && e.preventDefault()}
          to={`${identifier}/accountsetting`}
        >
          Account Setting
        </Link>
      </Menu.Item>
      <Menu.Item key="5" className={pathname === "privacy" ? "active" : ""}>
        <Link
          onClick={(e) => pathname === "privacy" && e.preventDefault()}
          to={`${identifier}/privacy`}
        >
          Privacy
        </Link>
      </Menu.Item>
      <Menu.Item key="6" className={pathname === "security" ? "active" : ""}>
        <Link
          onClick={(e) => pathname === "security" && e.preventDefault()}
          to={`${identifier}/security`}
        >
          Security
        </Link>
      </Menu.Item>
      <Menu.Item key="7" className={pathname === "subscriptions" ? "active" : ""}>
        <Link
          onClick={(e) => pathname === "subscriptions" && e.preventDefault()}
          to={`${identifier}/subscriptions`}
        >
          Subscription
        </Link>
      </Menu.Item>
      <Menu.Item key="8" className={pathname === "notifications" ? "active" : ""}>
        <Link
          onClick={(e) => pathname === "notifications" && e.preventDefault()}
          to={`${identifier}/notifications`}
        >
          Notification
        </Link>
      </Menu.Item>
      <Menu.Item key="9" className={pathname === "userRole" ? "active" : ""}>
        <Link
          onClick={(e) => pathname === "userRole" && e.preventDefault()}
          to={`${identifier}/userRole`}
        >
          User Role
        </Link>
      </Menu.Item>
      {(currentUserRole === "landlord" || currentUserRole === "admin") && (
        <Menu.Item key="10" className={pathname === "chartOfAccount" ? "active" : ""}>
          <Link
            onClick={(e) => pathname === "chartOfAccount" && e.preventDefault()}
            to={`${identifier}/chartOfAccount`}
          >
            Chart of Account
          </Link>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <div>
      {interfaceState.windowWidth > 813 ? (
        <div className="profile__menu--listing">
          <ul>
            <li className={pathname === "info" ? "active" : ""}>
              <Link
                onClick={(e) => pathname === "info" && e.preventDefault()}
                to={`${identifier}/info`}
              >
                Profile Info
              </Link>
            </li>
            <li className={pathname === "social-connect" ? "active" : ""}>
              <Link
                onClick={(e) =>
                  pathname === "social-connect" && e.preventDefault()
                }
                to={`${identifier}/social-connect`}
              >
                Social Connect
              </Link>
            </li>
            <li className={pathname === "payment-method" ? "active" : ""}>
              <Link
                onClick={(e) =>
                  pathname === "payment-method" && e.preventDefault()
                }
                to={`${identifier}/payment-method`}
              >
                Payment Method
              </Link>
            </li>
            <li className={pathname === "persona" ? "active" : ""}>
              <Link
                onClick={(e) => pathname === "persona" && e.preventDefault()}
                to={`${identifier}/persona`}
              >
                Persona Profile
              </Link>
            </li>
            <li className={pathname === "accountsetting" ? "active" : ""}>
              <Link
                onClick={(e) =>
                  pathname === "accountsetting" && e.preventDefault()
                }
                to={`${identifier}/accountsetting`}
              >
                Account Setting
              </Link>
            </li>
            <li className={pathname === "privacy" ? "active" : ""}>
              <Link
                onClick={(e) => pathname === "privacy" && e.preventDefault()}
                to={`${identifier}/privacy`}
              >
                Privacy
              </Link>
            </li>
            <li className={pathname === "security" ? "active" : ""}>
              <Link
                onClick={(e) => pathname === "security" && e.preventDefault()}
                to={`${identifier}/security`}
              >
                Security
              </Link>
            </li>
            <li className={pathname === "subscriptions" ? "active" : ""}>
              <Link
                onClick={(e) =>
                  pathname === "subscriptions" && e.preventDefault()
                }
                to={`${identifier}/subscriptions`}
              >
                Subscription
              </Link>
            </li>
            <li className={pathname === "notifications" ? "active" : ""}>
              <Link
                onClick={(e) =>
                  pathname === "notifications" && e.preventDefault()
                }
                to={`${identifier}/notifications`}
              >
                Notification
              </Link>
            </li>
            <li className={pathname === "userRole" ? "active" : ""}>
              <Link
                onClick={(e) => pathname === "userRole" && e.preventDefault()}
                to={`${identifier}/userRole`}
              >
                User Role
              </Link>
            </li>
            {(currentUserRole === "landlord" ||
              currentUserRole === "admin") && (
              <li className={pathname === "chartOfAccount" ? "active" : ""}>
                <Link
                  onClick={(e) =>
                    pathname === "chartOfAccount" && e.preventDefault()
                  }
                  to={`${identifier}/chartOfAccount`}
                >
                  Chart of Account
                </Link>
              </li>
            )}
          </ul>
        </div>
      ) : (
        <div className="d-flex justify-content-end">
          <Dropdown overlay={menu} trigger={["click"]}>
            <div className="text-right">
              <button className="btn float">
                <i className="fas fa-cog fa-lg"/>
              </button>
            </div>
          </Dropdown>
        </div>
      )}
    </div>
  );
};

export default SettingsSidebar;
