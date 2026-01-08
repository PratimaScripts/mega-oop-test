import React, { lazy } from "react";
import { Redirect } from "react-router-dom";

import Dashboard from "components/Private/ServicePro/Dashboard";
import ScreeningReview from "components/Common/ScreeningReviewForms/ServicePro";
import ScreeningOrders from "components/Private/ServicePro/ServiceProSideNavs/Screening";
import Portfolio from "components/Private/ServicePro/ServiceProSideNavs/Portfolio";

import FixIt from "components/Private/ServicePro/ServiceProSideNavs/Fixit";
import FixItTaskReview from "components/Private/ServicePro/ServiceProSideNavs/Fixit/TaskReview";
import FindIt from "components/Private/ServicePro/ServiceProSideNavs/FindIt/index";
import FixItTask from "components/Common/Tasks/FixIt/AddTask";
const ScreeningReportSample = lazy(() =>
  import("components/Common/ScreeningReports/Sample/servicepro")
);
const ScreeningReport = lazy(() =>
  import("components/Common/ScreeningReports/Main/servicepro")
);

// const ContactCards = lazy(() => import("components/Private/ServicePro/ServiceProSideNavs/ContactCards"));
const Messenger = lazy(() => import("components/Common/Chats"));
const Calendar = lazy(() => import("components/Common/Calendar"));
const Services = lazy(() =>
  import("components/Private/ServicePro/ServiceProSideNavs/MyServices")
);
const MyMoney = lazy(() =>
  import("components/Private/ServicePro/ServiceProSideNavs/MyMoney")
);
const CreateOrEditService = lazy(() =>
  import(
    "components/Private/ServicePro/ServiceProSideNavs/MyServices/CreateOrEdit"
  )
);
const Contacts = lazy(() => import("components/Common/Contacts"));

const ServiceProRoutes = () => {
  const identifier = "/servicepro";

  const servicepropRoutes = [
    {
      path: "/",
      exact: true,
      component: (props) => <Redirect to={`${identifier}`} />,
    },
    {
      path: `${identifier}`,
      exact: true,
      component: (props) => <Dashboard {...props} />,
    },
    {
      path: `${identifier}/dashboard`,
      exact: true,
      component: (props) => <Redirect to={`${identifier}`} />,
    },
    {
      path: `${identifier}/screening/review`,
      exact: true,
      component: (props) => <ScreeningReview {...props} />,
    },
    {
      path: `${identifier}/screening`,
      exact: true,
      component: (props) => <ScreeningOrders {...props} />,
    },
    {
      path: `${identifier}/portfolio/:searchstring`,
      exact: true,
      component: (props) => <Portfolio {...props} />,
    },
    {
      path: `${identifier}/screening/report/:id`,
      exact: true,
      component: (props) => <ScreeningReport {...props} />,
    },
    {
      path: `${identifier}/screening/report/sample`,
      exact: true,
      component: (props) => <ScreeningReportSample {...props} />,
    },
    {
      path: `${identifier}/findit`,
      exact: true,
      component: (props) => <FindIt {...props} />,
    },
    {
      path: `${identifier}/fixit`,
      exact: true,
      component: (props) => <FixIt {...props} />,
    },
    {
      path: `${identifier}/calendar`,
      exact: true,
      component: (props) => <Calendar {...props} />,
    },
    {
      path: `${identifier}/myservices`,
      exact: true,
      component: (props) => <Services {...props} />,
    },
    {
      path: `${identifier}/mymoney`,
      exact: true,
      component: (props) => <MyMoney {...props} />,
    },
    {
      path: `${identifier}/myservices/:id`,
      exact: true,
      component: (props) => <CreateOrEditService {...props} />,
    },
    {
      path: `${identifier}/fixit/task/offers`,
      exact: true,
      component: (props) => <FixItTaskReview {...props} />,
    },
    {
      path: `${identifier}/fixit/add`,
      exact: true,
      component: (props) => <FixItTask {...props} />,
    },
    {
      path: `${identifier}/contacts`,
      exact: true,
      component: (props) => <Contacts {...props} />,
    },
    {
      path: `${identifier}/messenger`,
      exact: true,
      component: (props) => <Messenger {...props} />,
    },
    {
      path: `${identifier}/messenger/:id`,
      exact: true,
      component: (props) => <Messenger {...props} />,
    },
    {
      path: `${identifier}/messenger/:receiverRole/:receiverId`,
      exact: true,
      component: (props) => <Messenger {...props} />,
    },
    {
      path: `${identifier}/fixit/raisetask`,
      exact: true,
      component: (props) => <Redirect to={`${identifier}`} />,
    },
  ];

  return servicepropRoutes;
};

export default ServiceProRoutes;
