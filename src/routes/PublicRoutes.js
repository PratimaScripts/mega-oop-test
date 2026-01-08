import React, { lazy } from "react";
// import { Switch, Route } from 'react-router-dom';
import NProgress from "nprogress";

// import PublicDesignsTemp from "components/Common/PublicComps";
import Login from "components/Public/Login";
import Register from "components/Public/Register/";

// FOR DESIGN IGNORE
import { LinkedInPopUp } from "react-linkedin-login-oauth2";
import SuccessTemplate from "components/Public/Signature/SuccessTemplate";
import SocialLoginOnboarding from "../components/Public/Onboarding/SocialLoginOnboarding";

// // import ListGridExample from "components/Public/ListGridView";
// const ListGridExample = lazy(() => import("components/Public/ListGridView"));

// // import TaskListing from "components/Common/TaskListing";
// const TaskListing = lazy(() => import("components/Common/TaskListing"));

// // import PropertyDetail from "components/Public/PropertyDetail";
// const PropertyDetail = lazy(() => import("components/Public/PropertyDetail"));

// // import Property from "components/Common/PropertyDemo";
// const Property = lazy(() => import("components/Common/PropertyDemo"));

// const Register = lazy(() => import("components/Public/Register/"));

// import OTPVerificationRegister from "components/Public/Register/EmailVerification";
const OTPVerificationRegister = lazy(() =>
  import("components/Public/Register/EmailVerification")
);

// const SiteAdmin = lazy(() => import("components/Private/MainAdmin"));

// import LandlordMain from "components/Private/Landlord";
// const LandlordMain = lazy(() => import("components/Private/Landlord"));

// const StripeClose = lazy(() => import("components/Closethis"));

// // import EmploymentReferenceForm from "components/Public/ReferenceForms/Employment";
// const EmploymentReferenceForm = lazy(() =>
//     import("components/Public/ReferenceForms/Employment")
// );

// // import TenancyReferenceForm from "components/Public/ReferenceForms/Tenancy";
// const TenancyReferenceForm = lazy(() =>
//     import("components/Public/ReferenceForms/Tenancy")
// );

// // import SelfEmploymentReferenceForm from "components/Public/ReferenceForms/SelfEmployment";
// const SelfEmploymentReferenceForm = lazy(() =>
//     import("components/Public/ReferenceForms/SelfEmployment")
// );

// // import ScreeningAcceptForm from "components/Common/ScreeningDataForm";
// const ScreeningAcceptForm = lazy(() =>
//     import("components/Common/ScreeningDataForm")
// );

// import ResetPasswordInvite from "components/Public/ResetPasswordInvite";
const ResetPasswordInvite = lazy(() =>
  import("components/Public/ResetPasswordInvite")
);

// import ResetPasswordMain from "components/Public/ResetPassword";
const ResetPasswordMain = lazy(() => import("components/Public/ResetPassword"));

// // import AcceptInvitation from "components/Public/AcceptInvitationSupport";
const AcceptInvitation = lazy(() =>
  import("components/Public/AcceptInvitationSupport")
);

// // import AcceptInvitationScreening from "components/Public/AcceptInvitationScreening";
// const AcceptInvitationScreening = lazy(() =>
//     import("components/Public/AcceptInvitationScreening")
// );

// // import LandlordReportTest from "components/Common/ScreeningReports/Sample/landlord";
// const LandlordReportTest = lazy(() =>
//     import("components/Common/ScreeningReports/Sample/landlord")
// );

// // import RenterReportTest from "components/Common/ScreeningReports/Sample/renter";
// const RenterReportTest = lazy(() =>
//     import("components/Common/ScreeningReports/Sample/renter")
// );

// // import ServiceProReportTest from "components/Common/ScreeningReports/Sample/servicepro";
// const ServiceProReportTest = lazy(() =>
//     import("components/Common/ScreeningReports/Sample/servicepro")
// );

