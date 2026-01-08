import React from "react";
import { withRouter } from "react-router-dom";
import UserRoleQuery from "../../../config/queries/userRole";
import { message } from "antd";
import { useParams } from "react-router-dom";
import { withApollo } from "react-apollo";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { Result  } from "antd";

import "./styles.scss";

const Register = (props) => {
  let { token } = useParams();

  const { loading, data } = useQuery(UserRoleQuery.validateInvite, {
    variables: { token },
  });
  const [acceptInvitation] = useLazyQuery(UserRoleQuery.acceptInvitation, {
    onCompleted: ({ acceptInvitation }) => {
      message.success("Invitation Accepted! Please log in to continue");
      props.history.push("/login");
    },
  });
  const handleAcceptInvitation = () => {
    if (!data.validateInvite.isNewUser) {
      acceptInvitation({ variables: { token } });
    } else {
      props.history.push({
        pathname: "/register",
        state: {
          token,
          email: data.validateInvite.email,
        },
      });
    }
  };
  if (loading) {
    return (
      <>
        {/* <div className="spinner-box">
          <div className="configure-border-1">
            <div className="configure-core"></div>
          </div>
          <div className="configure-border-2">
            <div className="configure-core"></div>
          </div>
        </div> */}

        <div className="sk-cube-grid">
          <div className="sk-cube sk-cube1"></div>
          <div className="sk-cube sk-cube2"></div>
          <div className="sk-cube sk-cube3"></div>
          <div className="sk-cube sk-cube4"></div>
          <div className="sk-cube sk-cube5"></div>
          <div className="sk-cube sk-cube6"></div>
          <div className="sk-cube sk-cube7"></div>
          <div className="sk-cube sk-cube8"></div>
          <div className="sk-cube sk-cube9"></div>
        </div>
      </>
    );
  }
  if (!data.validateInvite) {
    return (
      <Result
        className="empty"
        status="404"
        title="Invalid Token"
        subTitle=""
      />
    );
  }
  return (
    <div className="accept-invitation-support">
      <p style={{display: "flex", justifyContent: "center", marginTop: "30px"}}>
        Hi,
        <br />
        {data.validateInvite.by.firstName} {data.validateInvite.by.lastName}{" "}
        invited you for access {data.validateInvite.role} as{" "}
        {data.validateInvite.name}
      </p>

      <br />
      <button
        className="btn__accept--invitation"
        style={{ margin: "auto" }}
        onClick={handleAcceptInvitation}
      >
        {data.validateInvite.isNewUser ? "signup" : "activate"}{" "}
      </button>
    </div>
  );
};

export default withApollo(withRouter(Register));
