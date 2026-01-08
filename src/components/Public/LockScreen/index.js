import { Button } from "antd";
import showNotification from "config/Notification";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useContext, useEffect, useRef, useState } from "react";
import { withApollo } from "react-apollo";
import cookie from "react-cookies";
import { withRouter } from "react-router-dom";
import { removeTokenFromCookie } from "utils/cookie";
import { getLockScreenState, setLockScreenState } from "utils/storage";
import Queries from "../../../config/queries/login";
import { SocialLogin } from "../Login/LoginFormEmail";
import { UserDataContext } from 'store/contexts/UserContext';
import "./style.scss";


const LockScreen = props => {
  const formRef = useRef(null);
  const [loading, setLoader] = useState(false);
  const [signoutTime] = useState(process.env.REACT_APP_LOCKSCREEN_LOGOUT);
  const [warningTime] = useState(process.env.REACT_APP_LOCKSCREEN_TIMEOUT);
  /** initial lock state settting into App lock */
  const [isLocked, setIsLock] = useState(getLockScreenState());
  const [pwdCheckError, setPwdCheckStatus] = useState("form-control");
  const { state: userState } = useContext(UserDataContext);
  const checkPassword = async e => {
    e.preventDefault();
    setLoader(true);
    const checkPasswordQuery = await props.client.query({
      query: Queries.checkPassword,
      variables: {
        password: e.target[0].value
      }
    });

    if (
      !isEmpty(checkPasswordQuery.data.checkPassword) &&
      get(checkPasswordQuery, "data.checkPassword.success")
    ) {
      setPwdCheckStatus("form-control");
      formRef.current.reset();
      setLockScreenState({ isLock: false });
      setLoader(false);
      setIsLock(false);
    } else {
      setLoader(false);
      setPwdCheckStatus("form-control password_check__error");
    }
  };


  let warnTimeout;
  let logoutTimeout;

  const warn = () => {
    if (!userState?.isImpersonate) {
      setLockScreenState({ isLock: true });
      setIsLock(true);
    }
  };
  const logout = () => {
    // cookie.remove(process.env.REACT_APP_AUTH_TOKEN, { path: "/" });
    removeTokenFromCookie()
    localStorage.setItem("isLoggedOut", true);
    setLockScreenState({ isLocked: false });
    window.location = "/login";
  };

  const setTimeouts = () => {
    warnTimeout = setTimeout(warn, warningTime);
    logoutTimeout = setTimeout(logout, signoutTime);
  };

  const clearTimeouts = () => {
    if (warnTimeout) clearTimeout(warnTimeout);
    if (logoutTimeout) clearTimeout(logoutTimeout);
  };

  useEffect(() => {
    const events = [
      "load",
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress"
    ];

    const resetTimeout = () => {
      clearTimeouts();
      setTimeouts();
    };
    const checkError = () => {
      if (cookie.load('lockError')) {
        showNotification("error", cookie.load('lockError'), "Please Try Again...");
      }
    }
    /** If App locked, will run for check next state  */
    if (isLocked) {
      const checkLockState = setInterval(() => {
        if (!getLockScreenState()) {
          setIsLock(getLockScreenState());
          clearInterval(checkLockState);
        }
      }, 1000)
    }

    for (let i in events) {
      window.addEventListener(events[i], resetTimeout);
    }
    window.addEventListener("focus", checkError);
    setTimeouts();
    return () => {
      for (let i in events) {
        window.removeEventListener(events[i], resetTimeout);
        window.removeEventListener("focus", checkError);
        clearTimeouts();
      }
    };
  });

  return (
    <div
      className={
        isLocked
          ? "lock__unlock--screen"
          : "lock__unlock--screen unlock__screen"
      }
    >
      <div className="lock_bg">
        <div className="container">
          <div className="text-center">
            <div className="user_img mb-3">
              <img
                src={
                  get(props, "userData.avatar")
                    ? get(props, "userData.avatar")
                    : "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/user-avatar.png"
                }
                className="rounded-circle"
                alt="img"
              />
            </div>
            <h4 className="mb-0">
              Hello{" "}
              {get(props, "userData.firstName") &&
                `${get(props, "userData.firstName")}`}
              !
            </h4>
            <p className="mb-4">Your session is about to expire!</p>
            <form onSubmit={checkPassword} ref={formRef}>
              <div className="form-group">
                <input
                  type="password"
                  className={pwdCheckError}
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Enter Password"
                  autoComplete="true"
                />
                <small
                  id="emailHelp"
                  className="form-text text-muted mb-4 text-left"
                >
                  Enter Password to unlock your screen.
                </small>
                <Button
                  loading={loading}
                  color="primary"
                  htmlType="submit"
                  className="btn btn-primary"
                >
                  Unlock Screen
                </Button>
                <div className="or-seperator">
                  <span>OR</span>
                </div>
                <SocialLogin isLockScreen />
                <small className="form-text text-muted">
                  <a
                    href="http://www.rentoncloud.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Take me to home page.
                  </a>
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(withApollo(LockScreen));
