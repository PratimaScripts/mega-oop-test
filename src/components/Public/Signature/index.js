import React, { useEffect, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { Row, Col, Spin, Button, Modal, message } from "antd";
import "./styles.scss";
import "react-tabs/style/react-tabs.css";
import Type from "./Type";
import Draw from "./Draw";
import Upload from "./Upload";
import { useParams } from "react-router-dom";
import getLocationData from "./getLocationData";
import { useLazyQuery, useMutation } from "react-apollo";
import {
  getSignatureDataBySecret,
  signDocument,
} from "config/queries/signature";
import { pdf } from "@react-pdf/renderer";
import AgreementPDF from "../../Private/Landlord/LandlordSideNavs/Agreement/PDF";
import AgreementPDFView from "../../Private/Landlord/LandlordSideNavs/Agreement/PDF/AgreementPDFView";
import { getInventoryById } from "config/queries/inventory";
import InventoryPDF from "components/Private/Landlord/LandlordSideNavs/Inventory/InventoryPDF";
import { getAgreementId } from "config/queries/agreement";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import NProgress from "nprogress";
import { LoadingOutlined } from "@ant-design/icons";
import BasicHeader from "components/layout/headers/BasicHeader";
import showNotification from "config/Notification";

const StyledModal = styled(Modal)`
  height: 100vh;
  top: 0;
`;

const Signature = () => {
  const params = useParams();
  const history = useHistory();
  const [agreementData, setAgreementData] = useState();
  const [inventoryData, setInventoryData] = useState("");

  // const [url, setUrl] = useState(null);
  const [pdfDownloading, setPdfDownloading] = useState(false);

  const [
    getInventoryByIdQuery,
    { loading: getInventoryDataLoading, error: inventoryError },
  ] = useLazyQuery(getInventoryById, {
    onCompleted: async (data) => {
      if (data.getInventoryById) {
        const inventory = data.getInventoryById;
        const blob = await pdf(<InventoryPDF inventory={inventory} />).toBlob();
        const file = new Blob([blob], { type: "application/pdf" });
        setInventoryData(window.URL.createObjectURL(file));

        window.open(window.URL.createObjectURL(file), "_blank");
      }
    },
  });

  // const [data, {loading: queryLoading }] = useQuery(getAgreementId)

  const [
    getAgreementByIdQuery,
    { loading: getAgreementDataLoading, error: agreementError },
  ] = useLazyQuery(getAgreementId, {
    onCompleted: async (data) => {
      if (data.getAgreementById) {
        const agreement = data.getAgreementById;
        setAgreementData(agreement);
      }
    },
  });
  const [isSigned, setIsSigned] = useState(false);
  const [
    executeGetByIdQuery,
    { loading: getBaseDataLoading, error: baseDataError },
  ] = useLazyQuery(getSignatureDataBySecret, {
    onCompleted: async (data) => {
      if (data.getSignatureDataBySecret.success) {
        const _data = data.getSignatureDataBySecret.data;
        setIsSigned(_data.isSigned);
        if (_data.isSigned)
          showNotification("success", "Already signed document");

        if (_data.documentType === "inventory") {
          getInventoryByIdQuery({ variables: { inventoryId: _data.id } });
        } else if (_data.documentType === "agreement") {
          getAgreementByIdQuery({ variables: { agreementId: _data.id } });
        }
      } else {
        showNotification(
          "error",
          data.getSignatureDataBySecret?.message ||
            "Something went wrong! Please try again"
        );
      }
    },
  });

  const [executeMutation, { loading: mutationLoading, error: mutationError }] =
    useMutation(signDocument, {
      onCompleted: (data) => {
        if (data) {
          message.success(data.signDocument);
          history.push(`/self-signature/${secret}/success`);
        }
      },
    });

  const error =
    inventoryError || agreementError || baseDataError || mutationError;

  useEffect(() => {
    error &&
      error.graphQLErrors &&
      error.graphQLErrors.map((error) => message.error(error.message));
  }, [error]);

  const [selectedTab, setSelectedTab] = useState(0);
  const [secret, setSecret] = useState("");
  const [signatureType, setSignatureType] = useState("typed");
  const [openSignModel, setOpenSignModel] = useState(false);

  const [signatureData, setSignatureData] = useState({
    imageUrl: "",
    fontStyle: "'Sacramento', cursive",
    name: "",
  });

  useEffect(() => {
    setSecret(params.secret);
    handleViewAgreementReport();
    //eslint-disable-next-line
  }, [params]);

  const handleOnTabChange = (tabIndex) => {
    setSelectedTab(tabIndex);
    switch (tabIndex) {
      case 0:
        setSignatureType("typed");
        break;
      case 1:
        setSignatureType("draw");
        break;
      case 2:
        setSignatureType("upload");
        break;
      default:
        break;
    }
  };

  const downloadDocument = async () => {
    try {
      if (inventoryData) {
        window.open(inventoryData, "_blank");
      } else if (agreementData?.documentUrl) {
        window.open(agreementData.documentUrl, "_blank").focus();
      } else {
        const blob = await pdf(
          <AgreementPDF agreement={agreementData} />
        ).toBlob();
        const file = new Blob([blob], { type: "application/pdf" });
        // console.log(file);
        window.open(window.URL.createObjectURL(file), "_blank");
      }
      setPdfDownloading(false);
      NProgress.done();
    } catch (error) {
      NProgress.done();
      setPdfDownloading(true);
      console.log(error);
    }
  };

  const handleViewAgreementReport = () => {
    executeGetByIdQuery({ variables: { secret: params.secret } });
  };

  const handleSubmit = async () => {
    const { location, hasLocation } = await getLocationData();
    if (!hasLocation) {
      return message.error("Unknown error, please try again later!");
    }
    const variables = {
      signDocumentId: secret,
      signatureType,
      ...signatureData,
      location,
    };
    // console.log(variables)
    executeMutation({ variables });
  };

  const handleSignatureDataChange = (key, value) => {
    setSignatureData({
      ...signatureData,
      [key]: value,
    });
  };

  const loading =
    mutationLoading ||
    getBaseDataLoading ||
    getInventoryDataLoading ||
    getAgreementDataLoading;

  // console.log(url);
  // console.log("Agreement data", agreementData)

  return (
    <div>
      <BasicHeader />
      <Row gutter={[16, 16]} className="signature-wrapper">
        <Col span={24} className="buttons">
          <h4 style={{ textAlign: "center" }}>Agreement Document</h4>
          <Button
            className="btn__viewdocument m-3"
            disbale={
              !agreementData || getAgreementDataLoading || pdfDownloading
            }
            onClick={() => {
              NProgress.start();
              setPdfDownloading(true);
              downloadDocument();
            }}
          >
            {pdfDownloading ? <LoadingOutlined /> : "Download document"}
          </Button>
          <Button
            className="btn__sign__document m-3"
            onClick={() => setOpenSignModel(true)}
            disabled={isSigned}
          >
            Sign the document now
          </Button>
        </Col>
      </Row>

      {/* {url && !loading && ( */}
      <h6 style={{ textAlign: "center" }}>Preview</h6>

      <div className="agreementView">
        {agreementData ? (
          <AgreementPDFView agreement={agreementData} />
        ) : inventoryData ? (
          <embed src={inventoryData} className="inventoryView" />
        ) : (
          <Spin
            spinning={getAgreementDataLoading}
            tip={
              <>
                <p>Please wait while we fetch the agreement data...</p>
              </>
            }
          >
            <div style={{ width: "100%", height: "100vh" }}></div>
          </Spin>
        )}
      </div>
      {/* )} */}

      <StyledModal
        title="Sign the document"
        visible={openSignModel}
        onOk={handleSubmit}
        okButtonProps={{
          disabled: !signatureData.imageUrl && !signatureData.name,
        }}
        onCancel={() => setOpenSignModel(false)}
      >
        <Spin tip="Loading..." spinning={loading}>
          <Row className="signature-container">
            <Col span={24}>
              <Tabs selectedIndex={selectedTab} onSelect={handleOnTabChange}>
                <TabList>
                  <Tab>Type it in</Tab>
                  <Tab>Draw it in</Tab>
                  <Tab>Upload</Tab>
                </TabList>

                <TabPanel>
                  <Type
                    onDataChange={handleSignatureDataChange}
                    data={signatureData}
                    type={signatureType}
                  />
                </TabPanel>
                <TabPanel>
                  <Draw
                    onDataChange={handleSignatureDataChange}
                    data={signatureData}
                    type={signatureType}
                  />
                </TabPanel>
                <TabPanel>
                  <Upload
                    onDataChange={handleSignatureDataChange}
                    data={signatureData}
                    type={signatureType}
                  />
                </TabPanel>
              </Tabs>
            </Col>
          </Row>
        </Spin>
      </StyledModal>
    </div>
  );
};

export default Signature;
