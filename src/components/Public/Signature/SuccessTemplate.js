import { Result, Button, message } from "antd";
import { DownloadOutlined, PrinterOutlined } from "@ant-design/icons";
import "./styles.scss";
import { useEffect, useState } from "react";
import { useLazyQuery } from "react-apollo";
import { getSignatureDataBySecret } from "config/queries/signature";
import { pdf } from "@react-pdf/renderer";
import { getAgreementId } from "config/queries/agreement";
import { getInventoryById } from "config/queries/inventory";
import InventoryPDF from "components/Private/Landlord/LandlordSideNavs/Inventory/InventoryPDF";
import { useParams } from "react-router-dom";
import AgreementPDF from "../../Private/Landlord/LandlordSideNavs/Agreement/PDF";
import showNotification from "config/Notification";

const btnStyle = {
  boxShadow: "0 1px 1px rgba(0, 0, 0, 0.075)",
  transition: "all 0.2s",
  fontSize: "14px",
  padding: "10px 40px",
  height: "40px",
  textAlign: "right",
  borderRadius: "6px",
};

const SuccessTemplate = () => {
  const params = useParams();
  const [pdfActionType, setPdfActionType] = useState("");

  const [
    getInventoryByIdQuery,
    { loading: getInventoryDataLoading, error: inventoryError },
  ] = useLazyQuery(getInventoryById, {
    onCompleted: async (data) => {
      if (data.getInventoryById) {
        const inventory = data.getInventoryById;
        const blob = await pdf(<InventoryPDF inventory={inventory} />).toBlob();
        const file = new Blob([blob], { type: "application/pdf" });
        if (pdfActionType === "download") createDownloadLink(file);
        else if (pdfActionType === "print") createPrintLink(file);
      }
    },
  });

  const [
    getAgreementByIdQuery,
    { loading: getAgreementDataLoading, error: agreementError },
  ] = useLazyQuery(getAgreementId, {
    onCompleted: async (data) => {
      if (data.getAgreementById) {
        const agreement = data.getAgreementById;
        if (agreement.documentUrl) {
          window.open(agreement.documentUrl, "_blank").focus();
        } else {
          const blob = await pdf(
            <AgreementPDF agreement={agreement} />
          ).toBlob();
          const file = new Blob([blob], { type: "application/pdf" });

          if (pdfActionType === "download") createDownloadLink(file);
          else if (pdfActionType === "print") createPrintLink(file);
        }
      }
    },
  });

  const [
    executeGetByIdQuery,
    { loading: getBaseDataLoading, error: baseDataError },
  ] = useLazyQuery(getSignatureDataBySecret, {
    onCompleted: async (data) => {
      if (data.getSignatureDataBySecret.success) {
        const _data = data.getSignatureDataBySecret.data;
        if (_data.documentType === "inventory") {
          getInventoryByIdQuery({ variables: { inventoryId: _data.id } });
        } else if (_data.documentType === "agreement") {
          getAgreementByIdQuery({ variables: { agreementId: _data.id } });
        }
      } else {
        showNotification(
          "error",
          data?.getSignatureDataBySecret?.message || "Something went wrong!"
        );
      }
    },
  });

  const createDownloadLink = (file) => {
    const anchorTag = document.createElement("a");
    anchorTag.href = window.URL.createObjectURL(file);
    anchorTag.download = `${new Date().getTime()}.pdf`;
    anchorTag.click();
    setPdfActionType("");
  };

  const createPrintLink = (file) => {
    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    iframe.style.display = "none";
    iframe.onload = function () {
      setTimeout(function () {
        iframe.focus();
        iframe.contentWindow.print();
      }, 1);
    };

    iframe.src = window.URL.createObjectURL(file);
    setPdfActionType("");
  };

  const error = inventoryError || agreementError || baseDataError;

  useEffect(() => {
    error &&
      error.graphQLErrors &&
      error.graphQLErrors.map((error) => message.error(error.message));
  }, [error]);

  const [secret, setSecret] = useState("");

  useEffect(() => {
    setSecret(params.secret);
  }, [params]);

  const handleViewReport = ({ actionType }) => {
    if (actionType === "download") setPdfActionType("download");
    else if (actionType === "print") setPdfActionType("print");
    executeGetByIdQuery({ variables: { secret } });
  };

  const loading =
    getAgreementDataLoading || getBaseDataLoading || getInventoryDataLoading;

  return (
    <Result
      style={{
        position: "relative",
        top: "50%",
        transform: "translateY(50%)",
      }}
      status="success"
      title="Thanks for submitting your Document!"
      subTitle="You'll receive a copy in your inbox shortly"
      extra={[
        <Button
          type="primary"
          key="download"
          style={btnStyle}
          loading={loading && pdfActionType === "download"}
          onClick={() => handleViewReport({ actionType: "download" })}
        >
          <DownloadOutlined style={{ verticalAlign: "middle" }} />
          Download
        </Button>,
        <Button
          key="print"
          style={btnStyle}
          loading={loading && pdfActionType === "print"}
          onClick={() => handleViewReport({ actionType: "print" })}
        >
          <PrinterOutlined style={{ verticalAlign: "middle" }} />
          Print
        </Button>,
      ]}
    />
  );
};

export default SuccessTemplate;
