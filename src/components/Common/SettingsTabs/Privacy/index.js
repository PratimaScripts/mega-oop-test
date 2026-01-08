import React, { useState} from "react";
import { Tooltip } from "antd";
// import { useHistory } from "react-router-dom";
// import Switch from "react-switch";
import "./style.scss";
import { useMutation, useQuery } from "react-apollo";
import isEmpty from "lodash/isEmpty";
import showNotification from "config/Notification";
import AccountQueries from "config/queries/account";

const PrivacySetting = (props) => {
  // const history = useHistory()
  const [privacy, setPrivacy] = useState({
    profilePicture: {
      onlyMe: false,
      connection: false,
      public: false
    },
    gender: {
      onlyMe: false,
      connection: false,
      public: false
    },
    age: {
      onlyMe: false,
      connection: false,
      public: false
    },
    work: {
      onlyMe: false,
      connection: false,
      public: false
    },
    references: {
      onlyMe: false,
      connection: false,
      public: false
    },
    selfDeclaration: {
      onlyMe: false,
      connection: false,
      public: false
    },
    socialConnect: {
      onlyMe: false,
      connection: false,
      public: false
    }
  })

  // const [updatePrivacySettings, setUpdatePrivacySetting] = useState(false);

  useQuery(AccountQueries.fetchPrivacyInformation, {
    onCompleted: ({ getPrivacyInformation }) => {
      if (!isEmpty(getPrivacyInformation) && getPrivacyInformation.success) {
        setPrivacy(getPrivacyInformation.data)
      }
    }
  })

  const [updatePrivacy] = useMutation(AccountQueries.updatePrivacyData, {
    onCompleted: ({ updatePrivacyInformation }) => {
      if (!isEmpty(updatePrivacyInformation) && updatePrivacyInformation.success) {
        showNotification(
          "success",
          "Privacy Preferences Updated!",
          "Your Privacy Preferences have been updated successfully!"
        );
        setPrivacy(updatePrivacyInformation.data);
      } else {
        showNotification(
          "error",
          "An error occured",
          updatePrivacyInformation.message
        );
        // this.context.endLoading();
      }
    }
  })


  const handleChange = (res) => {
      updatePrivacy({ variables: res });
  }

  return (
    <div className="privacy_setting">
      <div className="">
        <div className="table_wrap">
          <div className="box box-form-wrapper">
            <div className="table-responsive">
              <table className="table table-bordered table-acc-settings">
                <thead>
                  <tr>
                    <th scope="col" className="th__width">
                      Particulars
                    </th>
                    <th className="text-center th__pl1" scope="col">
                      Only Me
                    </th>
                    <th className="text-center" scope="col">
                      My Connections{" "}
                      <Tooltip
                        overlayClassName="tooltip__color"
                        title="Connection will be enabled once appointment is booked with landlord or order accepted by ServicePro or on user request"
                      >
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                          alt="i"
                        />
                      </Tooltip>
                      {/* <span
                        className="info-circle"
                        data-toggle="tooltip"
                        data-placement="left"
                        title="Connection will be enabled once appointment is booked with landlord or order accepted by ServicePro or on user request"
                      >
                        <i className="fas fa-info"></i>
                      </span> */}
                    </th>
                    <th className="text-center th__pl1" scope="col">
                      Public
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Profile Picture</th>
                    <td className="text-center">
                      <label className="switch" for="profilePictureMe">
                        <input
                          onChange={value => {
                            let updated = {
                              ...privacy, profilePicture:
                              {
                                ...privacy.profilePicture,
                                onlyMe: !privacy.profilePicture.onlyMe,
                              }}
                            setPrivacy(updated);
                            handleChange(updated);
                          }}
                          checked={privacy.profilePicture.onlyMe}
                          type="checkbox"
                          id="profilePictureMe"
                        />
                        <div className="slider round"></div>
                      </label>
                    </td>
                    <td className="text-center">
                      <label className="switch" for="profilePictureConnection">
                        <input
                          checked={privacy.profilePicture.connection}
                          onChange={value => {
                            let updated = {
                              ...privacy, profilePicture:
                              {
                                ...privacy.profilePicture,
                                connection: !privacy.profilePicture.connection,
                              }}
                            setPrivacy(updated);
                            handleChange(updated);
                          }}

                          type="checkbox"
                          id="profilePictureConnection"
                        />
                        <div className="slider round"></div>
                      </label>
                    </td>
                    <td className="text-center">
                      <label className="switch" for="profilePicturePublic">
                        <input
                          checked={privacy.profilePicture.public}
                          onChange={value => {
                            let updated = {
                              ...privacy, profilePicture:
                              {
                                ...privacy.profilePicture,
                                public: !privacy.profilePicture.public,
                              }}
                            setPrivacy(updated);
                            handleChange(updated);
                          }}
                          type="checkbox"
                          id="profilePicturePublic"
                        />
                        <div className="slider round"></div>
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Gender</th>
                    <td className="text-center">
                      <label className="switch" for="genderMe">
                        <input
                          checked={privacy.gender.onlyMe}
                          onChange={value => {
                            let updated = {
                              ...privacy, gender:
                              {
                                ...privacy.gender,
                                onlyMe: !privacy.gender.onlyMe,
                              }}
                            setPrivacy(updated);
                            handleChange(updated);
                          }}
                          type="checkbox"
                          id="genderMe"
                        />
                        <div className="slider round"></div>
                      </label>
                    </td>
                    <td className="text-center">
                      <label className="switch" for="genderConnection">
                        <input
                          checked={privacy.gender.connection}
                          onChange={value =>{
                            let updated = {
                              ...privacy, gender:
                              {
                                ...privacy.gender,
                                connection: !privacy.gender.connection,
                              }}
                            setPrivacy(updated);
                            handleChange(updated);
                          }}

                          type="checkbox"
                          id="genderConnection"
                        />
                        <div className="slider round"></div>
                      </label>
                    </td>
                    <td className="text-center">
                      <label className="switch" for="genderPublic">
                        <input
                          checked={privacy.gender.public}
                          onChange={value => {
                            let updated = {
                              ...privacy, gender:
                              {
                                ...privacy.gender,
                                public: !privacy.gender.public,
                              }}
                            setPrivacy(updated);
                            handleChange(updated);
                          }}

                          type="checkbox"
                          id="genderPublic"
                        />
                        <div className="slider round"></div>
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Age</th>
                    <td className="text-center">
                      <label className="switch" for="ageMe">
                        <input
                          checked={privacy.age.onlyMe}
                          onChange={value => {
                            let updated = {
                              ...privacy, age:
                              {
                                ...privacy.age,
                                onlyMe: !privacy.age.onlyMe,
                              }}
                            setPrivacy(updated);
                            handleChange(updated);
                          }}

                          type="checkbox"
                          id="ageMe"
                        />
                        <div className="slider round"></div>
                      </label>
                    </td>
                    <td className="text-center">
                      <label className="switch" for="ageConnection">
                        <input
                          checked={privacy.age.connection}
                          onChange={value => {
                            let updated = {
                              ...privacy, age:
                              {
                                ...privacy.age,
                                connection: !privacy.age.connection,
                              }}
                            setPrivacy(updated);
                            handleChange(updated);
                          }}

                          type="checkbox"
                          id="ageConnection"
                        />
                        <div className="slider round"></div>
                      </label>
                    </td>
                    <td className="text-center">
                      <label className="switch" for="agePublic">
                        <input
                          checked={privacy.age.public}
                          onChange={value => {
                            let updated = {
                              ...privacy, age:
                              {
                                ...privacy.age,
                                public: !privacy.age.public,
                              }}
                            setPrivacy(updated);
                            handleChange(updated);
                          }}
                          type="checkbox"
                          id="agePublic"
                        />
                        <div className="slider round"></div>
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Work / Employment{" "}
                      <Tooltip
                        overlayClassName="tooltip__color"
                        title="Default setting public for ServicePro and Landlord, for Renter its my connection"
                      >
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                          alt="i"
                        />
                      </Tooltip>
                      {/* <span
                        className="info-circle"
                        data-toggle="tooltip"
                        data-placement="left"
                        title="Default setting public for ServicePro and Landlord, for Renter its my connection"
                      >
                        <i className="fas fa-info"></i>
                      </span> */}
                    </th>
                    <td className="text-center">
                      <label className="switch" for="workMe">
                        <input
                          checked={privacy.work.onlyMe}
                          onChange={value => {
                            let updated = {
                              ...privacy, work:
                              {
                                ...privacy.work,
                                onlyMe: !privacy.work.onlyMe,
                              }}
                            setPrivacy(updated);
                            handleChange(updated);
                          }}
                          type="checkbox"
                          id="workMe"
                        />
                        <div className="slider round"></div>
                      </label>
                    </td>
                    <td className="text-center">
                      <label className="switch" for="workConnection">
                        <input
                          checked={privacy.work.connection}
                          onChange={value => {
                            let updated = {
                              ...privacy, work:
                              {
                                ...privacy.work,
                                connection: !privacy.work.connection,
                              }}
                            setPrivacy(updated);
                            handleChange(updated);
                          }}
                          type="checkbox"
                          id="workConnection"
                        />
                        <div className="slider round"></div>
                      </label>
                    </td>
                    <td className="text-center">
                      <label className="switch" for="workPublic">
                        <input
                          checked={privacy.work.public}
                          onChange={value => {
                            let updated = {
                              ...privacy, work:
                              {
                                ...privacy.work,
                                public: !privacy.work.public,
                              }}
                            setPrivacy(updated);
                            handleChange(updated);
                          }}
                          type="checkbox"
                          id="workPublic"
                        />
                        <div className="slider round"></div>
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      References{" "}
                      <Tooltip
                        overlayClassName="tooltip__color"
                        title="References received from verified past landlord, verified employee, verified Renters and verified ServicePro"
                      >
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                          alt="i"
                        />
                      </Tooltip>
                      {/* <span
                        className="info-circle"
                        data-toggle="tooltip"
                        data-placement="left"
                        title="References received from verified past landlord, verified employee, verified Renters and verified ServicePro"
                      >
                        <i className="fas fa-info"></i>
                      </span> */}
                    </th>
                    <td className="text-center">
                      <label className="switch" for="referencesMe">
                        <input
                          checked={privacy.references.onlyMe}
                          onChange={value => {
                            let updated = {
                              ...privacy, references:
                              {
                                ...privacy.references,
                                onlyMe: !privacy.references.onlyMe,
                              }}
                            setPrivacy(updated);
                            handleChange(updated);
                          }}
                          type="checkbox"
                          id="referencesMe"
                        />
                        <div className="slider round"></div>
                      </label>
                    </td>
                    <td className="text-center">
                      <label className="switch" for="referencesConnection">
                        <input
                          checked={privacy.references.connection}
                          onChange={value => {
                            let updated = {
                              ...privacy, references:
                              {
                                ...privacy.references,
                                connection: !privacy.references.connection,
                              }}
                            setPrivacy(updated);
                            handleChange(updated);
                          }}
                          type="checkbox"
                          id="referencesConnection"
                        />
                        <div className="slider round"></div>
                      </label>
                    </td>
                    <td className="text-center">
                      <label className="switch" for="referencesPublic">
                        <input
                          checked={privacy.references.public}
                          onChange={value => {
                            let updated = {
                              ...privacy, references:
                              {
                                ...privacy.references,
                                public: !privacy.references.public,
                              }}
                            setPrivacy(updated);
                            handleChange(updated);
                          }}
                          type="checkbox"
                          id="referencesPublic"
                        />
                        <div className="slider round"></div>
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Self-declaration{" "}
                      <Tooltip
                        overlayClassName="tooltip__color"
                        title="Only for Renters - Number of dependents, Pets, Smoking, car, disability, benefit etc. "
                      >
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                          alt="i"
                        />
                      </Tooltip>
                      {/* <span
                        className="info-circle"
                        data-toggle="tooltip"
                        data-placement="left"
                        title="Only for Renters - Number of dependents, Pets, Smoking, car, disability, benefit etc. "
                      >
                        <i className="fas fa-info"></i>
                      </span> */}
                    </th>
                    <td className="text-center">
                      <label className="switch" for="declarationMe">
                        <input
                          checked={privacy.selfDeclaration.onlyMe}
                          onChange={value => {
                            let updated = {
                              ...privacy, selfDeclaration:
                              {
                                ...privacy.selfDeclaration,
                                onlyMe: !privacy.selfDeclaration.onlyMe,
                              }}
                            setPrivacy(updated);
                            handleChange(updated);
                          }}
                          type="checkbox"
                          id="declarationMe"
                        />
                        <div className="slider round"></div>
                      </label>
                    </td>
                    <td className="text-center">
                      <label className="switch" for="declarationConnection">
                        <input
                          checked={privacy.selfDeclaration.connection}
                          onChange={value => {
                            let updated = {
                              ...privacy, selfDeclaration:
                              {
                                ...privacy.selfDeclaration,
                                connection: !privacy.selfDeclaration.connection,
                              }}
                            setPrivacy(updated);
                            handleChange(updated);
                          }}
                          type="checkbox"
                          id="declarationConnection"
                        />
                        <div className="slider round"></div>
                      </label>
                    </td>
                    <td className="text-center">
                      <label className="switch" for="declarationPublic">
                        <input
                          checked={privacy.selfDeclaration.public}
                          onChange={value => {
                            let updated = {
                              ...privacy, selfDeclaration:
                              {
                                ...privacy.selfDeclaration,
                                public: !privacy.selfDeclaration.public,
                              }}
                            setPrivacy(updated);
                            handleChange(updated);
                          }}

                          type="checkbox"
                          id="declarationPublic"
                        />
                        <div className="slider round"></div>
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Social Connect</th>
                    <td className="text-center">
                      <label className="switch" for="socialMe">
                        <input
                          checked={privacy.socialConnect.onlyMe}
                          onChange={value => {
                            let updated = {
                              ...privacy, socialConnect:
                              {
                                ...privacy.socialConnect,
                                onlyMe: !privacy.socialConnect.onlyMe,
                              }}
                            setPrivacy(updated);
                            handleChange(updated);
                          }}
                          type="checkbox"
                          id="socialMe"
                        />
                        <div className="slider round"></div>
                      </label>
                    </td>
                    <td className="text-center">
                      <label className="switch" for="socialConnection">
                        <input
                          checked={privacy.socialConnect.connection}
                          onChange={value => {
                            let updated = {
                              ...privacy, socialConnect:
                              {
                                ...privacy.socialConnect,
                                connection: !privacy.socialConnect.connection,
                              }}
                            setPrivacy(updated);
                            handleChange(updated);
                          }}
                          type="checkbox"
                          id="socialConnection"
                        />
                        <div className="slider round"></div>
                      </label>
                    </td>
                    <td className="text-center">
                      <label className="switch" for="socialPublic">
                        <input
                          checked={privacy.socialConnect.public}
                          onChange={value => {
                            let updated = {
                              ...privacy, socialConnect:
                              {
                                ...privacy.socialConnect,
                                public: !privacy.socialConnect.public,
                              }}
                            setPrivacy(updated);
                            handleChange(updated);
                          }}
                          type="checkbox"
                          id="socialPublic"
                        />
                        <div className="slider round"></div>
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySetting;
