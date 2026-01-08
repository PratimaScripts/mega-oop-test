import React, { useContext, useRef, useEffect, useState, Suspense, lazy } from "react";
import { Layout, Skeleton } from "antd";
import get from "lodash/get";
import "./sidebar.scss";
import OutsideAlerter from "utils/OutsideClickAlert";

import { UserDataContext } from 'store/contexts/UserContext';
import { InterfaceContext } from "store/contexts/InterfaceContext";
const LandlordMenu = lazy(() => import("./LandlordMenu"));
const ServiceProMenu = lazy(() => import("./ServiceProMenu"));
const AdminMenu = lazy(() => import("./AdminMenu"));
const RenterMenu = lazy(() => import("./RenterMenu"));


const DashboardSidebar = (props) => {
    const { state: userState } = useContext(UserDataContext)
    const { dispatch: interfaceDispatch,
        state: interfaceState } = useContext(InterfaceContext)
    const [openKeys, setOpenKeys] = useState(['']);
    const sidebarRef = useRef()

    //, permissions
    const { userData } = userState;
    const userRole = userData.role;
    const { sidebarCollapsed, sidebarClass } = interfaceState

    const { Sider } = Layout;


    // const allPermAr = [];

    // permissions.forEach((p, i) => {
    //     allPermAr.push(p.tab);
    // });

    useEffect(() => {
        // interfaceDispatch({
        //     type: 'COLLAPSE_SIDEBAR',
        //     payload: window.screen.width <= 768 ? true : false
        // }) // comment out this code to collapse the sidebar on mobile devices

        if (userRole === 'servicepro') {
            interfaceDispatch({
                type: 'UPDATE_SIDEBAR_CLASS',
                payload:  "menu__sidebar menu__sidebar--servicepro"
            })
        } else if (userRole === 'renter') {
            // console.log("here", sidebarClass)
            interfaceDispatch({
                type: 'UPDATE_SIDEBAR_CLASS',
                payload: "menu__sidebar menu__sidebar--renter"
            })
        } else {
            interfaceDispatch({
                type: 'UPDATE_SIDEBAR_CLASS',
                payload: "menu__sidebar"
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.screen.width, userRole])

    const hideScroll = type => {
        if (type === "hide") {
            document.querySelector("body").setAttribute("style", "");
        }

        if (type === "show") {
            document.querySelector("body").setAttribute("style", "overflow: hidden");
        }
    };

    const hideSideBarOnMobile = () => {
        // this function hides sidebar on mobile devices
        
        if(window.screen.width <= 768 && sidebarRef.current.className.includes("mobileSidebarShow")) {
        interfaceDispatch({
            type: "UPDATE_SIDEBAR_CLASS",
            payload: sidebarClass.replace("mobileSidebarShow", "")
          })
        }
    }
    

    const onOpenChange = keys => {
        // collapse other opened sub-menu
        const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    };

    const isMenuDisabled =
        get(userData, "isProfileUpdate") && get(userData, "isPersonaUpdate")
            ? false
            : true;

    //commented  the logic of menu disabled based on profile udpate.Fix the value of menudisable to false.
    // const isMenuDisabled=false;

    const SidebarMenu = userRole === 'servicepro'
        ? <ServiceProMenu
            isMenuDisabled={isMenuDisabled}
            hideScroll={hideScroll}
            openKeys={openKeys}
            hideSideBarOnMobileOnClick={hideSideBarOnMobile}
            onOpenChange={onOpenChange} />
        : (userRole === 'landlord'
            ? <LandlordMenu
                isMenuDisabled={isMenuDisabled}
                hideScroll={hideScroll}
                openKeys={openKeys}
                hideSideBarOnMobileOnClick={hideSideBarOnMobile}  
                onOpenChange={onOpenChange} />
            : (userRole === 'admin' ?
                <AdminMenu
                    isMenuDisabled={isMenuDisabled}
                    hideScroll={hideScroll}
                    openKeys={openKeys}
                    hideSideBarOnMobileOnClick={hideSideBarOnMobile}
                    onOpenChange={onOpenChange} />
                : <RenterMenu
                    isMenuDisabled={isMenuDisabled}
                    hideScroll={hideScroll}
                    openKeys={openKeys}
                    hideSideBarOnMobileOnClick={hideSideBarOnMobile}
                    onOpenChange={onOpenChange} />))
    return (
        <OutsideAlerter functionToRun={hideSideBarOnMobile}>
        <Sider
            ref={sidebarRef}
            className={sidebarClass}
            width={250}
            collapsed={sidebarCollapsed}
            // collapsedWidth={0}
        >
            <div>
                <Suspense
                    fallback={<Skeleton active loading={true}/>
                    }
                >
                    {SidebarMenu}
                </Suspense>
            </div>
        </Sider>
        </OutsideAlerter>
    )
}

export default DashboardSidebar;