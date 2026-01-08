// import Impersonators from "components/Private/Impersonators";
// import Invitations from "components/Private/Impersonators/Invitations";
import React from "react";
import { Redirect } from "react-router-dom";
import UserWorkspace from "../components/Common/Impersonator/workspace";

const DelegateRoutes = (role = 'landlord') => ([
    {
        path: `/workspace`,
        exact: true,
        component: (props) => <UserWorkspace />
    },
    {
        path: `/invitee`,
        exact: true,
        component: (props) => <Redirect to={`workspace`} />
    }
])


export default DelegateRoutes;