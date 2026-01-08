import React, { lazy } from "react";
import { Redirect } from "react-router-dom";

import { TransactionProvider } from "store/contexts/transactionContexts";
import { InvoiceProvider } from "store/contexts/invoiceContexts";
import { DepositProvider } from "components/Private/Landlord/LandlordSideNavs/Accounting/RentalDeposit/rentalDepositContexts";
import RecurringInvoice from "components/Private/Common/RecurringInvoice";

const ManageMandates = lazy(() =>
  import("components/Private/Renter/RenterSideNavs/ManageMandates")
);

const ServiceOrder = lazy(() =>
  import("components/Private/ServicePro/ServiceProSideNavs/ServiceOrder")
);
const Dashboard = lazy(() => import("components/Private/Landlord/Dashboard"));
const FixIt = lazy(() => import("components/Common/Tasks/FixIt"));
const RaiseTaskFixIt = lazy(() =>
  import("components/Common/Tasks/FixIt/AddTask")
);
const UpdateTaskFixIt = lazy(() =>
  import("components/Common/Tasks/FixIt/UpdateTask")
);
const FixitTaskReview = lazy(() =>
  import("components/Common/Tasks/TaskReview")
);
const AddListing = lazy(() => import("components/Common/AddProperty"));
const AddProperty = lazy(() => import("components/Common/PropertyDemo"));
const PropertyReview = lazy(() =>
  import("components/Private/Landlord/LandlordSideNavs/Properties/Review")
);
const ScreeningOrder = lazy(() =>
  import("components/Private/Landlord/LandlordSideNavs/Screening/ScreeningList")
);
// const SettingsTab = lazy(() => import("components/Common/SettingsTabs"));
const Screening = lazy(() =>
  import("components/Private/Landlord/LandlordSideNavs/Screening")
);
const InviteScreeningUser = lazy(() =>
  import("components/Private/Landlord/LandlordSideNavs/InviteScreeningUser")
);
const ScreeningReview = lazy(() =>
  import("components/Common/ScreeningReviewForms/Landlord")
);
// import { ChartOfAccountProvider } from 'store/contexts/chartOfAccountContexts';
const PropertyDashboard = lazy(() =>
  import("components/Private/Landlord/LandlordSideNavs/Properties")
);

// import Listing from "./LandlordSideNavs/Listing";
const ListingDashboard = lazy(() =>
  import("components/Private/Landlord/LandlordSideNavs/Listing")
);
const Messenger = lazy(() => import("components/Common/Chats"));

// import AccountingRental from "./LandlordSideNavs/Accounting/Rental";
const RentalDeposit = lazy(() =>
  import(
    "components/Private/Landlord/LandlordSideNavs/Accounting/RentalDeposit"
  )
);
const RentalInvoice = lazy(() =>
  import(
    "components/Private/Landlord/LandlordSideNavs/Accounting/RentalInvoice"
  )
);

// import AccountingTransactions from "./LandlordSideNavs/Accounting/Transactions";
const AccountingTransactions = lazy(() =>
  import("components/Private/Landlord/LandlordSideNavs/Accounting/Transactions")
);

const Reports = lazy(() =>
  import("components/Private/Landlord/LandlordSideNavs/Reports")
);

const ScreeningReportSample = lazy(() =>
  import("components/Common/ScreeningReports/Sample/landlord")
);

const ScreeningReportSampleRenter = lazy(() =>
  import("components/Common/ScreeningReports/Sample/renter")
);

const ScreeningReport = lazy(() =>
  import("components/Common/ScreeningReports/Main/landlord")
);

// import Reminder from "Common/reminder";
const Reminder = lazy(() => import("components/Common/reminder"));

const Calendar = lazy(() => import("components/Common/Calendar"));

const Documents = lazy(() => import("components/Common/Documents"));

const AddNewDocument = lazy(() => import("components/Common/Documents/AddNew"));
const Portfolio = lazy(() =>
  import("components/Private/Landlord/LandlordSideNavs/Portfolio")
);
const Inventory = lazy(() =>
  import("components/Private/Landlord/LandlordSideNavs/Inventory")
);
const Agreement = lazy(() =>
  import("components/Private/Landlord/LandlordSideNavs/Agreement")
);
const CreateOrEditAgreement = lazy(() =>
  import("components/Private/Landlord/LandlordSideNavs/Agreement/CreateOrEdit")
);
const CreateOrEdit = lazy(() =>
  import("components/Private/Landlord/LandlordSideNavs/Inventory/CreateOrEdit")
);

const Contacts = lazy(() => import("components/Common/Contacts"));

const Applications = lazy(() =>
  import("components/Private/Landlord/LandlordSideNavs/Application")
);
const BookViewingDetail = lazy(() =>
  import("components/Common/Calendar/BookViewingDetail")
);

