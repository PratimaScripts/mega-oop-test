import React, { lazy } from "react";
import { Redirect } from "react-router-dom";

const ChartOfAccount = lazy(() =>
  import("components/Common/SettingsTabs/ChartOfAccount")
);
const AllUsers = lazy(() => import("components/Private/MainAdmin/Users"));
const Exports = lazy(() => import("components/Private/MainAdmin/Exports"));
const Task = lazy(() => import("components/Private/MainAdmin/Task"));
const Properties = lazy(() => import("components/Private/MainAdmin/Properties"));
const Reports = lazy(() => import("components/Private/MainAdmin/Reports"));
const PaymentHistory = lazy(() =>
  import("components/Private/MainAdmin/PaymentHistory")
);
const Accrediations = lazy(() =>
  import("components/Private/MainAdmin/AccrediationsList")
);
const DocumentVerificationRequest = lazy(() =>
  import("components/Private/MainAdmin/DocumentVerificationRequest")
);
const DeleteRequests = lazy(() =>
  import("components/Private/MainAdmin/DeleteRequests")
);
const AddTaskCategory = lazy(() =>
  import("components/Private/MainAdmin/AddTaskCategory")
);
const ScreeningOrdersHistory = lazy(() =>
  import("components/Private/MainAdmin/ScreeningOrders")
);
const AddPropertySubcategory = lazy(() =>
  import("components/Private/MainAdmin/AddPropertySubcategory")
);
const UpdateRates = lazy(() =>
  import("components/Private/MainAdmin/UpdateRates")
);
const Dashboard = lazy(() => import("components/Private/MainAdmin/Dashboard"));
const AdminServices = lazy(() =>
  import("components/Private/MainAdmin/Services")
);

const AdminRoutes = (props) => {
  const identifier = "/admin"

  return [
    {
      path: '/',
      exact: true,
      component: (props) => <Redirect to={`${identifier}`} />
    },
    {
      path: `${identifier}`,
      exact: true,
      component: (props) => <Dashboard  {...props} />
    },
    {
      path: `${identifier}/dashboard`,
      exact: true,
      component: (props) => <Redirect to={`${identifier}`} />
    },
    {
      path: `${identifier}/chartOfAccount`,
      exact: true,
      component: (props) => <ChartOfAccount {...props} />
    },
    {
      path: `${identifier}/users`,
      exact: true,
      component: (props) => <AllUsers {...props} />
    },
    {
      path: `${identifier}/exportRequests`,
      exact: true,
      component: (props) => <Exports {...props} />
    },
    {
      path: `${identifier}/deleteRequests`,
      exact: true,
      component: (props) => <DeleteRequests {...props} />
    },
    {
      path: `${identifier}/accrediations`,
      exact: true,
      component: (props) => <Accrediations {...props} />
    },
    {
      path: `${identifier}/paymentHistory`,
      exact: true,
      component: (props) => <PaymentHistory {...props} />
    },
    {
      path: `${identifier}/docVerification`,
      exact: true,
      component: (props) => <DocumentVerificationRequest {...props} />
    },
    {
      path: `${identifier}/taskCategory`,
      exact: true,
      component: (props) => <AddTaskCategory {...props} />
    },
    {
      path: `${identifier}/propertySubtype`,
      exact: true,
      component: (props) => <AddPropertySubcategory {...props} />
    },
    {
      path: `${identifier}/screeningOrders`,
      exact: true,
      component: (props) => <ScreeningOrdersHistory {...props}
      />
    },
    {
      path: `${identifier}/reports`,
      exact: true,
      component: (props) => <Reports {...props} />
    },
    {
      path: `${identifier}/rates`,
      exact: true,
      component: (props) => <UpdateRates {...props} />
    },
    {
      path: `${identifier}/services`,
      exact: true,
      component: (props) => <AdminServices {...props} />
    },
    {
      path: `${identifier}/task`,
      exact: true,
      component: (props) => <Task {...props} />
    },
    {
      path: `${identifier}/properties`,
      exact: true,
      component: (props) => <Properties {...props} />
    },
    {
      path: `${identifier}/services`,
      exact: true,
      component: (props) => <AdminServices {...props} />
    }
  ]
}

export default AdminRoutes;