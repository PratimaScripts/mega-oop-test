import { CheckCircleTwoTone, EyeOutlined } from "@ant-design/icons";
import { Button, Modal, Row, Table, Tooltip } from "antd";
import showNotification from "config/Notification";
import {
  getMandateById,
  getMandates,
  setupDirectDebitMandate,
  completeTheRedirectFlow,
} from "config/queries/gocardless";
import React, { useMemo, useState, useContext, useEffect } from "react";
import { useLazyQuery, useMutation, useQuery } from "react-apollo";
import { useHistory, useLocation } from "react-router-dom";
import { UserDataContext } from "store/contexts/UserContext";
import ViewMandate from "./ViewMandate";

const MandateConfirmation = () => (
  <Row justify="center">
    <CheckCircleTwoTone style={{ fontSize: "56px", paddingBottom: "24px" }} />
    <h2>You have setup a direct debit.</h2>
    <p style={{ textAlign: "center" }}>
      Landlord can now automatically collect payments from your account when
      they send you an invoice.
    </p>
  </Row>
);

const ManageMandates = () => {
  const history = useHistory();
  const location = useLocation();
  const isLandlordRoute = history.location.pathname.includes("/landlord");

  const [mandates, setMandates] = useState([]);

  const initialMandateDetails = useMemo(
    () => ({
      mandate: {},
      payments: [],
      subscriptions: [],
    }),
    []
  );

  const [mandateDetails, setMandateDetails] = useState(initialMandateDetails);

  const { state: userState, dispatch: userDispatch } =
    useContext(UserDataContext);

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const [showModal, setShowModal] = useState(
    params.has("redirect_flow_id") ? "MANDATE_CONFIRMATION" : ""
  );

  const [sendMandateConfirmation] = useMutation(completeTheRedirectFlow, {
    onCompleted: (data) => {
      if (data?.completeTheRedirectFlow?.success) {
        params.delete("redirect_flow_id");
        history.replace({ search: params.toString() });
        showNotification("success", "Mandate has been created!");
        if (data.completeTheRedirectFlow?.data) {
          setMandates(data.completeTheRedirectFlow.data);
        }
      } else {
        showNotification(
          "error",
          data?.completeTheRedirectFlow?.message ||
            "Failed to setup the mandate. Please try again."
        );
      }
    },
  });

  useEffect(() => {
    if (params.has("redirect_flow_id")) {
      if (!userState.calledAPI) {
        sendMandateConfirmation({
          variables: { redirectId: params.get("redirect_flow_id") },
        });
        userDispatch({ type: "CALLED_API", payload: true });
      }
      params.delete("redirect_flow_id");
      history.replace({ search: params.toString() });
    }
  }, [
    params,
    history,
    userDispatch,
    userState.calledAPI,
    sendMandateConfirmation,
  ]);

  const [fetchMandateById, { loading: getMandateByIdLoading }] = useLazyQuery(
    getMandateById,
    {
      onCompleted: (data) => {
        if (data?.getMandateById?.success) {
          setMandateDetails({ ...data.getMandateById.data });
        } else {
          showNotification("error", data.getMandateById.message);
        }
      },
    }
  );

  const [setupMandate, { loading: setupDirectDebitMandateLoading }] =
    useLazyQuery(setupDirectDebitMandate, {
      onCompleted: (data) => {
        if (data.setupDirectDebitMandate.success) {
          window.open(data.setupDirectDebitMandate.data.redirect_url, "_blank");
        }
      },
    });

  const columns = useMemo(
    () => [
      {
        title: "Id",
        dataIndex: "mandateId",
      },
      {
        title: isLandlordRoute ? "Renter" : "Landlord",
        dataIndex: isLandlordRoute ? "renterName" : "landlordName",
      },
      {
        title: "Property",
        dataIndex: "propertyTitle",
      },
      {
        title: "Status",
        dataIndex: "created",
        render: (created, row) =>
          created ? (
            <Tooltip title={row.description}>
              <span style={{ textTransform: "capitalize" }}>{row.status}</span>
            </Tooltip>
          ) : isLandlordRoute ? (
            <Tooltip title="Pending from renter's side">
              <span style={{ textTransform: "capitalize" }}>pending</span>
            </Tooltip>
          ) : (
            <Button
              type="primary"
              disabled={setupDirectDebitMandateLoading || isLandlordRoute}
              onClick={() =>
                setupMandate({
                  variables: {
                    mandateId: row._id,
                    propertyName:
                      row.propertyId?.privateTitle ||
                      row.propertyId?.title ||
                      "",
                  },
                })
              }
            >
              {isLandlordRoute ? "Pending" : "Activate"}
            </Button>
          ),
      },

      {
        title: "",
        dataIndex: "_id",
        render: (id, row) => (
          <Button
            disabled={getMandateByIdLoading}
            onClick={() => {
              if (!row.created)
                return showNotification(
                  "error",
                  "Please setup the mandate first."
                );
              setShowModal("VIEW_MANDATE");
              fetchMandateById({ variables: { mandateId: id } });
            }}
            icon={<EyeOutlined />}
          ></Button>
        ),
      },
    ],
    [
      fetchMandateById,
      setupMandate,
      getMandateByIdLoading,
      setupDirectDebitMandateLoading,
      isLandlordRoute,
      setShowModal,
    ]
  );

  const { loading } = useQuery(getMandates, {
    onCompleted: (data) => {
      if (data?.getMandates?.success) {
        let mandates = data?.getMandates?.data?.map((item) => ({
          ...item,
          propertyTitle:
            item.propertyId?.privateTitle || item.propertyId?.title || "",

          ...(isLandlordRoute
            ? {
                renterName:
                  `${item?.renterId?.firstName + " " || ""}` +
                  `${item?.renterId?.lastName || ""}`,
              }
            : {
                landlordName:
                  `${item?.landlordId?.firstName + " " || ""}` +
                  `${item?.landlordId?.lastName || ""}`,
              }),
        }));
        setMandates(mandates);
      }
    },
  });

  return (
    <>
      <Table columns={columns} dataSource={mandates} loading={loading} />
      <Modal
        visible={Boolean(showModal)}
        closable={true}
        title={
          showModal === "MANDATE_CONFIRMATION"
            ? false
            : `Mandate ${mandateDetails.mandate.mandateId || ""}`
        }
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              setShowModal("");
              setMandateDetails(initialMandateDetails);
            }}
          >
            Ok
          </Button>,
        ]}
        onCancel={() => {
          setShowModal("");
          setMandateDetails(initialMandateDetails);
        }}
        width={1200}
      >
        {showModal === "MANDATE_CONFIRMATION" ? (
          <MandateConfirmation />
        ) : showModal === "VIEW_MANDATE" ? (
          <ViewMandate
            loading={getMandateByIdLoading}
            mandateDetails={mandateDetails}
            isLandlordRoute={isLandlordRoute}
          />
        ) : null}
      </Modal>
    </>
  );
};

export default ManageMandates;