const ActiveProfile = lazy(() =>
  import("components/Public/Register/ActiveProfile")
);
const Signature = lazy(() => import("components/Public/Signature"));

const PublicRoute = (props) => {
  const startLoading = (val) => {
    NProgress.start();
  };

  const endLoading = (val) => {
    NProgress.done();
  };

  const publicRoutes = [
    {
      path: "/",
      exact: true,
      component: (props) => (
        <Login
          //  checkUser={checkUser}
          startLoading={startLoading}
          endLoading={endLoading}
          {...props}
        />
      ),
    },
    {
      path: "/linkedin",
      exact: true,
      component: (props) => <LinkedInPopUp {...props} />,
    },
    {
      path: "/register",
      exact: true,
      component: (props) => (
        <Register
          startLoading={startLoading}
          endLoading={endLoading}
          {...props}
        />
      ),
    },
    {
      path: "/onboarding",
      exact: true,
      component: (props) => (
        <ActiveProfile
          startLoading={startLoading}
          endLoading={endLoading}
          {...props}
        />
      ),
    },
    {
      path: "/login",
      exact: true,
      component: (props) => (
        <Login
          //  checkUser={checkUser}
          startLoading={startLoading}
          endLoading={endLoading}
          {...props}
        />
      ),
    },
    {
      path: "/forgotpassword",
      exact: true,
      component: (props) => <ResetPasswordInvite {...props} />,
    },
    {
      path: "/confirm/:email/:token/:otp",
      exact: true,
      component: (props) => <OTPVerificationRegister {...props} />,
    },
    {
      path: "/confirm/:email",
      exact: true,
      component: (props) => <OTPVerificationRegister {...props} />,
    },
    {
      path: "/reset-password/:token",
      exact: true,
      component: (props) => <ResetPasswordMain {...props} />,
    },
    {
      path: "/self-signature/:secret",
      exact: true,
      component: (props) => <Signature {...props} />,
    },
    {
      path: "/self-signature/:secret/success",
      exact: true,
      component: (props) => <SuccessTemplate {...props} />,
    },
    {
      path: "/social/onboarding",
      exact: true,
      component: (props) => <SocialLoginOnboarding {...props} />,
    },
    {
      path: "/accept-invitation/:token",
      exact: true,
      component: (props) => (
        <AcceptInvitation
          startLoading={startLoading}
          endLoading={endLoading}
          {...props}
        />
      ),
    },
  ];
  return publicRoutes;
  // return (
  //     <Switch>
  //         <Route exact path="/">
  //             <Login
  //                 //  checkUser={checkUser}
  //                 startLoading={startLoading}
  //                 endLoading={endLoading}
  //                 {...props}
  //             />
  //         </Route>

  //         <Route exact path="/register">
  //             <Register
  //                 startLoading={startLoading}
  //                 endLoading={endLoading}
  //                 {...props}
  //             />
  //         </Route>
  //         <Route exact path="/onboarding">
  //             <ActiveProfile
  //                 startLoading={startLoading}
  //                 endLoading={endLoading}
  //                 {...props} />
  //         </Route>
  //         <Route exact path="/login">
  //             <Login
  //                 //  checkUser={checkUser}
  //                 startLoading={startLoading}
  //                 endLoading={endLoading}
  //                 {...props}
  //             />
  //         </Route>

  //         <Route exact path="/confirm/:email/:token/:otp">
  //             <OTPVerificationRegister
  //                 //  checkUser={checkUser}
  //                 startLoading={startLoading}
  //                 endLoading={endLoading}
  //                 {...props}
  //             />
  //         </Route>

  //         <Route exact path="/landlordreport">
  //             <LandlordReportTest
  //                 //  checkUser={checkUser}
  //                 startLoading={startLoading}
  //                 endLoading={endLoading}
  //                 {...props}
  //             />
  //         </Route>

  //         <Route exact path="/renterreport">
  //             <RenterReportTest
  //                 //  checkUser={checkUser}
  //                 startLoading={startLoading}
  //                 endLoading={endLoading}
  //                 {...props}
  //             />
  //         </Route>
  //         <Route exact path="/serviceproreport">
  //             <ServiceProReportTest
  //                 //  checkUser={checkUser}
  //                 startLoading={startLoading}
  //                 endLoading={endLoading}
  //                 {...props}
  //             />
  //         </Route>

  //         <Route exact path="/property">
  //             <Property
  //                 //  checkUser={checkUser}
  //                 startLoading={startLoading}
  //                 endLoading={endLoading}
  //                 {...props}
  //             />
  //         </Route>

  //         <Route exact path="/publicsite">
  //             <PublicDesignsTemp
  //                 //  checkUser={checkUser}
  //                 startLoading={startLoading}
  //                 endLoading={endLoading}
  //                 {...props}
  //             />
  //         </Route>

  //         <Route exact path="/taskList">
  //             <TaskListing
  //                 //  checkUser={checkUser}
  //                 startLoading={startLoading}
  //                 endLoading={endLoading}
  //                 {...props}
  //             />
  //         </Route>

  //         <Route exact path="/propertydetails">
  //             <PropertyDetail
  //                 //  checkUser={checkUser}
  //                 startLoading={startLoading}
  //                 endLoading={endLoading}
  //                 {...props}
  //             />
  //         </Route>

  // <Route exact path="/forgotpassword">
  // <ResetPasswordInvite
  //     startLoading={startLoading}
  //     endLoading={endLoading}
  //     {...props}
  // />
  // </Route>

  //         <Route exact path="/listgrid">
  //             <ListGridExample
  //                 startLoading={startLoading}
  //                 endLoading={endLoading}
  //                 {...props}
  //             />
  //         </Route>

  //         <Route exact path="/reset-password/:token">
  // <ResetPasswordMain
  //     startLoading={startLoading}
  //     endLoading={endLoading}
  //     {...props}
  // />
  //         </Route>

  //         <Route exact path="/accept-invitation/:token">
  //             <AcceptInvitation
  //                 startLoading={startLoading}
  //                 endLoading={endLoading}
  //                 {...props}
  //             />
  //         </Route>

  //         <Route exact path="/invitation/:token">
  //             <ScreeningAcceptForm
  //                 startLoading={startLoading}
  //                 endLoading={endLoading}
  //                 {...props}
  //             />
  //         </Route>

  //         <Route
  //             exact
  //             // path="/auth/accept-invitation-screening/:status/:token"
  //             path="/auth/accept-invitation-screening/accept/:token"
  //         >
  //             <AcceptInvitationScreening
  //                 startLoading={startLoading}
  //                 endLoading={endLoading}
  //                 {...props}
  //             />
  //         </Route>

  //         {/* <Route exact path="/auth/accept-invitation-screening/accept/:token">
  //                   <AcceptInvitationScreening
  //                     startLoading={startLoading}
  //                     endLoading={endLoading}
  //                     {...props}
  //                   />
  //                 </Route> */}

  //         <Route path="/linkedin">
  //             <LinkedInPopUp {...props} />
  //         </Route>
  //         <Route path="/stripe">
  //             <StripeClose {...props} />
  //         </Route>

  //         <Route exact path="/reference-employment/:token">
  //             <EmploymentReferenceForm
  //                 startLoading={startLoading}
  //                 endLoading={endLoading}
  //                 {...props}
  //             />
  //         </Route>

  //         <Route exact path="/reference-tenancy/:token">
  //             <TenancyReferenceForm
  //                 startLoading={startLoading}
  //                 endLoading={endLoading}
  //                 {...props}
  //             />
  //         </Route>

  //         <Route exact path="/selfEmploymentForm/:token">
  //             <SelfEmploymentReferenceForm
  //                 startLoading={startLoading}
  //                 endLoading={endLoading}
  //                 {...props}
  //             />
  //         </Route>

  //     </Switch>
  // );
};

export default PublicRoute;
