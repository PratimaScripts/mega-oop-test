import React, { lazy } from "react";
import { Redirect } from "react-router-dom";

const ProfileInfo = lazy(() => import("components/Common/SettingsTabs/ProfileInfo"));
const SocialConnect = lazy(() => import("components/Common/SettingsTabs/SocialConnect"));
const PaymentMethod = lazy(() => import("components/Common/SettingsTabs/PaymentMethod"));
const PersonaProfile = lazy(() => import("components/Common/SettingsTabs/PersonaProfile"));
const AccountSetting = lazy(() => import("components/Common/SettingsTabs/AccountSetting"));
const SecuritySetting = lazy(() => import("components/Common/SettingsTabs/Security"));
const PrivacySetting = lazy(() => import("components/Common/SettingsTabs/Privacy"));
const NotificationSettings = lazy(() => import("components/Common/SettingsTabs/Notifications"));
const SubscriptionSetting = lazy(() => import("components/Common/SettingsTabs/Subscription"));
const ChartOfAccount = lazy(() => import("components/Common/SettingsTabs/ChartOfAccount"));
const UserRole = lazy(() => import("components/Common/SettingsTabs/UserRole"));
const ServiceproPersona = lazy(() => import("components/Common/SettingsTabs/PersonaProfile/ServiceproPersona"));

const SettingRoutes = (role='landlord') => {
    const identifier = `/${role}/settings`;

    const settingRoutes = [
        {
            path: `${identifier}`,
            exact: true,
            component: (props) => <Redirect to={`${identifier}/info`} />
        },
        {
            path: `${identifier}/info`,
            exact: true,
            component: (props) => <ProfileInfo {...props}/>
        },
        {
            path: `${identifier}/social-connect`,
            exact: true,
            component: (props) => <SocialConnect {...props}/>
        },
        {
            path: `${identifier}/payment-method`,
            exact: true,
            component: (props) => <PaymentMethod {...props}/>
        },
        {
            path: `${identifier}/persona`,
            exact: true,
            component: (props) => role === 'servicepro' ? <ServiceproPersona {...props} /> : <PersonaProfile {...props}/> 
        },
        {
            path: `${identifier}/accountsetting`,
            exact: true,
            component: (props) => <AccountSetting {...props}/>
        },
        {
            path: `${identifier}/security`,
            exact: true,
            component: (props) => <SecuritySetting {...props}/>
        },
        {
            path: `${identifier}/privacy`,
            exact: true,
            component: (props) => <PrivacySetting {...props}/>
        },
        {
            path: `${identifier}/notifications`,
            exact: true,
            component: (props) => <NotificationSettings {...props}/>
        },
        {
            path: `${identifier}/subscriptions`,
            exact: true,
            component: (props) => <SubscriptionSetting {...props}/>
        },
        {
            path: `${identifier}/userRole`,
            exact: true,
            component: (props) => <UserRole {...props} />
        }
    ]

    if(role === "landlord" || role==="admin") {
        const chartOfAccount = {
            path: `${identifier}/chartOfAccount`,
            exact: true,
            component: (props) => <ChartOfAccount {...props} />
        }

        settingRoutes.push(chartOfAccount)
    }

    return settingRoutes;

    // return (
    //     <Switch>
    //         <Route exact path={`${match.url}`}>
    //             <Redirect to={`${match.url}/info`} />
    //         </Route>
    //         <Route exact path={`${match.url}/info`}>
    //             <ProfileInfo
    //                 {...props}
    //             />
    //         </Route>
    //         <Route exact path={`${match.url}/social-connect`}>
    //             <SocialConnect
    //                 {...props}
    //             />
    //         </Route>
    //         <Route exact path={`${match.url}/payment-method`}>
    //             <PaymentMethod
    //                 {...props}
    //             />
    //         </Route>
    //         <Route exact path={`${match.url}/persona`}>
    //             <PersonaProfile
    //                 {...props}
    //             />
    //         </Route>
    //         <Route exact path={`${match.url}/accountsetting`}>
    //             <AccountSetting
    //                 {...props}
    //             />
    //         </Route>
    //         <Route exact path={`${match.url}/security`}>
    //             <SecuritySetting
    //                 {...props}
    //             />
    //         </Route>
    //         <Route exact path={`${match.url}/privacy`}>
    //             <PrivacySetting
    //                 {...props}
    //             />
    //         </Route>
    //         <Route exact path={`${match.url}/notifications`}>
    //             <NotificationSettings
    //                 {...props}
    //             />
    //         </Route>
    //         <Route exact path={`${match.url}/subscriptions`}>
    //             <SubscriptionSetting
    //                 {...props}
    //             />
    //         </Route>

    //         <Route exact path={`${match.url}/userRole`}>
    //             <UserRole
    //                 {...props}
    //             />
    //         </Route>

    //         {(currentUserRole === "landlord" ||
    //             currentUserRole === "admin") && (
    //                 <Route exact path={`${match.url}/chartOfAccount`}>
    //                     <ChartOfAccount
    //                         {...props}
    //                     />
    //                 </Route>
    //             )}
    //     </Switch>
    // )
}

export default SettingRoutes;