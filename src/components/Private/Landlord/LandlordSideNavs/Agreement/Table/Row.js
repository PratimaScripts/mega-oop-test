import {
  CloudUploadOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  InboxOutlined,
  MoreOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import {
  deleteAgreement,
  duplicateAgreement,
  getAgreementId,
  sendAgreementForSigning,
} from "config/queries/agreement";
import moment from "moment";
import React, { useEffect } from "react";
import { useLazyQuery, useMutation } from "react-apollo";
import { useHistory } from "react-router-dom";
import { PDFViewer } from "@react-pdf/renderer";
import AgreementPDF from "../PDF";
import showNotification from "config/Notification";

const Row = ({ item, showPdf, refreshAgreements, ...props }) => {
  const history = useHistory();

  const [executeDuplicateMutation, { error: duplicateMutationError }] =
    useMutation(duplicateAgreement, {
      onCompleted: (data) => {
        if (data) {
          showNotification("success", data.duplicateAgreement);
          refreshAgreements();
        }
      },
    });

  const [
    executeSendForSigningMutation,
    { error: sendForSigningMutationError },
  ] = useMutation(sendAgreementForSigning, {
    onCompleted: (data) => {
      if (data) {
        showNotification("success", data.sendAgreementForSigning);
        refreshAgreements();
      }
    },
  });

  const [getByIdQuery] = useLazyQuery(getAgreementId, {
    onCompleted: async (data) => {
      if (data) {
        const agreement = data.getAgreementById;
        if (agreement.agreementType === "upload") {
          if (showPdf && agreement.documentUrl)
            showPdf("upload", agreement.documentUrl);
          // window.open(agreement.documentUrl, "_blank").focus();
        } else {
          if (showPdf)
            showPdf(
              "template",
              <PDFViewer style={{ width: "100%", height: "100%" }}>
                <AgreementPDF agreement={agreement} />
              </PDFViewer>
            );
          // window.open(window.URL.createObjectURL(file), "_blank");
        }
      }
    },
  });

  const [executeDeleteMutation] = useMutation(deleteAgreement, {
    onCompleted: (data) => {
      if (data) {
        showNotification("success", "Agreement deleted successfully!");
        refreshAgreements();
      }
    },
  });

  const generatePdfDocument = () => {
    showNotification("info", "Getting pdf data!");
    getByIdQuery({ variables: { agreementId: item._id } });
  };

  const error = duplicateMutationError || sendForSigningMutationError;

  useEffect(() => {
    error &&
      error.graphQLErrors &&
      error.graphQLErrors.map((error) =>
        showNotification("error", error.message)
      );
  }, [error]);

  const menu = (
    <Menu>
      <Menu.Item
        onClick={() =>
          history.push("/landlord/agreement/edit", { id: item._id })
        }
        disabled={item.hasSigningStarted}
        icon={<EditOutlined />}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          executeDeleteMutation({ variables: { agreementId: item._id } })
        }
        icon={<DeleteOutlined />}
      >
        Delete
      </Menu.Item>
      <Menu.Item onClick={generatePdfDocument} icon={<EyeOutlined />}>
        View Details
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          executeDuplicateMutation({ variables: { agreementId: item._id } })
        }
        icon={<CopyOutlined />}
      >
        Duplicate
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          executeSendForSigningMutation({
            variables: { agreementId: item._id },
          })
        }
        icon={<SendOutlined />}
      >
        Send for singing
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          props.archive({
            variables: { agreementId: item._id, archived: !item.archived },
          })
        }
        icon={item.archived ? <CloudUploadOutlined /> : <InboxOutlined />}
      >
        {item.archived ? "Unarchive" : "Archive"}
      </Menu.Item>
    </Menu>
  );

  return (
    <tr>
      <td className={`border__${item.status}`}>
        <span onClick={generatePdfDocument} className={"agreement-title"}>
          {item.agreementTitle}
        </span>
      </td>
      <td>{item.agreementType}</td>
      <td>{`${item.propertyId.address.addressLine1}, ${item.propertyId.address.addressLine2} - ${item.propertyId.address.zip}`}</td>
      <td>{moment(item.duration.end).format("DD/MM/YYYY")}</td>
      <td>
        <span className={`status - pill pill - color__${item.status}`}>
          {item.status}
        </span>
      </td>
      <td>
        <span>
          {item.agreementType === "upload"
            ? "2"
            : item.signatures.filter((item) => item.signedOn).length}
          /{item.agreementType === "upload" ? "2" : item.signatures.length}
        </span>
      </td>
      <td>
        <Dropdown trigger={"click"} overlay={menu} placement="bottomLeft" arrow>
          <MoreOutlined />
        </Dropdown>
      </td>
    </tr>
  );
};

export default Row;