const LandlordRoutes = () => {
  // const { sidebarCollapsed, userData, isImpersonate } = props
  const identifier = "/landlord";

  const landlordRoutes = [
    {
      path: "/",
      exact: true,
      component: () => <Redirect to={`${identifier}`} />,
    },
    {
      path: `${identifier}`,
      exact: true,
      component: (props) => <Dashboard {...props} />,
    },
    {
      path: `${identifier}/dashboard`,
      exact: true,
      component: () => <Redirect to={`${identifier}`} />,
    },
    {
      path: `${identifier}/portfolio/:searchstring`,
      exact: true,
      component: (props) => <Portfolio {...props} />,
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
      path: `${identifier}/screening`,
      exact: true,
      component: (props) => <Screening {...props} />,
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
      path: `${identifier}/screening/review`,
      exact: true,
      component: (props) => <ScreeningReview {...props} />,
    },
    {
      path: `${identifier}/property`,
      exact: true,
      component: (props) => <PropertyDashboard {...props} />,
    },
    {
      path: `${identifier}/property/review`,
      exact: true,
      component: (props) => <PropertyReview {...props} />,
    },
    {
      path: `${identifier}/property/add`,
      exact: true,
      component: (props) => <AddProperty {...props} />,
    },
    {
      path: `${identifier}/property/edit`,
      exact: true,
      component: (props) => <AddProperty {...props} />,
    },
    {
      path: `${identifier}/property/listing`,
      exact: true,
      component: (props) => <AddListing {...props} />,
    },
    {
      path: `${identifier}/listings`,
      exact: true,
      component: (props) => <ListingDashboard {...props} />,
    },
    {
      path: `${identifier}/listings/add`,
      exact: true,
      component: (props) => <AddListing {...props} />,
    },
    {
      path: `${identifier}/applications`,
      exact: true,
      component: (props) => <Applications {...props} />,
    },
    {
      path: `${identifier}/contacts`,
      exact: true,
      component: (props) => <Contacts {...props} />,
    },
    {
      path: `${identifier}/property/listing/edit`,
      exact: true,
      component: (props) => <AddListing {...props} />,
    },
    {
      path: `${identifier}/listing/preview`,
      exact: true,
      component: (props) => <AddListing {...props} />,
    },
    {
      path: `${identifier}/screening/report/sample`,
      exact: true,
      component: (props) => <ScreeningReportSample {...props} />,
    },
    {
      path: `${identifier}/screening/report/sample/renter`,
      exact: true,
      component: (props) => <ScreeningReportSampleRenter {...props} />,
    },
    {
      path: `${identifier}/screening/report/:id`,
      exact: true,
      component: (props) => <ScreeningReport {...props} />,
    },
    {
      path: `${identifier}/inventory`,
      exact: true,
      component: (props) => <Inventory {...props} />,
    },
    {
      path: `${identifier}/inventory/add`,
      exact: true,
      component: (props) => <CreateOrEdit {...props} />,
    },
    {
      path: `${identifier}/inventory/edit`,
      exact: true,
      component: (props) => <CreateOrEdit {...props} />,
    },
    {
      path: `${identifier}/agreement`,
      exact: true,
      component: (props) => <Agreement {...props} />,
    },
    {
      path: `${identifier}/agreement/add`,
      exact: true,
      component: (props) => <CreateOrEditAgreement {...props} />,
    },
    {
      path: `${identifier}/agreement/edit`,
      exact: true,
      component: (props) => <CreateOrEditAgreement {...props} />,
    },
    {
      path: `${identifier}/accounting/rental-invoice`,
      exact: true,
      component: (props) => (
        <InvoiceProvider>
          <RentalInvoice {...props} />
        </InvoiceProvider>
      ),
    },
    {
      path: `${identifier}/accounting/rental-deposits`,
      exact: true,
      component: (props) => (
        <DepositProvider>
          <RentalDeposit {...props} />
        </DepositProvider>
      ),
    },
    {
      path: `${identifier}/accounting/rental-transaction`,
      exact: true,
      component: (props) => (
        <TransactionProvider>
          <AccountingTransactions {...props} />
        </TransactionProvider>
      ),
    },
    {
      path: `${identifier}/reminder`,
      exact: true,
      component: (props) => <Reminder {...props} />,
    },
    {
      path: `${identifier}/fixit`,
      exact: true,
      component: (props) => <FixIt {...props} />,
    },
    {
      path: `${identifier}/fixit/raisetask`,
      exact: true,
      component: (props) => (
        <RaiseTaskFixIt
          // contextData={context}
          {...props}
        />
      ),
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
      path: `${identifier}/fixit/task/offers`,
      exact: true,
      component: (props) => <FixitTaskReview {...props} />,
    },
    {
      path: `${identifier}/calendar`,
      exact: true,
      component: (props) => <Calendar {...props} />,
    },
    {
      path: `${identifier}/documents`,
      exact: true,
      component: (props) => <Documents {...props} />,
    },
    {
      path: `${identifier}/documents/addNew`,
      exact: true,
      component: (props) => <AddNewDocument {...props} />,
    },
    {
      path: `${identifier}/service-orders`,
      exact: true,
      component: (props) => <ServiceOrder />,
    },
    {
      path: `${identifier}/reports`,
      exact: true,
      component: (props) => <Reports {...props} />,
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
  return landlordRoutes;
};

export default LandlordRoutes;
