import React, { useContext, useEffect, useState } from "react";
import AdminQueries from "config/queries/admin";
import { useQuery, useMutation } from "@apollo/react-hooks";
import showNotification from "config/Notification";
import { Modal, Input, Spin } from "antd";
import { UserDataContext } from "store/contexts/UserContext";

const ViewWebpageButton = () => {
  const { state } = useContext(UserDataContext);

  const userData = state.userData;

  const { data: allusernames } = useQuery(AdminQueries.usernameList);
  const { data: findUserRecord } = useQuery(AdminQueries.findUsername, {
    variables: { userId: userData._id },
  });

  const [usernameIsAvailable, setUsernameIsAvailable] = useState();
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameIsValid, setUsernameIsValid] = useState(false);

  useEffect(() => {
    return () => {
      setUsername("");
      setUsernameIsValid(false);
    };
  }, [showModal]);

  const handleOnInputChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setUsernameIsValid(true);

    const index = allusernames.usernameList.data.findIndex(
      (username) => username.userName === value
    );

    if (index !== -1) {
      setUsernameIsValid(false);
    } else {
      setUsernameIsValid(true);
    }
  };

  const [createUsername, { loading: createUsernameLoading }] = useMutation(
    AdminQueries.createUsernameList,
    {
      onCompleted: (response) => {
        if (response.createUsernameList.success) {
          showNotification(
            "success",
            "Successfully Activated",
            "Username Successfully Activated"
          );
          setUsernameIsAvailable(response.createUsernameList.data.userName);

          setShowModal(false);
        } else {
          showNotification(
            "error",
            "Error",
            response.createUsernameList.message
          );
        }
      },
      onError: () => {
        showNotification("error", "Error!", "Oops ! There is some Error");
        // console.log("error", error);
      },
    }
  );

  const activatePortfolio = () => {
    if (userData.role === "servicepro" || userData.role === "landlord") {
      return createUsername({
        variables: {
          userId: userData._id,
          userName: username.toLowerCase(),
          activateLandlord: userData.role === "landlord" ? true : false,
          activatedServicePro: userData.role === "servicepro" ? true : false,
        },
      });
    } else {
      return showNotification(
        "error",
        "Error",
        "Renter cannot create username"
      );
    }
  };

  return (
    <>
      {usernameIsAvailable ||
      (findUserRecord && findUserRecord.findUsername.success) ? (
        <a
          className="btn btn-outline-primary btn__activate_webpage"
          target="_blank"
          rel="noreferrer"
          href={`${process.env.REACT_APP_ROC_PUBLIC}/${userData.role}/${
            findUserRecord.findUsername.success
              ? findUserRecord.findUsername.data.userName
              : usernameIsAvailable
          }`}
        >
          View My Webpage
        </a>
      ) : (
        <button
          onClick={() => {
            setShowModal(true);
          }}
          className="btn btn-outline-primary btn__activate_webpage"
        >
          Activate Webpage
        </button>
      )}

      {showModal && (
        <Modal
          visible={showModal}
          confirmLoading={createUsernameLoading}
          title="Activate Business Website"
          okText="Activate My Webpage"
          okButtonProps={{
            disabled: !usernameIsValid || !username,
          }}
          onCancel={() => setShowModal(false)}
          onOk={() => {
            activatePortfolio();
          }}
        >
          <Spin spinning={createUsernameLoading} tip="Creating username...">
            <h6>Choose your website listing page name</h6>

            <div>
              <Input
                value={username}
                addonBefore={`www.rentoncloud.com/${userData.role}/`}
                type="text"
                placeholder="Enter Website Name"
                aria-label="website-url"
                aria-describedby="website-url"
                onChange={handleOnInputChange}
              />
            </div>

            {username && (
              <div className={`mt-3 ${!usernameIsValid && "text-danger"}`}>
                {usernameIsValid ? "Looks good" : "Username is already taken."}
              </div>
            )}
          </Spin>
        </Modal>
      )}
    </>
  );
};

export default ViewWebpageButton;
