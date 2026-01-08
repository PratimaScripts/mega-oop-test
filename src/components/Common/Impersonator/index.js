import UserRoleQuery from "config/queries/userRole";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import NProgress from "nprogress";
import React, { useContext } from "react";
import { useLazyQuery } from "react-apollo";
// import cookie from "react-cookies";
import { useHistory } from "react-router-dom";
import { UserDataContext } from "store/contexts/UserContext";
import { saveTokenInCookie } from "../../../utils/cookie";
import "./styles.scss";

const ImpersonatingUserExist = (props) => {
  const history = useHistory();
  const { dispatch } = useContext(UserDataContext);

  const [impersonateQuery] = useLazyQuery(UserRoleQuery.impersonateUser, {
    onCompleted: ({ impersonateUser }) => {
      if (
        !_isEmpty(impersonateUser) &&
        _get(impersonateUser, "success", false)
      ) {
        localStorage.setItem("userId", impersonateUser.data._id);
        saveTokenInCookie(_get(impersonateUser, "token", ""));
        localStorage.removeItem("isLoggedOut");
        NProgress.done();
        dispatch({ type: "SET_USER_DATA", payload: impersonateUser });
        history.push(`/${impersonateUser.data.role}`);
      }
    },
  });

  const onImpersonateLogin = async () => {
    NProgress.start();
    impersonateQuery({ variables: { inviteId: null } });
  };

  return (
    <div className="impersonating_wrap bg-secondary text-white shadow-sm d-flex align-items-center" style={{fontSize: 12}}>
      {props.children}{" "}
      <button
        className="btn btn-sm btn-primary ml-2"
        style={{borderRadius: 0, fontSize: 12}}
        onClick={() => history.push("/workspace")}
        
      >
        Switch <i className="fas fa-toggle-on" />
      </button>
      <button
        className="btn btn-sm btn-danger"
        style={{borderRadius: 0, fontSize: 12}}
        danger
        onClick={() => onImpersonateLogin()}
        
      >
        Exit <i className="fas fa-sign-out-alt" />
      </button>
    </div>
  );
};

export default ImpersonatingUserExist;
