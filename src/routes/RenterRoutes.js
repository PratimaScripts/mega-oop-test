import React, { lazy } from "react";
import { Redirect } from "react-router-dom";

import { InvoiceProvider } from "store/contexts/invoiceContexts";
import { RenterDepositProvider } from "components/Private/Renter/RenterSideNavs/ManageRent/Deposit/renterDepositContexts";
import Dashboard from "components/Private/Renter/Dashboard";
import Screening from "components/Private/Renter/RenterSideNavs/Screening";
import InviteScreeningUser from "components/Private/Renter/RenterSideNavs/InviteScreeningUser";
import ScreeningReview from "components/Common/ScreeningReviewForms/Renter";
import ScreeningOrder from "components/Private/Renter/RenterSideNavs/Screening/ScreeningList";
import FixIt from "components/Common/Tasks/FixIt";
import RaiseTaskFixIt from "components/Common/Tasks/FixIt/AddTask";
import UpdateTaskFixIt from "components/Common/Tasks/FixIt/UpdateTask";
import FixitTaskReview from "components/Common/Tasks/TaskReview";
import AddProperty from "components/Common/PropertyDemo";
import ManageMandates from "components/Private/Renter/RenterSideNavs/ManageMandates";
import RecurringInvoice from "components/Private/Common/RecurringInvoice";

const Messenger = lazy(() => import("components/Common/Chats"));
const ServiceOrder = lazy(() =>
  import("components/Private/ServicePro/ServiceProSideNavs/ServiceOrder")
);
// import MyRental from "./RenterSideNavs/MyRental";
const MyRental = lazy(() =>
  import("components/Private/Renter/RenterSideNavs/MyRental")
);
const ManageRent = lazy(() =>
  import("components/Private/Renter/RenterSideNavs/ManageRent/Invoice")
);
const ManageDeposit = lazy(() =>
  import("components/Private/Renter/RenterSideNavs/ManageRent/Deposit")
);

const Calendar = lazy(() => import("components/Common/Calendar"));

// import RentalWishlist from "./RenterSideNavs/RentalWishlist";
const RentalWishlist = lazy(() =>
  import("components/Private/Renter/RenterSideNavs/RentalWishlist")
);

// import Applications from "./RenterSideNavs/Applications";
const Applications = lazy(() =>
  import("components/Private/Renter/RenterSideNavs/Applications")
);

// import ScreeningReportSample from "../../Common/ScreeningReports/Sample/renter";
const ScreeningReportSample = lazy(() =>
  import("components/Common/ScreeningReports/Sample/renter")
);

// import ScreeningReportSampleLandlord from "../../Common/ScreeningReports/Sample/landlord";
const ScreeningReportSampleLandlord = lazy(() =>
  import("components/Common/ScreeningReports/Sample/landlord")
);

// import ScreeningReport from "../../Common/ScreeningReports/Main/renter";
const ScreeningReport = lazy(() =>
  import("components/Common/ScreeningReports/Main/renter")
);
const Contacts = lazy(() => import("components/Common/Contacts"));
const BookViewingDetail = lazy(() =>
  import("components/Common/Calendar/BookViewingDetail")
);

const RenterRoutes = () => {
  // const { match } = props;
  const identifier = "/renter";

  const renterRoutes = [
    {
      path: "/",
      exact: true,
      component: (props) => <Redirect to={`${identifier}`} />,
    },
    {
      path: `${identifier}`,
      exact: true,
      component: (props) => <Redirect to={`${identifier}/dashboard`} />,
    },
    {
      path: `${identifier}/dashboard`,
      exact: true,
      component: (props) => <Dashboard {...props} />,
    },
    {
      path: `${identifier}/manage-deposit`,
      exact: true,
      component: (props) => (
        <RenterDepositProvider>
          <ManageDeposit {...props} />
        </RenterDepositProvider>
      ),
    },
    {
      path: `${identifier}/manage-rent`,
      exact: true,
      component: (props) => (
        <InvoiceProvider>
          <ManageRent {...props} />
        </InvoiceProvider>
      ),
    },
    {
      path: `${identifier}/screening`,
      exact: true,
      component: (props) => <Screening {...props} />,
    },
    {
      path: `${identifier}/application`,
      exact: true,
      component: (props) => <Applications {...props} />,
    },
    {
      path: `${identifier}/fixit/task/offers`,
      exact: true,
      component: (props) => <FixitTaskReview {...props} />,
    },
    {
      path: `${identifier}/messenger`,
      exact: true,
      component: (props) => <Messenger {...props} />,
    },
    {
      path: `${identifier}/messenger/:receiverRole/:receiverId`,
      exact: true,
      component: (props) => <Messenger {...props} />,
    },
    {
      path: `${identifier}/screening/order`,
      exact: true,
      component: (props) => <ScreeningOrder {...props} />,
    },
    {
      path: `${identifier}/screening/invite`,
      exact: true,
      component: (props) => <InviteScreeningUser {...props} />,
    },
    {
      path: `${identifier}/myrental`,
      exact: true,
      component: (props) => <MyRental {...props} />,
    },
    {
      path: `${identifier}/myrental/add`,
      exact: true,
      component: (props) => <AddProperty {...props} />,
    },
    {
      path: `${identifier}/screening/report/sample`,
      exact: true,
      component: (props) => <ScreeningReportSample {...props} />,
    },
    {
      path: `${identifier}/calendar`,
      exact: true,
      component: (props) => <Calendar {...props} />,
    },
    {
      path: `${identifier}/screening/report/sample/landlord`,
      exact: true,
      component: (props) => <ScreeningReportSampleLandlord {...props} />,
    },
    {
      path: `${identifier}/screening/report/:id`,
      exact: true,
      component: (props) => <ScreeningReport {...props} />,
    },
    {
      path: `${identifier}/screening/review`,
      exact: true,
      component: (props) => <ScreeningReview {...props} />,
    },
    {
      path: `${identifier}/fixit`,
      exact: true,
      component: (props) => <FixIt {...props} />,
    },
    {
      path: `${identifier}/fixit/raisetask`,
      exact: true,
      component: (props) => <RaiseTaskFixIt {...props} />,
    },
    {
      path: `${identifier}/fixit/update`,
      exact: true,
      component: (props) => <UpdateTaskFixIt {...props} />,
    },
    {
      path: `${identifier}/fixit/task/review`,
      exact: true,
      component: (props) => <FixitTaskReview {...props} />,
    },
    {
      path: `${identifier}/wishlist`,
      exact: true,
      component: (props) => <RentalWishlist {...props} />,
    },
    {
      path: `${identifier}/contacts`,
      exact: true,
      component: (props) => <Contacts {...props} />,
    },
    {
      path: `${identifier}/service-orders`,
      exact: true,
      component: (props) => <ServiceOrder />,
    },
    {
      path: `${identifier}/mandates`,
      exact: true,
      component: (props) => <ManageMandates {...props} />,
    },
    {
      path: `${identifier}/recurring-invoice/:recurringInvoiceId`,
      exact: true,
      component: (props) => (
        <InvoiceProvider>
          <RecurringInvoice {...props} />
        </InvoiceProvider>
      ),
    },
    {
      path: `${identifier}/book-viewing/:bookViewingId`,
      exact: true,
      component: (props) => <BookViewingDetail {...props} />,
    },
  ];

  return renterRoutes;
};

export default RenterRoutes;
